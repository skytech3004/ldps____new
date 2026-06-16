const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const AdmZip = require("adm-zip");

// Helper to load env variables manually from .env files
function loadEnv() {
  const envPaths = [path.join(process.cwd(), ".env"), path.join(process.cwd(), ".env.local")];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value.trim();
        }
      }
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "school_admin";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const BACKUP_TO_EMAIL = process.env.BACKUP_TO_EMAIL;

const MAX_ATTACHMENT_SIZE_MB = 20; // Safe threshold for email attachments (normally 25MB limit)

async function runBackup() {
  const dateStr = new Date().toISOString().slice(0, 10);
  console.log(`Starting weekly backup for ${dateStr}...`);

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in env configuration.");
    return;
  }
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !BACKUP_TO_EMAIL) {
    console.warn("Mail SMTP settings are incomplete in environment variables. Email will not be sent.");
  }

  // Create temporary working directories
  const tmpDir = path.join(__dirname, `tmp-backup-${dateStr}`);
  const dbDumpDir = path.join(tmpDir, "database");
  const uploadsDir = path.join(tmpDir, "uploads");

  fs.mkdirSync(tmpDir, { recursive: true });
  fs.mkdirSync(dbDumpDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });

  let client;
  let dbCollections = [];
  let backupFilesList = [];

  try {
    // 1. Export MongoDB Database Collections to JSON
    console.log("Connecting to database...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    
    const collections = await db.listCollections().toArray();
    console.log(`Dumping ${collections.length} collections...`);
    
    for (const col of collections) {
      const data = await db.collection(col.name).find({}).toArray();
      const filePath = path.join(dbDumpDir, `${col.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      dbCollections.push(col.name);
    }
    console.log("Database collections dumped successfully.");

    // 2. Scan Uploads Folder
    const publicUploadsSrc = path.join(process.cwd(), "public", "uploads");
    if (fs.existsSync(publicUploadsSrc)) {
      console.log("Scanning public/uploads directory...");
      
      const getFilesRecursively = (dir, fileList = []) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const name = path.join(dir, file);
          if (fs.statSync(name).isDirectory()) {
            getFilesRecursively(name, fileList);
          } else {
            fileList.push(name);
          }
        }
        return fileList;
      };

      const allUploadFiles = getFilesRecursively(publicUploadsSrc);
      
      for (const file of allUploadFiles) {
        const relativePath = path.relative(publicUploadsSrc, file);
        const stats = fs.statSync(file);
        backupFilesList.push({
          relPath: relativePath,
          absoluteSrc: file,
          sizeMb: stats.size / (1024 * 1024),
        });
      }
    }

    // 3. Decide Compression and Attachment strategy
    // Calculate total size of uploads
    const totalUploadsSizeMb = backupFilesList.reduce((sum, f) => sum + f.sizeMb, 0);
    console.log(`Total Uploads Size: ${totalUploadsSizeMb.toFixed(2)} MB`);

    let zipPath;
    let backupType = "full"; // full (db + uploads) or partial (db only)
    
    const zip = new AdmZip();

    // Add Database dump to the zip
    const dbFiles = fs.readdirSync(dbDumpDir);
    for (const file of dbFiles) {
      zip.addLocalFile(path.join(dbDumpDir, file), "database");
    }

    // Add Uploads if size permits
    if (totalUploadsSizeMb <= MAX_ATTACHMENT_SIZE_MB) {
      console.log("Uploads size is small enough. Creating full backup (DB + Uploads)...");
      for (const fileInfo of backupFilesList) {
        const targetZipDir = path.dirname(fileInfo.relPath);
        zip.addLocalFile(fileInfo.absoluteSrc, targetZipDir === "." ? "uploads" : path.join("uploads", targetZipDir));
      }
      zipPath = path.join(__dirname, `full-backup-${dateStr}.zip`);
    } else {
      console.warn("Uploads folder exceeds attachment size limit. Creating database-only email backup.");
      backupType = "db-only";
      zipPath = path.join(__dirname, `db-backup-${dateStr}.zip`);
    }

    zip.writeZip(zipPath);
    console.log(`Zip archive created at ${zipPath}`);

    // 4. Send Email Report
    if (SMTP_HOST && SMTP_USER && SMTP_PASS && BACKUP_TO_EMAIL) {
      console.log("Sending email backup report...");

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const bodyText = backupType === "full" 
        ? `Hello Admin,
        
Your weekly system backup completed successfully. 

Date: ${dateStr} (Sunday)
Backup Type: Full Backup (Database + Uploads)
Attachment: full-backup-${dateStr}.zip

Database Collections Backed Up:
${dbCollections.map(c => `- ${c}`).join("\n")}

Total Upload Files Zipped: ${backupFilesList.length} files (${totalUploadsSizeMb.toFixed(2)} MB)

Best regards,
LPS School System Scheduler`
        : `Hello Admin,
        
Your weekly system backup completed. 

⚠️ WARNING: The uploads folder (${totalUploadsSizeMb.toFixed(2)} MB) exceeds the ${MAX_ATTACHMENT_SIZE_MB} MB email attachment limit. 
To ensure your backup succeeds, we have attached the Database Dump only. Please download the "public/uploads" folder directly from your VPS server.

Date: ${dateStr} (Sunday)
Backup Type: Partial Backup (Database Only)
Attachment: db-backup-${dateStr}.zip

Database Collections Backed Up:
${dbCollections.map(c => `- ${c}`).join("\n")}

Uploaded Files List (Skipped in email attachment):
${backupFilesList.map(f => `- ${f.relPath} (${f.sizeMb.toFixed(2)} MB)`).join("\n")}

Best regards,
LPS School System Scheduler`;

      await transporter.sendMail({
        from: `"LPS School Backups" <${SMTP_USER}>`,
        to: BACKUP_TO_EMAIL,
        subject: `[LPS System Backup] Weekly Backup Report - ${dateStr} (${backupType.toUpperCase()})`,
        text: bodyText,
        attachments: [
          {
            filename: path.basename(zipPath),
            path: zipPath,
          }
        ]
      });

      console.log("Backup email sent successfully!");
    } else {
      console.log("Skipping email send. Configure SMTP settings in your .env file to enable email delivery.");
    }

    // Clean up zipped file
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  } catch (error) {
    console.error("Backup execution failed:", error);
    
    // Attempt to send failure report email
    if (SMTP_HOST && SMTP_USER && SMTP_PASS && BACKUP_TO_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
        await transporter.sendMail({
          from: `"LPS School Backups" <${SMTP_USER}>`,
          to: BACKUP_TO_EMAIL,
          subject: `🚨 [LPS System Backup] FAILED - ${dateStr}`,
          text: `Hello Admin,
          
The weekly backup process encountered a critical failure on ${dateStr}.

Error Message: 
${error.message}

Please check the server logs immediately.

Best regards,
LPS School System Scheduler`
        });
      } catch (mailError) {
        console.error("Failed to send error notification email:", mailError);
      }
    }
  } finally {
    // Close DB Client
    if (client) await client.close();

    // Clean up temporary workspace directory
    if (fs.existsSync(tmpDir)) {
      console.log("Cleaning up temporary directories...");
      const removeDirectory = (dirPath) => {
        if (fs.existsSync(dirPath)) {
          fs.readdirSync(dirPath).forEach((file) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              removeDirectory(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(dirPath);
        }
      };
      removeDirectory(tmpDir);
    }
    console.log("Backup script finished execution.");
  }
}

runBackup();
