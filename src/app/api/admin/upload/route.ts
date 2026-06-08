import fs from "node:fs/promises";
import path from "node:path";

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
  "media-items": "media-items",
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
    const extension = parsedName.ext || ".bin";
    const cleanBase = safeName(parsedName.name || "upload");
    const cleanFileName = `${timestamp}-${cleanBase}${extension}`;

    const projectRoot = process.cwd();
    const uploadFolder = path.join(projectRoot, "public", "uploads", SECTION_FOLDERS[section]);
    const outputPath = path.join(uploadFolder, cleanFileName);

    await fs.mkdir(uploadFolder, { recursive: true });
    await fs.writeFile(outputPath, bytes);

    const src = `/uploads/${SECTION_FOLDERS[section]}/${cleanFileName}`;
    const record: UploadRecord = {
      id: `${Date.now()}`,
      page,
      section,
      title,
      description,
      fileName: cleanFileName,
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
