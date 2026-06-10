import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { HolidayCalendarModel } from "@/models/HolidayCalendar";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch the latest published holiday calendar
    const item = await HolidayCalendarModel.findOne().sort({ createdAt: -1 }).lean();
    return NextResponse.json(item || null);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch holiday calendar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.pdfUrl) {
      return NextResponse.json({ error: "Missing required fields (title, pdfUrl)." }, { status: 400 });
    }

    const publishedDate = body.publishedAt ? new Date(body.publishedAt) : new Date();

    // Check if an entry already exists, update it, or create a new one
    let calendar = await HolidayCalendarModel.findOne();
    if (calendar) {
      calendar.title = body.title;
      calendar.pdfUrl = body.pdfUrl;
      calendar.publishedAt = publishedDate;
      await calendar.save();
    } else {
      calendar = await HolidayCalendarModel.create({
        title: body.title,
        pdfUrl: body.pdfUrl,
        publishedAt: publishedDate,
      });
    }

    return NextResponse.json(calendar, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save holiday calendar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
