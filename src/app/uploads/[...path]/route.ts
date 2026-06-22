import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePathArray } = await context.params;

    if (!filePathArray || filePathArray.length === 0) {
      return new Response("Bad Request", { status: 400 });
    }

    const projectRoot = process.cwd();
    const uploadsBaseDir = path.join(projectRoot, "public", "uploads");
    const diskPath = path.resolve(uploadsBaseDir, ...filePathArray);

    // Security check: Prevent Directory Traversal attacks (ensure path resides in uploads folder)
    const relative = path.relative(uploadsBaseDir, diskPath);
    const isSafe = relative && !relative.startsWith("..") && !path.isAbsolute(relative);
    
    if (!isSafe) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      const fileBuffer = await fs.readFile(diskPath);
      
      // Determine correct mime-type based on extension
      const ext = path.extname(diskPath).toLowerCase();
      let contentType = "application/octet-stream";
      
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".gif") contentType = "image/gif";
      else if (ext === ".svg") contentType = "image/svg+xml";
      else if (ext === ".pdf") contentType = "application/pdf";
      else if (ext === ".txt") contentType = "text/plain";

      return new Response(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server Error";
    return new Response(msg, { status: 500 });
  }
}
