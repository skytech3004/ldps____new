const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const localEnv = path.join(__dirname, '..', '.env.local');
  const regularEnv = path.join(__dirname, '..', '.env');
  const envPath = fs.existsSync(localEnv) ? localEnv : (fs.existsSync(regularEnv) ? regularEnv : null);
  
  if (envPath) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (parts) {
        const key = parts[1];
        let value = parts[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined.");
  process.exit(1);
}

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "" },
    content: { type: [String], default: [] },
    items: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { _id: false }
);

const PageContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    group: { type: String, default: "General", trim: true },
    heroImage: { type: String, default: "", trim: true },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

const PageContentModel = mongoose.models.PageContent || mongoose.model("PageContent", PageContentSchema);

const pagesToSeed = [
  {
    slug: "scholastic",
    title: "Scholastic Curriculum",
    subtitle: "Nurturing young minds through a balanced, child-centered approach that blends traditional values with modern educational methodologies.",
    group: "Academics",
    heroImage: "/lps-vidhyawadi/about-banner.jpg",
    sections: [
      {
        title: "Academic Wings",
        badge: "Comprehensive Stages",
        subtitle: "Tailored educational journeys from early childhood to board exam success",
        content: [
          "Primary Wing (Classes I - V): Building strong fundamentals in literacy, numeracy, and environmental awareness through activity-based learning.",
          "Middle Wing (Classes VI - VIII): Fostering analytical thinking and scientific inquiry as students transition to specialized subject areas.",
          "Secondary Wing (Classes IX - X): Rigorous preparation for CBSE board examinations with focus on conceptual clarity and discipline.",
          "Senior Secondary Wing (Classes XI - XII): Specialized streams in Science, Commerce, and Humanities to prepare students for higher education."
        ]
      },
      {
        title: "Curriculum Features & Methodology",
        badge: "Core Strengths",
        subtitle: "Key pillars of our academic excellence model",
        content: [
          "Concept-Based Learning shifting away from rote memorization",
          "Digital & ICT Lab integration with smart interactive boards",
          "Personalized Mentorship and regular remedial assistance",
          "Continuous Comprehensive Evaluation adhering strictly to CBSE standards"
        ]
      }
    ]
  },
  {
    slug: "co-scholastic",
    title: "Co-Scholastic & Clubs",
    subtitle: "Unleashing creativity, rhythm, leadership, and athletic potential outside textbook learning.",
    group: "Academics",
    heroImage: "/lps-vidhyawadi/gallery-02.jpg",
    sections: [
      {
        title: "Creative & Performing Arts",
        badge: "Vibrant Expression",
        subtitle: "Nurturing aesthetic appreciation and performance skills",
        content: [
          "Creative Art & Craft: Face painting, fabric painting, acrylic/glass designs, origami, and soft toy crafting.",
          "Acoustics Music Wing: Classical Indian vocals, keyboard, guitar, tabla, and violin instruction in soundproof rooms.",
          "Performing Dance & Aerobics: Classical dance, folk routines, and synchronized aerobics for bodily rhythm and fitness."
        ]
      },
      {
        title: "Student House System",
        badge: "Leadership & Honor",
        subtitle: "Fostering healthy competition and camaraderie across four houses",
        content: [
          "Rani Lakshmi Bai House - Motto: Valor & Strength",
          "Padmavati House - Motto: Wisdom & Honor",
          "Sarojini Naidu House - Motto: Grace & Expression",
          "Vijaya Lakshmi House - Motto: Peace & Harmony"
        ]
      },
      {
        title: "Clubs & Extracurricular Activities",
        badge: "Student Societies",
        subtitle: "Active clubs driving holistic development",
        content: [
          "Eco Club & Nature Trails",
          "Literary & Oratory Society",
          "IT & Robotics Club",
          "SUPW & Skill Building Workshops"
        ]
      }
    ]
  },
  {
    slug: "eligibility-criteria",
    title: "Admission Guidelines",
    subtitle: "Complete details on guidelines, requirements, procedures, and required documents.",
    group: "Academics",
    heroImage: "/lps-vidhyawadi/gallery-01.jpg",
    sections: [
      {
        title: "General Admission Norms",
        badge: "Guidelines",
        subtitle: "Inclusivity and merit-based admission policy",
        content: [
          "Subject to seat availability, the school admits girls from Nursery to Class XI regardless of caste, creed, or religion.",
          "Age criteria are strictly adhered to in compliance with CBSE and state education board regulations.",
          "Official prospectuses and application forms can be obtained from the school reception desk or requested online."
        ]
      },
      {
        title: "Required Documents Checklist",
        badge: "Documentation",
        subtitle: "Certificates required at the time of admission verification",
        content: [
          "Date of Birth Certificate issued by Municipal Corporation or Panchayat",
          "Original Transfer Certificate (T.C.) with counter-signature if moving from another board",
          "Attested copy of previous academic year's report card",
          "Medical Fitness Certificate from a registered practitioner",
          "8 passport-size photographs of candidate & 1 each of Father, Mother, Guardian",
          "Aadhar card copies of candidate and parents",
          "Category Certificate (SC/ST/OBC/EWS) if applicable"
        ]
      },
      {
        title: "Right to Education (RTE) Mandate",
        badge: "RTE Scheme",
        subtitle: "Free admission provisions as per government regulations",
        content: [
          "Reserved seats are provided under the Right to Education (RTE) Act for BPL and disadvantaged category students."
        ]
      }
    ]
  },
  {
    slug: "fee-structure",
    title: "Fee Structure",
    subtitle: "Transparent fee details and fee schedule for the current academic session.",
    group: "Academics",
    heroImage: "/lps-vidhyawadi/about-banner.jpg",
    sections: [
      {
        title: "Annual Tuition & Session Fees",
        badge: "Financial Terms",
        subtitle: "Grade-wise fee details for day scholars and boarders",
        content: [
          "Pre-Primary (Nursery, LKG, HKG): ₹24,000 / annum",
          "Primary (Class I - V): ₹28,000 / annum",
          "Middle Wing (Class VI - VIII): ₹32,000 / annum",
          "Secondary Wing (Class IX - X): ₹38,000 / annum",
          "Senior Secondary (Class XI - XII Science / Commerce / Humanities): ₹45,000 / annum",
          "Hostel Charges (Boarders - Non AC / AC): ₹95,000 / ₹1,15,000 per annum (includes accommodation, mess & care)"
        ]
      },
      {
        title: "Payment Guidelines & Installments",
        badge: "Payment Policy",
        subtitle: "Modes of payment and due dates",
        content: [
          "Fees can be paid in two equal installments (First Installment at admission / April, Second in October).",
          "Modes of payment include Demand Draft, Net Banking, UPI, and Credit/Debit Cards at school counter.",
          "Late fee charges apply after the official due date window."
        ]
      }
    ]
  },
  {
    slug: "fee-policy",
    title: "Fee Policy & Payment Terms",
    subtitle: "Clear regulations regarding fee payments, deadlines, concessions, and refunds.",
    group: "Academics",
    heroImage: "/lps-vidhyawadi/gallery-03.jpg",
    sections: [
      {
        title: "Fee Payment Regulations",
        badge: "Terms & Rules",
        subtitle: "Key guidelines for parents and guardians",
        content: [
          "All fees must be remitted on or before the due date specified in the fee circular.",
          "Defaulters after the grace period may incur late fines as per management policy.",
          "Transfer Certificates will only be issued upon complete clearance of outstanding dues.",
          "Caution money deposits are refundable upon leaving the school after presenting original receipts."
        ]
      }
    ]
  },
  {
    slug: "day-schooling",
    title: "Day Schooling Experience",
    subtitle: "Empowering local student scholars with state-of-the-art academic & co-curricular infrastructure.",
    group: "Schooling",
    heroImage: "/lps-vidhyawadi/gallery-09.jpg",
    sections: [
      {
        title: "Day Schooling Overview",
        badge: "Academic Hours",
        subtitle: "Structured daily routine for local non-residential students",
        content: [
          "Comprehensive daytime curriculum featuring morning assembly, interactive lectures, and lab sessions.",
          "Dedicated transportation fleet covering peripheral areas up to 50 km around Khimel and Rani.",
          "Nutritious mid-day snacks and supervised study time integrated into school hours."
        ]
      }
    ]
  },
  {
    slug: "hostel-care",
    title: "Hostel Care & Student Support",
    subtitle: "A secure, warm, and nurturing residential campus environment for young women.",
    group: "Schooling",
    heroImage: "/lps-vidhyawadi/gallery-04.jpg",
    sections: [
      {
        title: "Residential Facilities & Security",
        badge: "24x7 Campus Care",
        subtitle: "Complete peace of mind for parents",
        content: [
          "Gated 65-acre campus with 24x7 security personnel and complete CCTV coverage.",
          "House mothers and wardens residing inside living blocks for personal care and guidance.",
          "On-call medical doctor and infirmary with emergency vehicle transport.",
          "Supervised daily study hours with resident subject teacher assistance."
        ]
      }
    ]
  },
  {
    slug: "meals",
    title: "Dining & Meal Plans",
    subtitle: "Hygienic, wholesome, and nutritious vegetarian meal plans served in our central mess.",
    group: "Schooling",
    heroImage: "/lps-vidhyawadi/gallery-05.jpg",
    sections: [
      {
        title: "Nutritious Food Standards",
        badge: "Dining Hall",
        subtitle: "Balanced diet designed by nutritionist and house dietitians",
        content: [
          "4 meal services daily: Morning Milk & Breakfast, Hot Lunch, Evening Refreshments & Tea, Dinner.",
          "100% Pure Vegetarian & Hygienic Jain-compliant preparation options available.",
          "Modern mechanized kitchen with steam cooking and daily quality audits."
        ]
      }
    ]
  },
  {
    slug: "a-day-at-school",
    title: "A Day at School",
    subtitle: "A disciplined, balanced daily routine fostering intellectual growth, physical fitness, and moral values.",
    group: "Schooling",
    heroImage: "/lps-vidhyawadi/gallery-01.jpg",
    sections: [
      {
        title: "Daily Schedule Breakdown",
        badge: "Routine",
        subtitle: "A structured flow of activities from dawn to dusk",
        content: [
          "06:00 AM - Morning Wakeup & Fitness / Yoga",
          "07:30 AM - Healthy Breakfast & Assembly",
          "08:30 AM - Academic Period Sessions 1 to 4",
          "11:30 AM - Recess & Refreshments",
          "12:00 PM - Academic Period Sessions 5 to 8",
          "02:00 PM - Lunch & Rest",
          "04:00 PM - Sports, Co-curricular Clubs & Hobby Time",
          "06:30 PM - Guided Study Hours & Evening Prep",
          "08:00 PM - Dinner & House Assembly",
          "09:30 PM - Lights Out"
        ]
      }
    ]
  },
  {
    slug: "items-required-by-boarders",
    title: "Items Required By Boarders",
    subtitle: "Complete checklist of clothes, toiletries, and personal belongings for hostel residents.",
    group: "Schooling",
    heroImage: "/lps-vidhyawadi/gallery-06.jpg",
    sections: [
      {
        title: "Essential Clothing & Uniform Checklist",
        badge: "Belongings",
        subtitle: "All items must be clearly marked with the student's name and roll number",
        content: [
          "Regular School Uniform (2 sets) & House T-Shirts",
          "Civil/Casual dresses for weekend wear (3 sets)",
          "Night suits / pajamas (3 sets) & Undergarments (6 sets)",
          "Black school shoes, white sports shoes & slippers",
          "Bedding: Mattress cover, 2 bedsheets, 2 pillow covers, 1 blanket/quilt"
        ]
      },
      {
        title: "Toiletries & Stationery Items",
        badge: "Personal Items",
        subtitle: "Daily personal care products",
        content: [
          "Bath towel & hand towels",
          "Toothbrush, toothpaste, soap case, shampoo, comb & hair oil",
          "School bag, geometry box, stationery & notebook set"
        ]
      }
    ]
  },
  {
    slug: "g-r-mechanism",
    title: "Grievance Redressal Mechanism",
    subtitle: "A transparent and accessible framework for addressing student and parent feedback.",
    group: "More",
    heroImage: "/lps-vidhyawadi/about-banner.jpg",
    sections: [
      {
        title: "Redressal Process & Committee",
        badge: "Transparency",
        subtitle: "Timely resolution of concerns",
        content: [
          "Grievance Redressal Committee chaired by the Principal and senior faculty.",
          "Submissions accepted via online portal, written feedback box at reception, or email to lpsvidhyawadi@gmail.com.",
          "All submitted complaints are acknowledged within 24 hours and addressed within 3 to 5 working days."
        ]
      }
    ]
  },
  {
    slug: "about-lps",
    title: "About LPS Vidyawadi",
    subtitle: "Leeladevi Parasmal Sancheti English Medium Sr. Sec. School - Empowering girls through holistic education.",
    group: "About",
    heroImage: "/lps-vidhyawadi/about-banner.jpg",
    sections: [
      {
        title: "Our Institution & Heritage",
        badge: "Legacy",
        subtitle: "A premier educational destination in Western Rajasthan",
        content: [
          "Established under Marudhar Mahila Shikshan Sangh, LPS Vidyawadi spans 65 lush green acres in Khimel.",
          "Affiliated with CBSE, New Delhi, offering education from Nursery to Class XII in Science, Commerce, and Arts.",
          "Modern infrastructure combining academic rigor with traditional values and comprehensive residential facilities."
        ]
      }
    ]
  },
  {
    slug: "about-trust",
    title: "About Marudhar Mahila Shikshan Sangh",
    subtitle: "Dedicated to the noble cause of female literacy, empowerment, and character building since 1956.",
    group: "About",
    heroImage: "/lps-vidhyawadi/gallery-08.jpg",
    sections: [
      {
        title: "Trust History & Vision",
        badge: "Founding Trust",
        subtitle: "Pioneers of women empowerment in Rajasthan",
        content: [
          "Marudhar Mahila Shikshan Sangh was founded by visionary philanthropists dedicated to uplifting female education in rural Rajasthan.",
          "Over six decades of leadership in operating schools, colleges, and hostels serving thousands of young women."
        ]
      }
    ]
  }
];

const PageSectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sections: { type: [PageSectionSchema], default: [] },
  },
  { timestamps: true }
);

const PageModel = mongoose.models.CmsPage || mongoose.model("CmsPage", PageSchema);

async function seed() {
  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    for (const page of pagesToSeed) {
      console.log(`Seeding page: ${page.slug} (${page.title})...`);
      await PageContentModel.findOneAndUpdate(
        { slug: page.slug },
        page,
        { upsert: true, new: true, runValidators: true }
      );

      const cmsSections = [
        {
          id: `hero-${page.slug}`,
          type: "hero",
          isVisible: true,
          order: 0,
          content: {
            title: page.title,
            subtitle: page.subtitle,
            badge: page.group || "LPS Vidyawadi",
            bgImage: page.heroImage || "/lps-vidhyawadi/about-banner.jpg",
            ctaText: "Explore Admissions",
            ctaLink: "/apply-for-admission",
          },
        },
        {
          id: `text-${page.slug}`,
          type: "text-content",
          isVisible: true,
          order: 1,
          content: {
            heading: page.title,
            subheading: page.subtitle,
            body: page.sections
              .map(
                (s) =>
                  `<h3>${s.title}</h3>` +
                  (s.subtitle ? `<p><em>${s.subtitle}</em></p>` : "") +
                  (Array.isArray(s.content) ? s.content.map((c) => `<p>• ${c}</p>`).join("") : "")
              )
              .join("<br/>"),
          },
        },
      ];

      await PageModel.findOneAndUpdate(
        { slug: page.slug },
        { slug: page.slug, title: page.title, sections: cmsSections },
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("SUCCESS: All pages successfully seeded into MongoDB (PageContent & CmsPage collections)!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding pages:", error);
    process.exit(1);
  }
}

seed();

