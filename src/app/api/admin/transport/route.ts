import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TransportRouteModel } from "@/models/TransportRoute";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await TransportRouteModel.findById(id).lean();
      return NextResponse.json(item);
    }

    const items = await TransportRouteModel.find().sort({ routeNo: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch transport routes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.routeNo || !body.driver || !body.phone || !body.timing) {
      return NextResponse.json({ error: "Missing required fields (routeNo, driver, phone, timing)." }, { status: 400 });
    }

    const created = await TransportRouteModel.create({
      routeNo: body.routeNo,
      driver: body.driver,
      phone: body.phone,
      stops: body.stops || [],
      timing: body.timing,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create route.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Route ID is required." }, { status: 400 });
    }

    if (!body.routeNo || !body.driver || !body.phone || !body.timing) {
      return NextResponse.json({ error: "Missing required fields (routeNo, driver, phone, timing)." }, { status: 400 });
    }

    const updated = await TransportRouteModel.findByIdAndUpdate(
      body.id,
      {
        routeNo: body.routeNo,
        driver: body.driver,
        phone: body.phone,
        stops: body.stops || [],
        timing: body.timing,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Route not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update route.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Route ID is required." }, { status: 400 });
    }

    const deleted = await TransportRouteModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Route not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete route.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
