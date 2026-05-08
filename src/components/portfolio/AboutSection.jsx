const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

import { Facebook, Linkedin, Github } from "lucide-react";

const DEFAULT = {
  aboutHeadline: "Hello, I'm Aldrin Eyana",
  aboutTitle: "Digital and Product Designer",
  aboutSubtitle: "Based In Philippines.",
  aboutIntro: "Discover my portfolio showcasing three years of crafting user-centered digital products as a UI/UX designer from the Philippines.",
  bio: "Seamlessly blending aesthetics with functionality, I create engaging digital experiences that prioritize user satisfaction.",
  birthday: "26 February 2000",
  website: "yapzorr.github.io/aldrin",
  phone: "+63 09518189613",
  city: "Agusan del Sur, Philippines",
  age: "24",
  degree: "Bachelor's",
  email: "aldrineyana1@gmail.com",
  freelanceStatus: "Available",
  facebookUrl: "https://www.facebook.com/aldrineyana98",
  linkedinUrl: "https://www.linkedin.com/in/aldrin-eyana-1335ba26b/",
  githubUrl: "https://github.com/YAPZORR",
};

function CopyValue({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="flex items-center gap-1.5">
      {value}
      <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-white/30 hover:text-white/60 transition-colors">
        {copied ? <Check size={11} /> : <Copy size={11} />}
      </button>
    </span>
  );
}

export default function AboutSection() {
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
  ].filter(x => x.href);

  const details = [
    { label: "Birthday", value: s.birthday },
    { label: "Website", value: s.website },
    { label: "Phone", value: s.phone, copyable: true },
    { label: "City", value: s.city },
    { label: "Age", value: s.age },
    { label: "Degree", value: s.degree },
    { label: "Email", value: s.email, copyable: true },
    { label: "Freelance", value: s.freelanceStatus, highlight: true },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2">{s.aboutHeadline}</p>
          <div className="w-12 h-[2px] bg-primary mx-auto mb-6" />
          <h2 className="font-inter text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{s.aboutTitle}</h2>
          <p className="font-inter text-lg sm:text-xl text-white/40 font-light mb-8">{s.aboutSubtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="font-inter text-sm text-white/50 leading-relaxed mb-8 max-w-2xl mx-auto">{s.aboutIntro}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
          {details.map((d) => (
            <div key={d.label} className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <p className="font-inter text-xs text-white/30 uppercase tracking-wider mb-1">{d.label}</p>
              {d.highlight
                ? <p className="font-inter text-xs text-green-400 font-medium">{d.value}</p>
                : d.copyable
                  ? <p className="font-inter text-xs text-white/60"><CopyValue value={d.value} /></p>
                  : <p className="font-inter text-xs text-white/60">{d.value}</p>
              }
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}