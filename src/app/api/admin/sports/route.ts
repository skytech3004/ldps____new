import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SportsModel } from "@/models/Sports";

const defaultPlayers = [
  { name: "Ms. Manisha Kanwar Deora", role: "XII Humanities", achievement: "8 Times National Player (Softball)", image: "" },
  { name: "Ms. Monika Kanwar Ranawat", role: "XII Science", achievement: "3 Times National Player (Softball)", image: "" },
  { name: "Ms. Renu Bhati", role: "XII Science", achievement: "National Player (Softball)", image: "" },
  { name: "Ms. Shivranjani", role: "Class X", achievement: "National Player (Softball)", image: "" }
];

const defaultStats = [
  { count: "67", label: "District Selections" },
  { count: "23", label: "State Selections" },
  { count: "4", label: "National Selections" },
  { count: "94", label: "Total Selections" }
];

const defaultGames = [
  { title: "Basketball Champions", desc: "District Champions in U-14 & U-19 divisions. State Selections include Ms. Rambala, Ms. Jaisal, and Ms. Durga." },
  { title: "Softball Giants", desc: "Dominant state and national selections, training under professional coaches in expansive softball fields." },
  { title: "Table Tennis & Badminton", desc: "Dual district position II. State selection list includes Ms. Kritika, Ms. Ranjana Dave, and Ms. Divya." },
  { title: "Athletics Complex", desc: "Extensive track & field events. State selection includes champion athlete Ms. Priyanka Sirvi." }
];

const defaultComplexImages = [
  "/lps-vidhyawadi/gallery-06.jpg",
  "/lps-vidhyawadi/gallery-09.jpg",
  "/lps-vidhyawadi/gallery-11.jpg"
];

export async function GET() {
  try {
    await connectToDatabase();
    let sports = await SportsModel.findOne({ key: "main" }).lean();
    if (!sports) {
      // Seed initial record if it doesn't exist
      sports = await SportsModel.create({
        key: "main",
        complexImages: defaultComplexImages,
        players: defaultPlayers,
        games: defaultGames,
        stats: defaultStats
      });
    }
    return NextResponse.json(sports);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch sports details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const updated = await SportsModel.findOneAndUpdate(
      { key: "main" },
      { 
        complexImages: body.complexImages,
        players: body.players,
        games: body.games,
        stats: body.stats
      },
      { new: true, runValidators: true, upsert: true }
    );
    
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update sports details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
