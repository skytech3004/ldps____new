import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, MapPin, CheckCircle2 } from "lucide-react";

type RosterMember = {
  name: string;
  designation: string;
};

async function loadRoster() {
  const filePath = path.join(process.cwd(), "teacher.txt");
  const rawText = await fs.readFile(filePath, "utf8");
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const roster: RosterMember[] = [];

  for (let index = 0; index < lines.length; ) {
    const name = lines[index];
    const repeatedName = lines[index + 1];
    const designation = lines[index + 2];

    if (name && repeatedName && designation && name === repeatedName) {
      roster.push({ name, designation });
      index += 3;
      continue;
    }

    if (name && designation) {
      roster.push({ name, designation });
      index += 2;
      continue;
    }

    index += 1;
  }

  return roster;
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
            <span className="text-white/80">Managing Committee</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-montserrat uppercase tracking-tight text-accent">
            Managing Committee
          </h1>
          <p className="text-white/60 font-medium text-xs md:text-sm max-w-2xl">
            Names and designations are loaded directly from `teacher.txt` so the roster stays aligned with the source file.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white border border-primary/10 rounded-[2.5rem] p-8 shadow-lg space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 size={28} />
            </div>
            <div className="space-y-3">
              <span className="text-accent font-black uppercase tracking-[0.35em] text-[10px] block">Managing Body</span>
              <h2 className="text-2xl font-black text-primary uppercase font-montserrat">
                Marudhar Mahila Shikshan Sangh
              </h2>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                The school is managed by Marudhar Mahila Shikshan Sangh, Vidyawadi, Khimel, Rajasthan.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin size={16} className="text-accent" />
                <span>Vidyawadi, Khimel, Rani, Pali</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-accent" />
                <span>{totalStaff} staff members listed in teacher.txt</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {roster.map((member) => (
              <article key={`${member.name}-${member.designation}`} className="bg-white border border-primary/10 rounded-[2rem] p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-black text-primary uppercase font-montserrat tracking-tight">
                  {member.name}
                </h3>
                <p className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-accent-hover">
                  {member.designation}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] border border-primary/10 p-8 space-y-4">
            <span className="text-secondary font-black uppercase tracking-[0.35em] text-xs block">Roster Summary</span>
            <h2 className="text-2xl md:text-3xl font-black text-primary uppercase font-montserrat">
              Parsed from teacher.txt
            </h2>
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              The source file includes leadership, PGT, TGT, PRT, and support staff entries. We render the complete
              name-designation roster here without rewriting the source manually.
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
