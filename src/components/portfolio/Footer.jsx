const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Facebook, Linkedin, Github } from "lucide-react";
import { useState, useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

const DEFAULT = {
  facebookUrl: "https://www.facebook.com/aldrineyana98",
  linkedinUrl: "https://www.linkedin.com/in/aldrin-eyana-1335ba26b/",
  githubUrl: "https://github.com/YAPZORR",
  name: "aldrineyana",
};

export default function Footer() {
  const [s, setS] = useState(DEFAULT);

  useEffect(() => {
    db.entities.PortfolioSettings.list().then(data => {
      if (data.length > 0) setS({ ...DEFAULT, ...data[0] });
    });
  }, []);

  const socials = [
    { icon: Facebook, href: s.facebookUrl, label: "facebook" },
    { icon: Linkedin, href: s.linkedinUrl, label: "linkedin" },
    { icon: Github, href: s.githubUrl, label: "github" },
  ].filter(x => x.href);

  return (
    <footer className="py-12 px-4 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          {socials.map((soc, i) => (
            <a key={i} href={soc.href} target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", soc.label)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-300">
              <soc.icon size={18} />
            </a>
          ))}
        </div>
        <p className="font-inter text-white/30 text-xs tracking-wider">@{s.name?.toLowerCase().replace(/\s+/g, '') || 'aldrineyana'} 2025</p>
      </div>
    </footer>
  );
}