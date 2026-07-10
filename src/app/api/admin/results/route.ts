import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BoardResultModel } from "@/models/BoardResult";
import { defaultBoardResults } from "@/data/boardResults";

async function seedResults() {
  const count = await BoardResultModel.estimatedDocumentCount();
  if (count === 0) {
    await BoardResultModel.insertMany(defaultBoardResults);
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    await seedResults();

    const { searchParams } = new URL(request.url);
    const listType = searchParams.get("list");
    const yearParam = searchParams.get("year");

    // If query is for lists of years only (e.g. for navbar)
    if (listType === "years") {
      const years = await BoardResultModel.find().select("year").sort({ year: -1 }).lean();
      const list = years.map((y) => y.year);
      return NextResponse.json(list);
    }

    // If query is for a specific year
    if (yearParam) {
      const resultObj = await BoardResultModel.findOne({ year: yearParam }).lean();
      if (!resultObj) {
        return NextResponse.json({ error: "Results for the requested year not found." }, { status: 404 });
      }
      return NextResponse.json(resultObj);
    }

    // Else return all result years
    const allResults = await BoardResultModel.find().sort({ year: -1 }).lean();
    return NextResponse.json(allResults);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch results.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.year) {
      return NextResponse.json({ error: "Academic year is required." }, { status: 400 });
    }

    const exists = await BoardResultModel.findOne({ year: body.year });
    if (exists) {
      return NextResponse.json({ error: `Results for year ${body.year} already exist.` }, { status: 400 });
    }

    const created = await BoardResultModel.create({
      year: body.year,
      passPercentage: body.passPercentage || "100%",
      highestScore: body.highestScore || "0.0%",
      highestScoreScorer: body.highestScoreScorer || "",
      distinctionsCount: Number(body.distinctionsCount || 0),
      batchAverage: body.batchAverage || "0.0%",
      toppers: body.toppers || [],
      students: body.students || [],
      images: body.images || [],
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create result year.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Result ID is required." }, { status: 400 });
    }

    const updated = await BoardResultModel.findByIdAndUpdate(
      body.id,
      {
        year: body.year,
        passPercentage: body.passPercentage,
        highestScore: body.highestScore,
        highestScoreScorer: body.highestScoreScorer,
        distinctionsCount: Number(body.distinctionsCount || 0),
        batchAverage: body.batchAverage,
        toppers: body.toppers,
        students: body.students,
        images: body.images || [],
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Result year not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update results.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Result ID is required." }, { status: 400 });
    }

    const deleted = await BoardResultModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Result record not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete results.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
