"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Airplay,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Train,
  Bus,
  Building2,
  User,
} from "lucide-react";
import { contactLocation, howToReach } from "@/data/contactPage";

type ImportantContact = {
  _id: string;
  department: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
};

const schoolMapUrl =
  "https://www.google.com/maps/place/Marudhar+Mahila+Shikshan+Sangh,+Vidyawadi/@25.3203814,73.2889669,982m/data=!3m2!1e3!4b1!4m6!3m5!1s0x394285c38de7bf27:0x6413b20ba55fe11d!8m2!3d25.3203814!4d73.2915418!16s%2Fg%2F11cl_4pk1_?entry=ttu";
const schoolDirectionsUrl = "https://maps.app.goo.gl/CVPUXGyTHZCyCry58";

export default function ContactPage() {
  const [contacts, setContacts] = useState<ImportantContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch("/api/admin/important-contacts", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error("Failed to load important contacts:", error);
      } finally {
        setLoadingContacts(false);
      }
    }

    fetchContacts();
  }, []);

  return (
    <main className="min-h-screen pt-32 lg:pt-40 bg-[#F8F9FC]">
      <Navbar />

      <section className="px-6 mb-12 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="text-green-primary font-black uppercase tracking-[0.4em] text-sm mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-4xl lg:text-7xl font-black text-navy leading-none mb-4">
            CONTACT <span className="text-green-primary">US</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Schedule a campus visit or inquire about admissions
          </p>
          <div className="h-2 w-32 bg-mint mx-auto rounded-full mt-6" />
        </div>
      </section>

      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] border border-primary/10 p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-mint/30 flex items-center justify-center text-navy">
                <MapPin size={22} />
              </div>
              <h2 className="text-2xl font-black text-navy uppercase">Our Location</h2>
            </div>

            <div className="space-y-3">
              <p className="text-lg font-black text-primary">{contactLocation.title}</p>
              {contactLocation.addressLines.map((line) => (
                <p key={line} className="text-gray-600 font-medium">
                  {line}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${contactLocation.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-mint/20 hover:bg-mint/30 transition-colors"
              >
                <Phone size={18} className="text-navy shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Phone</p>
                  <p className="font-bold text-navy text-sm">{contactLocation.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${contactLocation.email}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-green-primary/10 hover:bg-green-primary/20 transition-colors"
              >
                <Mail size={18} className="text-green-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Email</p>
                  <p className="font-bold text-navy text-sm break-all">{contactLocation.email}</p>
                </div>
              </a>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">{contactLocation.note}</p>

            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <iframe
                title="Vidyawadi campus map"
                src="https://www.google.com/maps?q=25.3203814,73.2915418&z=15&output=embed"
                className="h-[280px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-4 bg-navy flex flex-wrap gap-3">
                <a
                  href={schoolDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-mint px-4 py-2 text-xs font-black uppercase tracking-wider text-navy"
                >
                  Directions
                </a>
                <a
                  href={schoolMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-black uppercase tracking-wider text-white"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-primary/10 p-8 shadow-xl">
              <h2 className="text-2xl font-black text-navy uppercase mb-6">How to Reach</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Train size={18} className="text-primary" />
                    <h3 className="font-black text-primary uppercase text-sm tracking-wider">Rail Link</h3>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Alight at Rani / Falna:</p>
                  <ul className="space-y-2">
                    {howToReach.rail.map((item) => (
                      <li key={item} className="text-sm text-gray-600 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bus size={18} className="text-primary" />
                    <h3 className="font-black text-primary uppercase text-sm tracking-wider">Road Link</h3>
                  </div>
                  <ul className="space-y-2">
                    {howToReach.road.map((item) => (
                      <li key={item} className="text-sm text-gray-600 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Airplay size={18} className="text-primary" />
                    <h3 className="font-black text-primary uppercase text-sm tracking-wider">Air Link</h3>
                  </div>
                  <ul className="space-y-2">
                    {howToReach.air.map((item) => (
                      <li key={item} className="text-sm text-gray-600 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-navy p-8 rounded-[2rem] shadow-xl">
              <h2 className="text-2xl font-black text-white mb-2">Send us an Inquiry</h2>
              <p className="text-white/60 text-sm mb-6">Our team will get back to you within 24 hours.</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-mint"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-mint"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-mint"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-mint">
                    <option className="bg-navy">Select Board</option>
                    <option className="bg-navy">RBSE</option>
                    <option className="bg-navy">CBSE</option>
                  </select>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-mint">
                    <option className="bg-navy">Interested Grade</option>
                    <option className="bg-navy">Nursery</option>
                    <option className="bg-navy">Class 1-5</option>
                    <option className="bg-navy">Class 6-8</option>
                    <option className="bg-navy">Class 9-10</option>
                    <option className="bg-navy">Class 11-12</option>
                  </select>
                </div>
                <textarea
                  rows={4}
                  placeholder="Message / Inquiry"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-mint resize-none"
                />
                <button
                  type="button"
                  className="w-full bg-mint text-navy py-4 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Submit Inquiry
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-32 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-green-primary font-black uppercase tracking-[0.3em] text-xs">
            <Building2 size={14} />
            <span>Important Contacts</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-navy uppercase">
            Direct Lines to Our Departments
          </h2>
          <p className="text-gray-500 font-medium">
            Direct lines to our departments and administration
          </p>
        </div>

        {loadingContacts ? (
          <p className="text-center text-gray-400 font-semibold">Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <p className="text-center text-gray-400 font-semibold">No contacts available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <article
                key={contact._id}
                className="bg-white border border-primary/10 rounded-[2rem] p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <User size={22} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-navy">{contact.department}</h3>
                      {contact.contactName ? (
                        <p className="text-sm font-bold text-primary mt-1">{contact.contactName}</p>
                      ) : null}
                      {contact.designation ? (
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                          {contact.designation}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      {contact.phone ? (
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors"
                        >
                          <Phone size={14} className="text-accent shrink-0" />
                          {contact.phone}
                        </a>
                      ) : null}
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors break-all"
                        >
                          <Mail size={14} className="text-accent shrink-0" />
                          {contact.email}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Office Hours", detail: "Office enquiry: 11:00 AM to 3:00 PM", icon: Clock },
            { title: "Campus", detail: "Vidyawadi, Khimel, Station - Rani, Pali", icon: MapPin },
            { title: "LPS Phone", detail: "02934-220935 / 220936", icon: Phone },
            { title: "LPS Email", detail: "lpsvidhyawadi@gmail.com", icon: Mail },
          ].map((item) => (
            <div key={item.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-mint/20 rounded-xl flex items-center justify-center mb-4 text-navy">
                <item.icon size={18} />
              </div>
              <h4 className="font-black text-navy uppercase text-[10px] tracking-widest mb-1">{item.title}</h4>
              <p className="text-gray-600 font-bold text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
