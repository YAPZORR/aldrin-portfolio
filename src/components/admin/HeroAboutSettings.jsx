const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { Save, Check } from "lucide-react";

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
  aboutHeadline: "Hello, I'm Aldrin Eyana",
  aboutTitle: "Digital and Product Designer",
  aboutSubtitle: "Based In Philippines.",
  aboutIntro: "Discover my portfolio showcasing three years of crafting user-centered digital products as a UI/UX designer from the Philippines.",
  bio: "Seamlessly blending aesthetics with functionality, I create engaging digital experiences that prioritize user satisfaction.",
  birthday: "26 February 2000",
  website: "yapzorr.github.io/aldrin",
  city: "Agusan del Sur, Philippines",
  age: "24",
  degree: "Bachelor's",
  email: "aldrineyana1@gmail.com",
  freelanceStatus: "Available",
};

function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div>
      <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 resize-none placeholder-white/20 transition-all" />
        : <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 placeholder-white/20 transition-all" />
      }
    </div>
  );
}

export default function HeroAboutSettings() {
  const [form, setForm] = useState(DEFAULT);
  const [recordId, setRecordId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.entities.PortfolioSettings.list().then(data => {
      if (data.length > 0) { setForm({ ...DEFAULT, ...data[0] }); setRecordId(data[0].id); }
    });
  }, []);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    if (recordId) await db.entities.PortfolioSettings.update(recordId, form);
    else { const r = await db.entities.PortfolioSettings.create(form); setRecordId(r.id); }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">Hero Section</h3>
        <Field label="Hero Title" value={form.heroTitle} onChange={v => set("heroTitle", v)} />
        <Field label="Hero Italic Text" value={form.heroItalicText} onChange={v => set("heroItalicText", v)} />
        <Field label="Your Name" value={form.name} onChange={v => set("name", v)} />
        <Field label="Your Role" value={form.role} onChange={v => set("role", v)} />
        <Field label="Phone" value={form.phone} onChange={v => set("phone", v)} />
        <Field label="Resume Link" value={form.resumeLink} onChange={v => set("resumeLink", v)} />
      </div>

      {/* Social Links */}
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">Social Links</h3>
        <Field label="Facebook URL" value={form.facebookUrl} onChange={v => set("facebookUrl", v)} />
        <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={v => set("linkedinUrl", v)} />
        <Field label="GitHub URL" value={form.githubUrl} onChange={v => set("githubUrl", v)} />
      </div>

      {/* About Section */}
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">About / Personal Details</h3>
        <Field label="About Headline" value={form.aboutHeadline} onChange={v => set("aboutHeadline", v)} />
        <Field label="About Title" value={form.aboutTitle} onChange={v => set("aboutTitle", v)} />
        <Field label="About Subtitle" value={form.aboutSubtitle} onChange={v => set("aboutSubtitle", v)} />
        <Field label="About Intro Text" value={form.aboutIntro} onChange={v => set("aboutIntro", v)} multiline />
        <Field label="Bio Quote" value={form.bio} onChange={v => set("bio", v)} multiline />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Birthday" value={form.birthday} onChange={v => set("birthday", v)} />
          <Field label="Age" value={form.age} onChange={v => set("age", v)} />
          <Field label="Website" value={form.website} onChange={v => set("website", v)} />
          <Field label="City" value={form.city} onChange={v => set("city", v)} />
          <Field label="Degree" value={form.degree} onChange={v => set("degree", v)} />
          <Field label="Email" value={form.email} onChange={v => set("email", v)} />
          <Field label="Freelance Status" value={form.freelanceStatus} onChange={v => set("freelanceStatus", v)} />
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-500/80 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
      </button>
    </div>
  );
}