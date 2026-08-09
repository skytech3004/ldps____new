import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ImportantContactModel } from "@/models/ImportantContact";
import { defaultImportantContacts } from "@/data/contactPage";

async function seedImportantContacts() {
  const count = await ImportantContactModel.countDocuments();
  if (count === 0) {
    await ImportantContactModel.insertMany(defaultImportantContacts);
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    await seedImportantContacts();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const includeInactive = searchParams.get("all") === "true";

    if (id) {
      const item = await ImportantContactModel.findById(id).lean();
      return NextResponse.json(item);
    }

    const filter = includeInactive ? {} : { isActive: true };
    const items = await ImportantContactModel.find(filter).sort({ sortOrder: 1, department: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch important contacts.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.department) {
      return NextResponse.json({ error: "Department name is required." }, { status: 400 });
    }

    const created = await ImportantContactModel.create({
      department: String(body.department).trim(),
      contactName: String(body.contactName ?? "").trim(),
      designation: String(body.designation ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      email: String(body.email ?? "").trim(),
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      isActive: body.isActive !== false,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create contact.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    if (!body.department) {
      return NextResponse.json({ error: "Department name is required." }, { status: 400 });
    }

    const updated = await ImportantContactModel.findByIdAndUpdate(
      body.id,
      {
        department: String(body.department).trim(),
        contactName: String(body.contactName ?? "").trim(),
        designation: String(body.designation ?? "").trim(),
        phone: String(body.phone ?? "").trim(),
        email: String(body.email ?? "").trim(),
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        isActive: body.isActive !== false,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update contact.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    const deleted = await ImportantContactModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete contact.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
