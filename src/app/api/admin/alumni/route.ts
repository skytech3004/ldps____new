import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AlumniModel } from "@/models/Alumni";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await AlumniModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch alumni list.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Required fields check
    const requiredFields = [
      "fullName",
      "parentsName",
      "dateOfBirth",
      "mobileNumber",
      "emailId",
      "permanentAddress",
      "classCompleted",
      "passingYear",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    const created = await AlumniModel.create({
      fullName: body.fullName,
      parentsName: body.parentsName,
      dateOfBirth: new Date(body.dateOfBirth),
      mobileNumber: body.mobileNumber,
      alternateMobile: body.alternateMobile ?? "",
      emailId: body.emailId,
      permanentAddress: body.permanentAddress,
      classCompleted: body.classCompleted,
      passingYear: body.passingYear,
      admissionYear: body.admissionYear ?? "",
      rollNumber: body.rollNumber ?? "",
      occupation: body.occupation ?? "",
      organization: body.organization ?? "",
      officeAddress: body.officeAddress ?? "",
      workEmail: body.workEmail ?? "",
      higherEducation: body.higherEducation ?? "",
      institutionName: body.institutionName ?? "",
      completionYear: body.completionYear ?? "",
      achievements: body.achievements ?? "",
      skills: body.skills ?? "",
      willingToMentor: !!body.willingToMentor,
      interestedInEvents: !!body.interestedInEvents,
      status: "Pending",
      notes: "",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit alumni registration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Alumni ID is required." }, { status: 400 });
    }

    const updated = await AlumniModel.findByIdAndUpdate(
      body.id,
      {
        status: body.status,
        notes: body.notes ?? "",
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Alumni record not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update alumni record.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Alumni ID is required." }, { status: 400 });
    }

    const deleted = await AlumniModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Alumni record not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete alumni record.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
