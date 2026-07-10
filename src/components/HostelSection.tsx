"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Coffee, Heart, UserCheck, PhoneCall, Home, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

const hostelImages = [
    "/uploads/hostel/hostel.jpg",
    "/uploads/hostel/Cafeteria.png",
    "/uploads/hostel/Hostels.png",
    "/uploads/hostel/Hostels_1.png",
    "/uploads/hostel/Hostels_2.png",
    "/uploads/hostel/Hostels_3.png",
    "/uploads/hostel/Hostels_4.png",
];

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Uncompromising Security",
        desc: "24/7 warden supervision, CCTV surveillance, and specialized female security personnel ensure a secure and nurturing environment for your daughters."
    },
    {
        icon: <Coffee className="w-8 h-8" />,
        title: "Nutritious Mess",
        desc: "In-house hygienic kitchen providing four balanced, home-style meals daily, prepared with seasonal, fresh ingredients."
    },
    {
        icon: <Heart className="w-8 h-8" />,
        title: "Care & Support",
        desc: "An emotional support system where each student is treated with care, fostering a family-like atmosphere."
    },
    {
        icon: <UserCheck className="w-8 h-8" />,
        title: "Disciplined Routine",
        desc: "A structured daily routine balancing academics, sports, and value-based sanskars to build character."
    }
];

export default function HostelSection() {
    const [currentImage, setCurrentImage] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % hostelImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % hostelImages.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + hostelImages.length) % hostelImages.length);

    return (
        <section id="hostel" className="py-24 px-6 bg-oxford relative overflow-hidden" data-theme="dark">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-[3.5rem] md:rounded-[4rem] overflow-hidden border-4 md:border-8 border-white/5 shadow-2xl group"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={hostelImages[currentImage]}
                                        alt="Vidyawadi Hostel Life"
                                        fill
                                        className="object-contain p-1"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Carousel Controls */}
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={prevImage}
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-sandstone hover:text-oxford transition-all"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-sandstone hover:text-oxford transition-all"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Carousel Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {hostelImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${currentImage === idx ? "bg-sandstone w-6" : "bg-white/40"}`}
                                    />
                                ))}
                            </div>

                            {/* Overlay Card - Desktop Only */}
                            <div className="hidden md:block absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-sandstone rounded-full flex items-center justify-center text-oxford">
                                        <Home size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white uppercase tracking-wider">Home Away From Home</h4>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Trusted by parents across India for over 6 decades for girls&apos; residential education and safety.
                                </p>
                            </div>
                        </motion.div>

                        {/* Home Away From Home - Mobile Only */}
                        <div className="md:hidden mt-6 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 bg-sandstone rounded-full flex items-center justify-center text-oxford shrink-0">
                                    <Home size={20} />
                                </div>
                                <h4 className="text-lg font-bold text-white uppercase tracking-wide">Home Away From Home</h4>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Trusted by parents across India for over 6 decades for girls&apos; residential education and safety.
                            </p>
                        </div>

                        {/* Campus Infrastructure & Facilities List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm"
                        >
                            <h4 className="text-xl font-bold text-sandstone mb-6 uppercase tracking-wider">Campus Infrastructure & Facilities:</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {[
                                    "4 Academic Educational Units",
                                    "8 Fully Operational Hostels (700+ Capacity)",
                                    "24×7 CCTV Surveillance for Safety",
                                    "RO Water Purification Plant",
                                    "Spacious Sports Ground",
                                    "Kids Activity Park",
                                    "Modern Science & Computer Labs",
                                    "21 Buses serving 83+ villages"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-white/70 font-medium group">
                                        <div className="w-2 h-2 rounded-full bg-sandstone shrink-0 mt-2 group-hover:scale-125 transition-transform" />
                                        <span className="text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Decorative Badge */}
                        <motion.div
                            initial={{ rotate: -15, opacity: 0 }}
                            whileInView={{ rotate: 10, opacity: 1 }}
                            viewport={{ once: true }}
                            className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 bg-sandstone rounded-full flex flex-col items-center justify-center text-oxford text-center p-2 md:p-4 shadow-2xl border-2 md:border-4 border-oxford z-30"
                        >
                            <span className="text-xl md:text-3xl font-black leading-none">100%</span>
                            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Girls' Safety Record</span>
                        </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-12">
                        <div>
                            <span className="text-sandstone-light font-bold uppercase tracking-[0.4em] text-sm block mb-4">Hostel & Residential Life</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 uppercase">
                                8 <span className="text-sandstone">Residential Hostels</span>
                            </h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                <span className=" p-2 text-oxford bg-sandstone font-bold rounded">8 fully operational AC/Non-AC hostels with 700+ student capacity,</span> Vidyawadi provides a safe, disciplined, and nurturing environment for girls from across India.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sandstone/30 transition-all group"
                                >
                                    <div className="text-sandstone mb-4 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                                    <p className="text-white/50 text-xs leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <a href="/hostel" className="w-full sm:w-auto px-10 py-5 bg-sandstone text-oxford font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-xl text-center">
                                Explore Hostel Features
                            </a>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold hover:text-sandstone transition-colors group">
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-sandstone group-hover:text-oxford">
                                    <PhoneCall size={18} />
                                </div>
                                <span className="text-sm">Inquire about Security</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
