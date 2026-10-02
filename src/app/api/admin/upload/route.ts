import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import heicConvert from "heic-convert";

export const runtime = "nodejs";

const SECTION_FOLDERS: Record<string, string> = {
  hero: "hero",
  notice: "notice",
  banner: "banner",
  gallery: "gallery",
  categories: "categories",
  life: "life",
  documents: "documents",
  carousel: "carousel",
  logo: "logo",
  leadership: "leadership",
  about: "about",
  "about-trust": "about-trust",
  "about-messages": "about-messages",
  "media-items": "media-items",
  hostel: "hostel",
  blogs: "blogs",
  "pre-primary": "pre-primary",
  career: "career",
  events: "events",
  results: "results",
  sports: "sports",
  "managing-committee": "managing-committee",
  teachers: "teachers",
};

type UploadRecord = {
  id: string;
  page: string;
  section: string;
  title: string;
  description: string;
  fileName: string;
  src: string;
  uploadedAt: string;
};

function safeName(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readManifest(manifestPath: string) {
  try {
    const text = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(text) as { uploads?: UploadRecord[] };
    return parsed.uploads ?? [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const page = String(formData.get("page") ?? "home").trim() || "home";
    const sectionInput = String(formData.get("section") ?? "").trim();
    const section = SECTION_FOLDERS[sectionInput] ? sectionInput : "gallery";
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "File is required." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const parsedName = path.parse(file.name);
    const extension = (parsedName.ext || ".bin").toLowerCase();
    const cleanBase = safeName(parsedName.name || "upload");
    
    const isImage = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".avif", ".tif", ".tiff", ".bmp"].includes(extension);
    const projectRoot = process.cwd();
    const uploadFolder = path.join(projectRoot, "public", "uploads", SECTION_FOLDERS[section]);
    await fs.mkdir(uploadFolder, { recursive: true });

    let finalFileName = `${timestamp}-${cleanBase}${extension}`;
    let finalPath = path.join(uploadFolder, finalFileName);

    if (isImage) {
      let processBuffer = bytes;

      // Safe pre-decoding for HEIC/HEIF files if needed
      if (extension === ".heic" || extension === ".heif") {
        try {
          const convertedBuffer = await heicConvert({
            buffer: bytes,
            format: "JPEG",
            quality: 1,
          });
          processBuffer = Buffer.from(convertedBuffer);
        } catch (heicErr) {
          console.warn("heic-convert pre-decoding notice, using original buffer:", heicErr);
          processBuffer = bytes;
        }
      }

      // Safe defensive Sharp pipeline with explicit sRGB normalization to eliminate space=32 GLib errors
      const createPipeline = (buf: Buffer) =>
        sharp(buf, {
          failOn: "none",
          limitInputPixels: false,
        })
          .rotate()
          .toColorspace("srgb");

      let conversionDone = false;

      // Tier 1: AVIF
      try {
        const avifFileName = `${timestamp}-${cleanBase}.avif`;
        const avifPath = path.join(uploadFolder, avifFileName);
        const avifBuffer = await createPipeline(processBuffer)
          .avif({ quality: 80, effort: 4 })
          .toBuffer();

        await fs.writeFile(avifPath, avifBuffer);
        finalFileName = avifFileName;
        finalPath = avifPath;
        conversionDone = true;
      } catch (avifErr) {
        console.warn("AVIF conversion warning, falling back to WebP:", avifErr);
      }

      // Tier 2: WebP Fallback
      if (!conversionDone) {
        try {
          const webpFileName = `${timestamp}-${cleanBase}.webp`;
          const webpPath = path.join(uploadFolder, webpFileName);
          const webpBuffer = await createPipeline(processBuffer)
            .webp({ quality: 85 })
            .toBuffer();

          await fs.writeFile(webpPath, webpBuffer);
          finalFileName = webpFileName;
          finalPath = webpPath;
          conversionDone = true;
        } catch (webpErr) {
          console.warn("WebP conversion warning, falling back to JPEG:", webpErr);
        }
      }

      // Tier 3: JPEG Fallback
      if (!conversionDone) {
        try {
          const jpegFileName = `${timestamp}-${cleanBase}.jpg`;
          const jpegPath = path.join(uploadFolder, jpegFileName);
          const jpegBuffer = await createPipeline(processBuffer)
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();

          await fs.writeFile(jpegPath, jpegBuffer);
          finalFileName = jpegFileName;
          finalPath = jpegPath;
          conversionDone = true;
        } catch (jpegErr) {
          console.warn("JPEG conversion warning, preserving original raw file:", jpegErr);
        }
      }

      // Tier 4: Write original bytes if all conversions fail
      if (!conversionDone) {
        finalFileName = `${timestamp}-${cleanBase}${extension}`;
        finalPath = path.join(uploadFolder, finalFileName);
        await fs.writeFile(finalPath, bytes);
      }
    } else {
      await fs.writeFile(finalPath, bytes);
    }

    // Verify generated file exists and is non-empty
    const fileStat = await fs.stat(finalPath);
    if (!fileStat || fileStat.size === 0) {
      throw new Error(`Generated image file at ${finalPath} is missing or empty.`);
    }

    const src = `/uploads/${SECTION_FOLDERS[section]}/${finalFileName}`;
    const record: UploadRecord = {
      id: `${Date.now()}`,
      page,
      section,
      title,
      description,
      fileName: finalFileName,
      src,
      uploadedAt: now.toISOString(),
    };

    const manifestPath = path.join(projectRoot, "public", "data", "admin-uploads.json");
    const uploads = await readManifest(manifestPath);
    uploads.unshift(record);

    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(
      manifestPath,
      `${JSON.stringify({ updatedAt: now.toISOString(), uploads }, null, 2)}\n`,
      "utf8"
    );

    return Response.json({ ok: true, upload: record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
