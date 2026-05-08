const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { Plus, Trash2, Edit2, X, Save, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMPTY = { title: "", date: "", company: "", type: "Full-time", mode: "Remote", description: "", order: 0 };

function Field({ label, value, onChange, multiline }) {
  return (
    <div>
      <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={4} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 resize-none transition-all" />
        : <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 transition-all" />
      }
    </div>
  );
}

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.entities.Experience.list("order", 50).then(setExperiences);
  }, []);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function openEdit(exp) { setEditing(exp.id); setForm({ ...EMPTY, ...exp }); }
  function openNew() { setEditing("new"); setForm({ ...EMPTY, order: experiences.length + 1 }); }

  async function handleSave() {
    if (editing === "new") {
      const r = await db.entities.Experience.create(form);
      setExperiences(e => [...e, r]);
    } else {
      await db.entities.Experience.update(editing, form);
      setExperiences(e => e.map(x => x.id === editing ? { ...x, ...form } : x));
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); }, 1500);
  }

  async function handleDelete(id) {
    await db.entities.Experience.delete(id);
    setExperiences(e => e.filter(x => x.id !== id));
  }

  const sorted = [...experiences].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">Experiences ({experiences.length})</h3>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-primary text-sm font-inter hover:bg-primary/30 transition-all">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((exp) => (
          <div key={exp.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm text-white">{exp.title}</p>
              <p className="font-inter text-xs text-white/30">{exp.company} · {exp.date}</p>
            </div>
            <button onClick={() => openEdit(exp)} className="p-2 text-white/40 hover:text-white"><Edit2 size={15} /></button>
            <button onClick={() => handleDelete(exp.id)} className="p-2 text-white/40 hover:text-red-400"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setEditing(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-8 lg:inset-[15%] z-50 bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-inter font-bold text-white">{editing === "new" ? "Add Experience" : "Edit Experience"}</h3>
                  <button onClick={() => setEditing(null)} className="p-2 text-white/40 hover:text-white"><X size={18} /></button>
                </div>
                <Field label="Job Title" value={form.title} onChange={v => set("title", v)} />
                <Field label="Company" value={form.company} onChange={v => set("company", v)} />
                <Field label="Date Range" value={form.date} onChange={v => set("date", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Type" value={form.type} onChange={v => set("type", v)} />
                  <Field label="Mode" value={form.mode} onChange={v => set("mode", v)} />
                </div>
                <Field label="Description" value={form.description} onChange={v => set("description", v)} multiline />
                <Field label="Display Order" value={String(form.order)} onChange={v => set("order", Number(v))} />
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-500/80 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 transition-all">
                  {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}