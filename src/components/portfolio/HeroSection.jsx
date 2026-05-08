const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { User, Briefcase, Phone } from "lucide-react";
import { Facebook, Linkedin, Github } from "lucide-react";
import FloatingShapes from "./FloatingShapes";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

const DEFAULT = {
  heroTitle: "I'm passionate about creating beautiful products that",
  heroItalicText: "empower people.",
  name: "Aldrin Eyana",
  role: "Product Designer",
  phone: "(+63) 9518189613",
  resumeLink: "https://drive.google.com/file/d/1TAyb5X_wGf5dtT7Y1Hn2b3Nnw-lLpCvC/view?usp=sharing",
  facebookUrl: "https://www.facebook.com/aldrineyana98",
  linkedinUrl: "https://www.linkedin.com/in/aldrin-eyana-1335ba26b/",
  githubUrl: "https://github.com/YAPZORR",
};

export default function HeroSection() {
  const [s, setS] = useState(DEFAULT);

  useEffect(() => {
    db.entities.PortfolioSettings.list().then(data => {
      if (data.length > 0) setS({ ...DEFAULT, ...data[0] });
    });
  }, []);

  const socials = [
    { icon: Facebook, href: s.facebookUrl, label: "Facebook" },
    { icon: Linkedin, href: s.linkedinUrl, label: "LinkedIn" },
    { icon: Github, href: s.githubUrl, label: "Github" },
  ].filter(s => s.href);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <FloatingShapes />

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-inter text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-8 px-4"
        >
          {s.heroTitle}{" "}
          <span className="font-playfair italic font-bold">{s.heroItalicText}</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {socials.map((soc) => (
              <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent("social_click", soc.label.toLowerCase())}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-300 group relative">
                <soc.icon size={18} />
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{soc.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-white/50 text-xs sm:text-sm mb-10 px-4">
          <span className="flex items-center gap-1.5"><User size={14} />{s.name}</span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5"><Briefcase size={14} />{s.role}</span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5"><Phone size={14} />{s.phone}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
          <a href={s.resumeLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("resume_click")}
            className="inline-block px-10 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white font-inter font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:border-transparent">
            Resume
          </a>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a href="#projects" className="text-white/30 hover:text-white/60 transition-colors text-xs sm:text-sm flex flex-col items-center gap-2">
          <span>Scroll For More</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </a>
      </motion.div>
    </section>
  );
}