import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PrePrimaryItemModel } from "@/models/PrePrimaryItem";

const defaultPrePrimaryShowcaseItems = [
  {
    section: "Pre School",
    title: "Bead Maze Learning",
    description: "Developing fine motor skills and spatial reasoning through tactile wooden bead maze puzzles.",
    src: "https://images.unsplash.com/photo-1603354363425-60bfee595b8d?auto=format&fit=crop&w=600&q=80",
    alt: "tactile bead maze toy block learning",
    sortOrder: 1
  },
  {
    section: "Pre School",
    title: "Cup Stacking Tower",
    description: "Collaborative building exercises to teach kids coordination, scale, balance, and patience.",
    src: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
    alt: "cup stacking and balance coordination",
    sortOrder: 2
  },
  {
    section: "Pre School",
    title: "Preschool Classroom Seating",
    description: "Creating comfortable learning spaces where kids look ahead, listen, and participate together.",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    alt: "children sitting at school tables looking ahead",
    sortOrder: 3
  },
  {
    section: "Pre School",
    title: "Sensory Wall Activity Board",
    description: "Hands-on wall activities featuring gears, shapes, and textures to foster cognitive development.",
    src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    alt: "toddler touching wall activity toys",
    sortOrder: 4
  },
  {
    section: "Pre School",
    title: "Vibrant Creative Playroom",
    description: "Vibrant playroom loaded with educational blocks, dolls, and puzzles for active social play.",
    src: "https://images.unsplash.com/photo-1566378246598-5b11a0fe3a23?auto=format&fit=crop&w=600&q=80",
    alt: "preschool colorful creative toys setup",
    sortOrder: 5
  },
  {
    section: "Academics",
    title: "Interactive Art & Drawing Group",
    description: "Group art classes where teachers guide kids in using pencils, sketch pens, and vibrant colors.",
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    alt: "teacher helping preschool students write and paint at tables",
    sortOrder: 6
  },
  {
    section: "Academics",
    title: "Writing Practice Workshops",
    description: "Developing early pencil grip, handwriting rhythm, and stroke order at custom low preschool desks.",
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    alt: "preschool children writing on white sketch papers",
    sortOrder: 7
  },
  {
    section: "Academics",
    title: "Wooden Alphabet Word Puzzle",
    description: "Understanding letters, building words, and spelling using tactile wooden cutouts.",
    src: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
    alt: "colorful letters puzzle frame",
    sortOrder: 8
  },
  {
    section: "Academics",
    title: "Tactile Interactive Display",
    description: "Experiential learning workshops using hands-on exhibits to trigger spatial curiosity.",
    src: "/lps-vidhyawadi/gallery-04.jpg",
    alt: "primary science experiential learning project display",
    sortOrder: 9
  },
  {
    section: "Academics",
    title: "Clay Modeling & Sculpting",
    description: "Fostering shape comprehension and finger strength using colorful organic modeling clay.",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    alt: "pre-primary kids using clay models",
    sortOrder: 10
  },
  {
    section: "Co-Curricular Activities",
    title: "Origami Paper Craft Demonstration",
    description: "Enhancing spatial orientation and focus by folding vibrant paper frogs and planes.",
    src: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=600&q=80",
    alt: "child holding a cute green origami paper craft",
    sortOrder: 11
  },
  {
    section: "Co-Curricular Activities",
    title: "Group Painting & Crafting Sessions",
    description: "Encouraging collaborative expression as students share paints, brushes, and creative ideas.",
    src: "/lps-vidhyawadi/gallery-07.jpg",
    alt: "saturday bagless day activity craft school room",
    sortOrder: 12
  },
  {
    section: "Co-Curricular Activities",
    title: "Ladybug Papercraft Showcase",
    description: "Cutting, gluing, and constructing gorgeous paper ladybugs to understand insect biology.",
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    alt: "ladybug craft paper models shown by students",
    sortOrder: 13
  },
  {
    section: "Co-Curricular Activities",
    title: "Vibrant Toy Counters",
    description: "Interactive mock counters where children learn to play, coordinate, and organize shapes.",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    alt: "kids activity counter at preschool play room",
    sortOrder: 14
  },
  {
    section: "Sports Activities",
    title: "Outdoor Climbing Jungle Gym",
    description: "Strengthening muscles and gaining confidence by climbing color-blocked playground structures.",
    src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=600&q=80",
    alt: "kids play playground gym climbing frame",
    sortOrder: 15
  },
  {
    section: "Sports Activities",
    title: "Indoor Dynamic Physical Play",
    description: "Developing balance, coordination, and physical fitness with active indoor classroom setups.",
    src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    alt: "preschool sports session in activity room",
    sortOrder: 16
  },
  {
    section: "Sports Activities",
    title: "Strategic Focus & Chess Practice",
    description: "Early logic development and strategy by understanding board configurations and pieces.",
    src: "/lps-vidhyawadi/gallery-02.jpg",
    alt: "school sports chess event matches",
    sortOrder: 17
  },
  {
    section: "Sports Activities",
    title: "Outdoor Recreation Drills",
    description: "Holistic fitness, coordination, and outdoor play sessions under teacher guidance.",
    src: "/lps-vidhyawadi/gallery-12.jpg",
    alt: "outdoor playground sports court games",
    sortOrder: 18
  },
  {
    section: "Sports Activities",
    title: "Pre-Primary Karate & Self Defense",
    description: "Building agility, discipline, focus, and core strength through guided junior karate kates.",
    src: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=80",
    alt: "karate physical training class kids",
    sortOrder: 19
  },
  {
    section: "Sports Activities",
    title: "Road Safety Tricycle Track",
    description: "Interactive play track simulating road lanes, stop lights, and traffic signs for civic education.",
    src: "https://images.unsplash.com/photo-1564144006388-615f4f4ad6f1?auto=format&fit=crop&w=600&q=80",
    alt: "play scooter track school with road signs",
    sortOrder: 20
  },
  {
    section: "Projector Class",
    title: "Smart AV Presentation Hall",
    description: "High-tech audio-visual projector classrooms that make geography, history, and science come alive.",
    src: "/lps-vidhyawadi/gallery-09.jpg",
    alt: "projection room classroom with long tables and display",
    sortOrder: 21
  },
  {
    section: "Projector Class",
    title: "Smart Whiteboard Classroom Sessions",
    description: "Vibrant classrooms equipped with high-resolution digital whiteboards for interactive learning.",
    src: "https://images.unsplash.com/photo-1568658176307-bfbd2873abda?auto=format&fit=crop&w=600&q=80",
    alt: "interactive flat panel whiteboard classroom screen kids",
    sortOrder: 22
  },
  {
    section: "Skill Classes",
    title: "Sand Play Sensory Station",
    description: "Fostering texture recognition, scooping math, and physical coordination at sandboxes.",
    src: "https://images.unsplash.com/photo-1610473068565-d06b67a99252?auto=format&fit=crop&w=600&q=80",
    alt: "children playing sandbox sand table sensory station",
    sortOrder: 23
  },
  {
    section: "Skill Classes",
    title: "Geometric Shape Learning Activity",
    description: "Drawing, coloring, and learning shapes like circle, triangle, and square with visual aids.",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    alt: "preschooler displaying geometry drawing on floor shapes",
    sortOrder: 24
  }
];

async function seedPrePrimaryData() {
  const count = await PrePrimaryItemModel.estimatedDocumentCount();
  if (count === 0) {
    await PrePrimaryItemModel.insertMany(defaultPrePrimaryShowcaseItems);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedPrePrimaryData();
    const items = await PrePrimaryItemModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch pre-primary showcase.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.section || !body.title || !body.src) {
      return NextResponse.json({ error: "Section, Title, and Image source are required." }, { status: 400 });
    }

    const created = await PrePrimaryItemModel.create({
      section: body.section,
      title: body.title,
      description: body.description || "",
      src: body.src,
      alt: body.alt || "",
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create pre-primary item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const updated = await PrePrimaryItemModel.findByIdAndUpdate(
      body.id,
      {
        section: body.section,
        title: body.title,
        description: body.description,
        src: body.src,
        alt: body.alt,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update pre-primary item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const deleted = await PrePrimaryItemModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete pre-primary item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
