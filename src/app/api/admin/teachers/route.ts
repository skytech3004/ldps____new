import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "teacher.txt");
    const rawText = await fs.readFile(filePath, "utf8");
    const lines = rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const roster = [];

    for (let index = 0; index < lines.length; ) {
      const name = lines[index];
      const repeatedName = lines[index + 1];
      const designation = lines[index + 2];

      if (name && repeatedName && designation && name === repeatedName) {
        roster.push({ name, designation });
        index += 3;
        continue;
      }

      if (name && designation) {
        roster.push({ name, designation });
        index += 2;
        continue;
      }

      index += 1;
    }

    return NextResponse.json(roster);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load teachers roster.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of teachers." }, { status: 400 });
    }

    const lines = body
      .map((t) => {
        const name = String(t.name || "").trim();
        const designation = String(t.designation || "").trim();
        if (!name || !designation) return "";
        return `${name}\n${name}\n${designation}`;
      })
      .filter(Boolean);

    const rawText = "\n" + lines.join("\n\n") + "\n";
    const filePath = path.join(process.cwd(), "teacher.txt");
    await fs.writeFile(filePath, rawText, "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save teachers roster.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
