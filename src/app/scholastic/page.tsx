"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Library, 
  Users, 
  CheckCircle, 
  Award, 
  ArrowRight,
  Microscope,
  Languages,
  Calculator
} from "lucide-react";
import { curriculumPage, getSection } from "@/data/lpsVidhyawadiDatabase";

export default function ScholasticPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await fetch("/api/admin/facilities");
        if (res.ok) {
          const data = await res.json();
          setFacilities(data);
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFacilities();
  }, []);

  const primaryCurriculum = getSection(curriculumPage, "The Curriculum");
  const secondaryWings = getSection(curriculumPage, "Secondary and Senior Secondary Wings");

  const academicWings = [
    {
      title: "Primary Wing",
      subtitle: "Classes I - V",
      icon: BookOpen,
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
      description: "Building strong fundamentals in literacy, numeracy, and environmental awareness through activity-based learning.",
      features: ["Integrated Curriculum", "Phonetics & Reading", "Environmental Studies", "Creative Arts"]
    },
    {
      title: "Middle Wing",
      subtitle: "Classes VI - VIII",
      icon: Microscope,
      color: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600",
      description: "Fostering analytical thinking and scientific inquiry as students transition to more specialized subject areas.",
      features: ["Advanced Sciences", "Three Language Formula", "ICT Integration", "Life Skills Training"]
    },
    {
      title: "Secondary Wing",
      subtitle: "Classes IX - X",
      icon: GraduationCap,
      iconColor: "text-accent",
      color: "from-accent/10 to-accent/5",
      description: "Rigorous preparation for board examinations with focus on conceptual clarity and academic discipline.",
      features: ["CBSE Board Focus", "Career Counseling", "Practical Lab Work", "Personalized Mentorship"]
    },
    {
      title: "Senior Secondary",
      subtitle: "Classes XI - XII",
      icon: Award,
      iconColor: "text-primary",
      color: "from-primary/10 to-primary/5",
      description: "Specialized streams in Science, Commerce, and Humanities to prepare students for higher education and global careers.",
      features: ["Stream Specialization", "Competitive Exam Prep", "Research Projects", "Leadership Development"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3D348B_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <Library size={14} className="text-accent" />
                <span>Academic Excellence</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-primary leading-[0.95] uppercase font-montserrat tracking-tight">
                Scholastic <br />
                <span className="text-accent">Curriculum.</span>
              </h1>
              
              <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                Nurturing young minds through a balanced, child-centered approach that blends traditional values with modern educational methodologies.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/apply-for-admission" 
                  className="bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-secondary hover:shadow-2xl hover:shadow-secondary/20 transition-all flex items-center gap-3 group text-sm uppercase tracking-widest"
                >
                  <span>Admission Query</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/school-planner" 
                  className="bg-white border-2 border-primary/10 text-primary font-black px-8 py-4 rounded-2xl hover:bg-primary/5 transition-all text-sm uppercase tracking-widest"
                >
                  School Planner
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl">
                <Image 
                  src="/lps-vidhyawadi/gallery-04.jpg" 
                  alt="Students in classroom" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Academic Philosophy */}
      <section className="py-24 px-6 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Our Foundation</span>
            <h2 className="text-3xl md:text-5xl font-black font-montserrat uppercase leading-tight">
              Learning by <br />
              <span className="text-accent">Doing.</span>
            </h2>
            <div className="h-1.5 w-24 bg-accent rounded-full" />
          </div>
          
          <div className="lg:col-span-7">
            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed">
              {primaryCurriculum[0] || "We follow a child-centered methodology where 'Learning by Doing' is at the core. Our approach identifies the unique potential of each girl child, providing them with the tools for self-education and a strong fundamental knowledge base."}
            </p>
          </div>
        </div>
      </section>

      {/* Academic Wings Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Wings of Excellence</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary uppercase font-montserrat tracking-tight">
            Academic Structure
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {academicWings.map((wing, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className={`bg-white border border-primary/5 rounded-[2.5rem] p-10 shadow-xl shadow-primary/5 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${wing.color} rounded-bl-[5rem] -z-0`} />
              
              <div className="relative z-10 space-y-6">
                <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center ${wing.iconColor}`}>
                  <wing.icon size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tight">{wing.title}</h3>
                  <p className="text-accent font-black text-xs uppercase tracking-widest">{wing.subtitle}</p>
                </div>
                
                <p className="text-gray-500 font-medium leading-relaxed">
                  {wing.description}
                </p>
                
                <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-100">
                  {wing.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-accent" />
                      <span className="text-sm font-bold text-primary/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Curriculum Details Section */}
      <section className="py-24 px-6 bg-white border-y border-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-primary uppercase font-montserrat tracking-tight">The Curriculum</h3>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                Our curriculum is meticulously designed to ensure holistic development, balancing academics with practical skills and values.
              </p>
            </div>
            
            <div className="space-y-6">
              {primaryCurriculum.slice(1, 6).map((item, idx) => (
                <div key={idx} className="flex gap-6 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 font-black group-hover:bg-accent transition-colors">
                    {idx + 1}
                  </div>
                  <p className="text-primary font-bold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10 space-y-10">
              <h3 className="text-3xl font-black uppercase font-montserrat tracking-tight text-accent">Beyond Board Exams</h3>
              
              <div className="space-y-8">
                {secondaryWings.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-b border-white/10 pb-6 last:border-0">
                    <div className="mt-1.5">
                      <CheckCircle size={20} className="text-accent" />
                    </div>
                    <p className="font-medium text-lg text-white/90 leading-relaxed italic">
                      &quot;{item}&quot;
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform"
                >
                  Download Detailed Prospectus <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary & Senior Secondary Focus */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50 border border-primary/5 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Secondary Education</span>
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase font-montserrat leading-tight">
                  Focus on <br />
                  <span className="text-accent">Global Careers.</span>
                </h2>
              </div>
              
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                {secondaryWings[5] || "In the secondary and senior secondary wings, students are prepared not just for exams, but for life beyond school. We emphasize conceptual understanding, career alignment, and the development of leadership qualities."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Languages, label: "Language Excellence" },
                  { icon: Calculator, label: "Applied Mathematics" },
                  { icon: Microscope, label: "Scientific Research" },
                  { icon: GraduationCap, label: "Career Guidance" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <item.icon size={20} className="text-accent" />
                    <span className="font-black text-xs text-primary uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2">
              <Image 
                src="/lps-vidhyawadi/gallery-06.jpg" 
                alt="Senior students" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Facilities 3x5 Grid Carousel */}
      <section className="py-24 px-6 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-accent font-black uppercase tracking-[0.4em] text-xs">Innovation & Infrastructure</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary uppercase font-montserrat tracking-tight">
              Our Advanced Facilities
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Equipping our students with state-of-the-art tools and environments to excel in the 21st century.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-primary">
                <div className="w-8 h-8 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="font-bold text-xs uppercase tracking-wider animate-pulse">Loading Advanced Facilities...</p>
              </div>
            ) : facilities.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 font-medium">
                No facilities available.
              </div>
            ) : (
              facilities.map((item, idx) => (
                <motion.div 
                  key={item._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/5]"
                >
                  <Image 
                    src={item.fallback} 
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {item.code && (
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.code}
                      </p>
                    )}
                    <h4 className="text-white font-black text-sm md:text-base uppercase leading-tight">
                      {item.name}
                    </h4>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center pt-8">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              Discover more at LPS Vidyawadi
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-montserrat tracking-tight">
            Ready to shape <br />
            <span className="text-accent text-4xl md:text-6xl">her future?</span>
          </h2>
          <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto">
            Admissions for the upcoming academic session are now open. Experience the unique residential learning environment at LPS Vidyawadi.
          </p>
          <div className="pt-4">
            <Link 
              href="/apply-for-admission" 
              className="inline-flex items-center gap-3 bg-accent text-primary font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-accent/10"
            >
              Start Admission Process
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
