import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { JobOpeningModel, JobApplicationModel } from "@/models/Career";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await JobOpeningModel.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch job openings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.jobTitle || !body.name || !body.email || !body.phone || !body.resume) {
      return NextResponse.json({ error: "Job Title, Name, Email, Phone, and Resume are required." }, { status: 400 });
    }

    const application = await JobApplicationModel.create({
      jobTitle: body.jobTitle,
      name: body.name,
      email: body.email,
      phone: body.phone,
      resume: body.resume,
      message: body.message || "",
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit job application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
