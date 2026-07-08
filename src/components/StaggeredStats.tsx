"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  num: string;
  title: string;
  desc: string;
  delay: number;
}

function StatCard({ num, title, desc, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="bg-[#3D348B] border border-[#7678ED]/30 p-8 lg:p-10 rounded-[2rem] shadow-[0_12px_40px_rgba(61,52,139,0.15)] hover:shadow-[0_20px_50px_rgba(247,184,1,0.22)] hover:border-[#F7B801]/60 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group w-full"
    >
      {/* Interactive gradient shine on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7678ED]/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Soft decorative visual accent */}
      <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#F7B801] opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />

      {/* Numerical Statistic */}
      <h3 className="text-5xl lg:text-6xl font-black text-[#F7B801] mb-4 tracking-tight drop-shadow-[0_2px_12px_rgba(247,184,1,0.18)] group-hover:scale-105 transition-transform duration-300">
        {num}
      </h3>

      {/* Card Header Title */}
      <h4 className="text-sm lg:text-base font-extrabold uppercase tracking-wider mb-4 text-white min-h-[44px] flex items-center justify-center border-b border-white/10 pb-3 w-full group-hover:border-[#F7B801]/25 transition-colors">
        {title}
      </h4>

      {/* Supporting Text Description */}
      <p className="text-xs lg:text-[13px] font-semibold text-slate-200/90 leading-relaxed max-w-[260px] mx-auto">
        {desc}
      </p>
    </motion.div>
  );
}

export default function StaggeredStats() {
  const stats = [
    {
      num: "70+",
      title: "YEARS LEGACY",
      desc: "A rich history of academic excellence and empowering girls since 1956."
    },
    {
      num: "65+",
      title: "ACRES CAMPUS",
      desc: "Lush green, expansive campus equipped with world-class facilities."
    },
    {
      num: "20000+",
      title: "ALUMNI",
      desc: "A strong global network of successful alumni leading in various fields."
    },
    {
      num: "8+",
      title: "HOSTEL",
      desc: "Safe, comfortable, and modern residential halls for students."
    },
    {
      num: "21+",
      title: "BUSES",
      desc: "Reliable peripheral transport network connecting various regions."
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-[#F8F9FC] overflow-hidden relative">
      {/* Glowing Ambient Background Circles */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#7678ED]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F7B801]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading Group */}
        <div className="text-center mb-16 lg:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase text-[#7678ED] tracking-widest bg-[#7678ED]/10 px-3 py-1.5 rounded-full"
          >
            LPS Vidyawadi at a Glance
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-extrabold text-[#3D348B] mt-4 tracking-tight"
          >
            Why Choose Our LPS Vidyawadi?
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 bg-[#F7B801] mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Desktop Layout (3 Staggered Columns matching reference 3rd image) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 lg:gap-12 items-start relative min-h-[660px]">
          {/* Column 1 (Left - Shifted Down) */}
          <div className="flex flex-col gap-8 lg:mt-24">
            <StatCard
              num={stats[0].num}
              title={stats[0].title}
              desc={stats[0].desc}
              delay={0.1}
            />
            <StatCard
              num={stats[3].num}
              title={stats[3].title}
              desc={stats[3].desc}
              delay={0.4}
            />
          </div>

          {/* Column 2 (Middle - Centered/Shifted) */}
          <div className="flex flex-col gap-8 lg:mt-12">
            <StatCard
              num={stats[1].num}
              title={stats[1].title}
              desc={stats[1].desc}
              delay={0.2}
            />
          </div>

          {/* Column 3 (Right - Shifted Down) */}
          <div className="flex flex-col gap-8 lg:mt-24">
            <StatCard
              num={stats[2].num}
              title={stats[2].title}
              desc={stats[2].desc}
              delay={0.3}
            />
            <StatCard
              num={stats[4].num}
              title={stats[4].title}
              desc={stats[4].desc}
              delay={0.5}
            />
          </div>
        </div>

        {/* Mobile & Tablet Layout (Standard Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              num={stat.num}
              title={stat.title}
              desc={stat.desc}
              delay={0.1 * (idx + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
