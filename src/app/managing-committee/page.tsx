import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Users } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { TeacherModel } from "@/models/Teacher";

type RosterMember = {
  _id?: string;
  name: string;
  designation: string;
  image?: string;
};

async function loadRoster(): Promise<RosterMember[]> {
  try {
    await connectToDatabase();
    const items = await TeacherModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    if (items && items.length > 0) {
      return items.map((item) => ({
        _id: String(item._id),
        name: item.name,
        designation: item.designation,
        image: item.image || "",
      }));
    }
  } catch (err) {
    console.error("Failed to load teachers from MongoDB:", err);
  }

  return [];
}

function countSupportStaff(roster: RosterMember[]) {
  return roster.filter((member) => /office|librarian|front desk|peon|sweeper|supdt|lab asst/i.test(member.designation)).length;
}

export default async function ManagingCommittee() {
  const roster = await loadRoster();
  const totalStaff = roster.length;
  const supportStaff = countSupportStaff(roster);
  const teachingStaff = totalStaff - supportStaff;

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 px-6 bg-gradient-to-br from-primary to-[#2c246b] text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline hover:text-white transition-all">Home</Link>
            <span>/</span>
            <span>About</span>
            <span>/</span>
            <span className="text-white/80">Our Team</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Meet Our Academic Excellence Team
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-2xl">
            Meet our dedicated team of educators, administrators, and staff committed to nurturing knowledge and excellence.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto space-y-16">
        {roster.length === 0 ? (
          <div className="py-20 text-center bg-white border border-primary/10 rounded-[2.5rem] p-8 shadow-sm space-y-3">
            <Users className="mx-auto text-primary/40" size={48} />
            <h3 className="text-xl font-bold text-primary uppercase font-montserrat">No Staff Members Found</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Staff roster is currently empty. Please log into the Admin Panel to add staff members and upload profile photos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {roster.map((member, idx) => (
              <article 
                key={member._id || `${member.name}-${idx}`} 
                className="bg-white border border-primary/10 rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* 1. Image FIRST (at the top) */}
                <div className="w-full h-56 relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border border-primary/10 flex items-center justify-center mb-5">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-primary/30 p-4 space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary/40 group-hover:scale-110 transition-transform">
                        <User size={36} strokeWidth={1.75} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">LPS Staff Member</span>
                    </div>
                  )}
                </div>

                {/* 2. Name & 3. Designation */}
                <div className="space-y-1.5 w-full text-center">
                  <h3 className="text-lg font-black text-primary uppercase font-montserrat tracking-tight group-hover:text-accent-hover transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                    {member.designation}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] border border-primary/10 p-8 space-y-4">
            <span className="text-secondary font-black uppercase tracking-[0.35em] text-xs block">Roster Summary</span>
            <h2 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat">
              Academic Roster Overview
            </h2>
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              Our academic excellence roster includes school leadership, PGT, TGT, PRT, and administrative support staff committed to academic distinction.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Staff", value: totalStaff.toString() },
              { label: "Teaching", value: teachingStaff.toString() },
              { label: "Support", value: supportStaff.toString() },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-primary/5 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm md:text-base font-bold text-primary">{item.label}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current count</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
