const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { Plus, Trash2, Edit2, X, Save, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TEMPLATES = [
  { id: "skills", label: "Skills / Tech Stack", desc: "Floating tag cloud of your skills", defaultContent: JSON.stringify({ title: "My Skills", skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch", "InVision", "Zeplin", "HTML/CSS", "Prototyping", "User Research"] }) },
  { id: "stats", label: "Stats Counter", desc: "Impressive numbers at a glance", defaultContent: JSON.stringify({ stats: [{ label: "Projects Completed", value: "50+" }, { label: "Happy Clients", value: "30+" }, { label: "Years Experience", value: "3+" }, { label: "Awards", value: "5" }] }) },
  { id: "services", label: "Services Grid", desc: "Cards showcasing what you offer", defaultContent: JSON.stringify({ title: "What I Do", services: [{ title: "UI Design", description: "Beautiful, intuitive interfaces tailored to your brand." }, { title: "UX Research", description: "Data-driven user research to guide design decisions." }, { title: "Prototyping", description: "Interactive prototypes to validate ideas fast." }] }) },
  { id: "testimonial", label: "Testimonial Quote", desc: "A powerful client quote", defaultContent: JSON.stringify({ quote: "Aldrin's work transformed our product. His eye for design and attention to detail is unparalleled.", author: "John Smith", role: "CEO, Ocaye Ltd." }) },
  { id: "contact", label: "Contact Info", desc: "Quick contact info block", defaultContent: JSON.stringify({ title: "Get In Touch", email: "aldrineyana1@gmail.com", phone: "+63 09518189613", location: "Agusan del Sur, Philippines" }) },
  { id: "timeline", label: "Timeline / Journey", desc: "Visual timeline of milestones", defaultContent: JSON.stringify({ title: "My Journey", items: [{ year: "2021", title: "Started Freelancing", description: "Began taking UI/UX projects independently." }, { year: "2022", title: "First Full-time Role", description: "Joined a startup as a product designer." }, { year: "2023", title: "Expanded Internationally", description: "Worked with clients in Norway and UK." }, { year: "2024", title: "Product Leadership", description: "Led design systems and product strategy." }] }) },
  { id: "tools", label: "Tools & Software", desc: "Grid of tools you use with icons", defaultContent: JSON.stringify({ title: "Tools I Use", tools: [{ name: "Figma", level: 95 }, { name: "Adobe XD", level: 80 }, { name: "Photoshop", level: 85 }, { name: "Illustrator", level: 75 }, { name: "Webflow", level: 70 }, { name: "Notion", level: 90 }] }) },
  { id: "faq", label: "FAQ Section", desc: "Frequently asked questions", defaultContent: JSON.stringify({ title: "Frequently Asked Questions", items: [{ question: "What services do you offer?", answer: "I offer UI/UX design, product design, web design, and branding services." }, { question: "How long does a project take?", answer: "Timelines vary by scope, but most projects take 2–6 weeks." }, { question: "Do you work remotely?", answer: "Yes! I work with clients worldwide, fully remote." }, { question: "What's your rate?", answer: "Rates depend on project scope. Let's chat to discuss your needs!" }] }) },
  { id: "cta", label: "Call to Action Banner", desc: "Bold banner to drive contact", defaultContent: JSON.stringify({ headline: "Let's Build Something Amazing Together", subtext: "Available for freelance projects and full-time opportunities.", buttonText: "Get In Touch", buttonEmail: "aldrineyana1@gmail.com" }) },
  { id: "awards", label: "Awards & Recognition", desc: "Showcase your achievements", defaultContent: JSON.stringify({ title: "Awards & Recognition", items: [{ title: "Best UI Design 2023", org: "Design Awards PH", year: "2023" }, { title: "Top Freelancer", org: "Upwork", year: "2022" }, { title: "Product Design Excellence", org: "UX Collective", year: "2024" }] }) },
];

export default function ExtraSectionsManager() {
  const [sections, setSections] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ template: "skills", order: 1, content: "" });
  const [saved, setSaved] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    db.entities.ExtraSection.list("order", 50).then(setSections);
  }, []);

  function openNew() { setShowTemplates(true); }

  function selectTemplate(tpl) {
    setForm({ template: tpl.id, order: sections.length + 1, content: tpl.defaultContent });
    setEditing("new");
    setShowTemplates(false);
  }

  function openEdit(s) {
    setEditing(s.id);
    setForm({ template: s.template, order: s.order || 1, content: s.content || "" });
  }

  async function handleSave() {
    if (editing === "new") {
      const r = await db.entities.ExtraSection.create(form);
      setSections(s => [...s, r]);
    } else {
      await db.entities.ExtraSection.update(editing, form);
      setSections(s => s.map(x => x.id === editing ? { ...x, ...form } : x));
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); }, 1500);
  }

  async function handleDelete(id) {
    await db.entities.ExtraSection.delete(id);
    setSections(s => s.filter(x => x.id !== id));
  }

  const tplMap = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">Extra Sections ({sections.length})</h3>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-primary text-sm font-inter hover:bg-primary/30 transition-all">
          <Plus size={16} /> Add Section
        </button>
      </div>

      <div className="space-y-3">
        {[...sections].sort((a, b) => (a.order || 0) - (b.order || 0)).map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl">
            <div className="flex-1">
              <p className="font-inter text-sm text-white">{tplMap[s.template]?.label || s.template}</p>
              <p className="font-inter text-xs text-white/30">{tplMap[s.template]?.desc} · Order {s.order}</p>
            </div>
            <button onClick={() => openEdit(s)} className="p-2 text-white/40 hover:text-white"><Edit2 size={15} /></button>
            <button onClick={() => handleDelete(s.id)} className="p-2 text-white/40 hover:text-red-400"><Trash2 size={15} /></button>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="text-white/30 text-sm font-inter text-center py-8">No extra sections yet. Add one to enhance your portfolio.</p>
        )}
      </div>

      {/* Template Picker */}
      <AnimatePresence>
        {showTemplates && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowTemplates(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-8 lg:inset-[20%] z-50 bg-[#0e0e0e] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-inter font-bold text-white">Choose Template</h3>
                <button onClick={() => setShowTemplates(false)} className="p-2 text-white/40 hover:text-white"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATES.map(tpl => (
                  <button key={tpl.id} onClick={() => selectTemplate(tpl)}
                    className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-left hover:border-primary/40 hover:bg-white/[0.06] transition-all group">
                    <p className="font-inter text-sm font-semibold text-white group-hover:text-primary transition-colors">{tpl.label}</p>
                    <p className="font-inter text-xs text-white/40 mt-1">{tpl.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Content Modal */}
      <AnimatePresence>
        {editing && editing !== "new" || (editing === "new" && !showTemplates && form.template) ? (
          editing && !showTemplates && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setEditing(null)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-8 lg:inset-[15%] z-50 bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-y-auto">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-inter font-bold text-white">{tplMap[form.template]?.label}</h3>
                    <button onClick={() => setEditing(null)} className="p-2 text-white/40 hover:text-white"><X size={18} /></button>
                  </div>
                  <div>
                    <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1.5">Display Order</label>
                    <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50" />
                  </div>
                  <div>
                    <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1.5">Content (JSON)</label>
                    <p className="text-xs text-white/30 font-inter mb-2">Edit the JSON content to customize this section's data.</p>
                    <textarea value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={12}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs font-mono focus:outline-none focus:border-primary/50 resize-none transition-all" />
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-500/80 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 transition-all">
                    {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Section</>}
                  </button>
                </div>
              </motion.div>
            </>
          )
        ) : null}
      </AnimatePresence>
    </div>
  );
}