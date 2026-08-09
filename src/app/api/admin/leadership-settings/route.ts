import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { LeadershipPageSettingsModel } from "@/models/LeadershipPageSettings";
import { defaultLeadershipIntroContent } from "@/data/leadershipPageIntro";

const SETTINGS_KEY = "leadership";

async function getOrSeedSettings() {
  let settings = await LeadershipPageSettingsModel.findOne({ key: SETTINGS_KEY }).lean();

  if (!settings) {
    settings = await LeadershipPageSettingsModel.create({
      key: SETTINGS_KEY,
      introContent: defaultLeadershipIntroContent,
    });
  }

  return settings;
}

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await getOrSeedSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch leadership page settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const updated = await LeadershipPageSettingsModel.findOneAndUpdate(
      { key: SETTINGS_KEY },
      {
        key: SETTINGS_KEY,
        introContent: String(body.introContent ?? ""),
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update leadership page settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
