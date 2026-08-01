import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

const schoolMapUrl =
  "https://www.google.com/maps/place/Marudhar+Mahila+Shikshan+Sangh,+Vidyawadi/@25.3203814,73.2889669,982m/data=!3m2!1e3!4b1!4m6!3m5!1s0x394285c38de7bf27:0x6413b20ba55fe11d!8m2!3d25.3203814!4d73.2915418!16s%2Fg%2F11cl_4pk1_?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D";
const schoolDirectionsUrl = "https://maps.app.goo.gl/CVPUXGyTHZCyCry58";
const schoolYoutubeUrl = "https://www.youtube.com/@MMSSVIDYAWADIOFFICIAL";

function YouTubeMark({ className = "", size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.5 6.5a3.07 3.07 0 0 0-2.16-2.17C19.42 4 12 4 12 4s-7.42 0-9.34.33A3.07 3.07 0 0 0 .5 6.5 32.06 32.06 0 0 0 0 12a32.06 32.06 0 0 0 .5 5.5 3.07 3.07 0 0 0 2.16 2.17C4.58 20 12 20 12 20s7.42 0 9.34-.33a3.07 3.07 0 0 0 2.16-2.17A32.06 32.06 0 0 0 24 12a32.06 32.06 0 0 0-.5-5.5ZM9.6 15.2V8.8L15.9 12Z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 lg:pt-40">
      <Navbar />

      <section className="px-6 mb-20 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="text-green-primary font-black uppercase tracking-[0.4em] text-sm mb-6 block">
            Get In Touch
          </span>
          <h1 className="text-5xl lg:text-8xl font-black text-navy leading-none mb-8">
            CONTACT <span className="text-green-primary">US.</span>
          </h1>
          <div className="h-2 w-32 bg-mint mx-auto rounded-full" />
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-navy mb-10">We&apos;d love to hear from you.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Call Us", detail: "02934-220935 / 220936", icon: Phone, color: "bg-mint/20 text-navy" },
                { title: "Email Us", detail: "lpsvidhyawadi@gmail.com", icon: Mail, color: "bg-green-primary/20 text-green-primary" },
                { title: "Visit Us", detail: "Vidyawadi, Khimel, Station - Rani, Pali", icon: MapPin, color: "bg-navy/10 text-navy" },
                { title: "Office Hours", detail: "Office enquiry: 11:00 AM to 3:00 PM", icon: Clock, color: "bg-yellow-accent/20 text-navy" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-black text-navy uppercase text-xs tracking-widest mb-2">{item.title}</h3>
                  <p className="text-gray-600 font-bold">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-[3rem] border border-white shadow-2xl bg-white">
              <div className="flex flex-col gap-4 bg-navy p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-mint">Campus Map</p>
                  <p className="mt-2 text-white/70 font-medium">
                    Marudhar Mahila Shikshan Sangh, Vidyawadi, Khimel, Rani, Pali, Rajasthan
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={schoolDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-mint px-5 py-3 text-xs font-black uppercase tracking-widest text-navy transition-transform hover:-translate-y-0.5"
                  >
                    Directions
                  </a>
                  <a
                    href={schoolMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                  >
                    Google Maps
                  </a>
                  <a
                    href={schoolYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                  >
                    <YouTubeMark />
                    YouTube
                  </a>
                </div>
              </div>
              <iframe
                title="Marudhar Mahila Shikshan Sangh campus map"
                src="https://www.google.com/maps?q=25.3203814,73.2915418&z=15&output=embed"
                className="h-[400px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="bg-navy p-8 lg:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-mint/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-4">Send a Message</h2>
              <p className="text-white/60 font-medium mb-10">
                Have a question? Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-mint uppercase tracking-widest ml-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-mint transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-mint uppercase tracking-widest ml-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-mint transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-mint uppercase tracking-widest ml-2">Subject</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-mint transition-colors appearance-none">
                    <option className="bg-navy">Admissions Inquiry</option>
                    <option className="bg-navy">General Question</option>
                    <option className="bg-navy">Career Opportunity</option>
                    <option className="bg-navy">Fee Related</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-mint uppercase tracking-widest ml-2">Your Message</label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-mint transition-colors resize-none"
                  ></textarea>
                </div>
                <button className="w-full bg-mint text-navy py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Send Message
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
