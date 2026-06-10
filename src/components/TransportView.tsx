"use client";

import React, { useEffect, useState } from "react";
import { Bus, ShieldCheck, MapPin, Phone, Info, Clock, Search, HelpCircle } from "lucide-react";

interface BusRoute {
  _id?: string;
  routeNo: string;
  driver: string;
  phone: string;
  stops: string[];
  timing: string;
}

const STATIC_ROUTES: BusRoute[] = [
  {
    routeNo: "Route 01",
    driver: "Rajesh Singh",
    phone: "+91 94141 48001",
    stops: ["Vidyawadi Campus", "Sojat Road", "Sojat City", "Bilara"],
    timing: "07:15 AM - 02:30 PM",
  },
  {
    routeNo: "Route 02",
    driver: "Amit Sharma",
    phone: "+91 94141 48002",
    stops: ["Vidyawadi Campus", "Jaitaran", "Nimaj", "Raipur"],
    timing: "07:20 AM - 02:40 PM",
  },
  {
    routeNo: "Route 03",
    driver: "Ramesh Lal",
    phone: "+91 94141 48003",
    stops: ["Vidyawadi Campus", "Marwar Junction", "Ranawas", "Nadol"],
    timing: "07:00 AM - 03:00 PM",
  },
  {
    routeNo: "Route 04",
    driver: "Mahendra Kumar",
    phone: "+91 94141 48004",
    stops: ["Vidyawadi Campus", "Pali City", "Gundoj", "Sumerpur"],
    timing: "06:45 AM - 03:15 PM",
  },
];

const SAFETY_FEATURES = [
  {
    title: "GPS Tracking",
    desc: "Real-time location tracking for parents via our dedicated mobile application.",
    icon: MapPin,
  },
  {
    title: "CCTV Surveillance",
    desc: "Active CCTV cameras inside all buses to monitor student safety and conduct.",
    icon: ShieldCheck,
  },
  {
    title: "Female Attendants",
    desc: "Every bus is staffed with a female attendant to support junior students.",
    icon: HelpCircle,
  },
  {
    title: "Emergency First Aid",
    desc: "Buses are equipped with comprehensive medical first-aid boxes and fire extinguishers.",
    icon: Info,
  },
];

export default function TransportView() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await fetch("/api/admin/transport", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setRoutes(data);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch dynamic transport routes:", error);
      }
      // Fallback
      setRoutes(STATIC_ROUTES);
    }
    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter((route) => {
    const query = searchQuery.toLowerCase();
    return (
      route.routeNo.toLowerCase().includes(query) ||
      route.driver.toLowerCase().includes(query) ||
      route.stops.some((stop) => stop.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-12">
      {/* Intro & Safety Standards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-center space-y-4">
          <span className="text-[#F18701] font-black uppercase tracking-[0.25em] text-xs block">
            Safe Commute
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#3D348B] uppercase tracking-tight">
            Our Fleet & Commitment
          </h2>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Leeladevi Parasmal Sancheti Senior Secondary School maintains a fleet of modern, air-conditioned buses. Our transport network connects several surrounding cities and towns, ensuring students have access to a comfortable, secure, and punctual transit service.
          </p>
          <div className="flex gap-4 items-center pt-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#3D348B] shrink-0 border border-slate-100">
              <Bus size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[#3D348B] uppercase">Transport Office</p>
              <p className="text-xs text-slate-500 font-bold mt-0.5">+91 94141 48005 (Ext. 4)</p>
            </div>
          </div>
        </div>

        {/* Safety Features Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAFETY_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7678ED]/5 flex items-center justify-center text-[#7678ED]">
                  <Icon size={20} />
                </div>
                <h4 className="text-sm font-black text-primary uppercase tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routes Grid with Search */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[#3D348B] uppercase tracking-tight">
              Bus Route Schedule
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Select or search routes to check stops and pick-up times
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stop, driver, route..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-[#3D348B] focus:border-[#7678ED] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredRoutes.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium col-span-2 text-center py-6">
              No matching routes found. Please check spelling or search term.
            </p>
          ) : null}
          {filteredRoutes.map((route, idx) => (
            <div
              key={idx}
              className="border border-slate-100 hover:border-[#7678ED]/30 rounded-2xl p-6 bg-slate-50/50 hover:bg-white transition-all shadow-[0_4px_20px_rgba(118,120,237,0.02)] space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3D348B]/5 text-[#3D348B] text-xs font-extrabold rounded-lg">
                  <Bus size={12} />
                  {route.routeNo}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                  <Clock size={12} />
                  {route.timing}
                </span>
              </div>

              {/* Stops list */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Route Path & Key Stops
                </p>
                <div className="flex flex-wrap gap-2">
                  {route.stops.map((stop, stopIdx) => (
                    <span
                      key={stopIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200/60 text-[11px] text-slate-600 font-bold rounded-lg"
                    >
                      <MapPin size={10} className="text-[#7678ED]" />
                      {stop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Driver Contact */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Driver Name</p>
                  <p className="font-extrabold text-[#3D348B] mt-0.5">{route.driver}</p>
                </div>
                <a
                  href={`tel:${route.phone}`}
                  className="inline-flex items-center gap-1.5 text-accent hover:text-[#F18701] font-black uppercase tracking-wider"
                >
                  <Phone size={12} />
                  Call Driver
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
