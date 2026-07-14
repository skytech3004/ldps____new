import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PROSPECTUS_DIR = path.join(process.cwd(), "public", "uploads", "documents");
const PROSPECTUS_PATH = path.join(PROSPECTUS_DIR, "prospectus.pdf");

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export async function GET() {
  try {
    try {
      const stats = await fs.stat(PROSPECTUS_PATH);
      return NextResponse.json({
        exists: true,
        url: "/uploads/documents/prospectus.pdf",
        filename: "prospectus.pdf",
        size: formatBytes(stats.size),
        updatedAt: stats.mtime.toISOString(),
      });
    } catch {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to query prospectus.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return NextResponse.json({ error: "Please upload a PDF file only." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    
    // Ensure directory exists
    await fs.mkdir(PROSPECTUS_DIR, { recursive: true });
    
    // Write file
    await fs.writeFile(PROSPECTUS_PATH, bytes);

    return NextResponse.json({
      success: true,
      url: "/uploads/documents/prospectus.pdf",
      filename: "prospectus.pdf",
      size: formatBytes(bytes.length),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload prospectus.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    try {
      await fs.unlink(PROSPECTUS_PATH);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Prospectus file does not exist." }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete prospectus.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
