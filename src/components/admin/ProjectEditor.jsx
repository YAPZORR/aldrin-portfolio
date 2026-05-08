const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";

import { ArrowLeft, Save, Check, Upload, Image, Plus, X, Monitor, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMPTY = {
  title: "", mainImage: "", heroBackground: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
  tagline: "", description: "", audience: "", challenges: "",
  collaborativeIntro: "", collaborativeInAction: "", whatILearned: "",
  whatIDid: JSON.stringify([
    { title: "Meeting and Design Discussion", description: "" },
    { title: "WireFraming", description: "" },
    { title: "High Fidelity Design", description: "" },
  ]),
  services: [], deliverables: [], projectLink: "", status: "In Development", order: 0,
  galleryImages: [], scrollableFrameEnabled: false, scrollableFrameImage: "", scrollableFrames: []
};

function Field({ label, value, onChange, multiline, placeholder, hint }) {
  return (
    <div>
      <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1">{label}</label>
      {hint && <p className="text-xs text-white/20 font-inter mb-1.5">{hint}</p>}
      {multiline
        ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 resize-none placeholder-white/20 transition-all" />
        : <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 placeholder-white/20 transition-all" />
      }
    </div>
  );
}

function WhatIDidEditor({ value, onChange }) {
  let steps = [];
  try { steps = JSON.parse(value || "[]"); } catch { steps = []; }

  function updateStep(i, key, val) {
    const next = steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    onChange(JSON.stringify(next));
  }
  function addStep() { onChange(JSON.stringify([...steps, { title: "", description: "" }])); }
  function removeStep(i) { onChange(JSON.stringify(steps.filter((_, idx) => idx !== i))); }

  return (
    <div className="space-y-3">
      <label className="block font-inter text-xs text-white/40 uppercase tracking-wider">What I Did (Steps)</label>
      {steps.map((step, i) => (
        <div key={i} className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30 font-inter">Step {i + 1}</span>
            <button onClick={() => removeStep(i)} className="text-white/30 hover:text-red-400 transition-colors"><X size={12} /></button>
          </div>
          <input type="text" value={step.title || ""} onChange={e => updateStep(i, "title", e.target.value)} placeholder="Step title..." className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs font-inter focus:outline-none focus:border-primary/50 placeholder-white/20" />
          <textarea value={step.description || ""} onChange={e => updateStep(i, "description", e.target.value)} placeholder="Step description..." rows={2} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs font-inter focus:outline-none focus:border-primary/50 resize-none placeholder-white/20" />
        </div>
      ))}
      <button onClick={addStep} className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary font-inter transition-colors">
        <Plus size={13} /> Add Step
      </button>
    </div>
  );
}

export default function ProjectEditor({ project, projectCount, onBack, onSaved }) {
  const isNew = !project?.id;
  const [form, setForm] = useState(() => {
    if (isNew) return { ...EMPTY, order: projectCount + 1 };
    return {
      ...EMPTY, ...project,
      services: Array.isArray(project.services) ? project.services.join(", ") : project.services || "",
      deliverables: Array.isArray(project.deliverables) ? project.deliverables.join(", ") : project.deliverables || "",
    };
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingFrame, setUploadingFrame] = useState(false);
  const [activeFrameTab, setActiveFrameTab] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    const data = {
      ...form,
      services: typeof form.services === "string" ? form.services.split(",").map(s => s.trim()).filter(Boolean) : form.services,
      deliverables: typeof form.deliverables === "string" ? form.deliverables.split(",").map(s => s.trim()).filter(Boolean) : form.deliverables,
      order: Number(form.order) || 0,
    };
    if (isNew) {
      await db.entities.Project.create(data);
    } else {
      await db.entities.Project.update(project.id, data);
    }
    setSaved(true);
    setTimeout(() => { onSaved(); }, 1200);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    set("mainImage", file_url);
    setUploading(false);
    // Auto-trigger AI analysis after upload
    await analyzeImage(file_url);
  }

  async function analyzeImage(imageUrl) {
    const url = imageUrl || form.mainImage;
    if (!url) return;
    setAnalyzing(true);
    setAiApplied(false);
    const result = await db.integrations.Core.InvokeLLM({
      prompt: `You are an expert UI/UX design analyst. Analyze this project image (likely a UI/UX design, app screenshot, or website mockup) and extract the following information. Be specific and professional.

Return a JSON with these exact keys:
- title: A concise, professional project title (2-5 words, e.g. "Food Delivery App", "E-Commerce Dashboard")
- tagline: A compelling one-line tagline/headline describing the project's purpose or value (max 12 words)
- heroBackground: A CSS gradient string that matches the dominant color palette of the image (use linear-gradient with 2-3 hex colors that complement the design's color scheme, format: "linear-gradient(135deg, #hex1, #hex2)")
- services: Comma-separated list of design services visible or implied in this project (e.g. "UI Design, UX Research, Prototyping, Mobile App Design")
- deliverables: Comma-separated list of deliverables this project would produce (e.g. "Mobile App, Design System, Wireframes, Prototype")

Be creative and specific based on what you actually see in the image. Match colors from the image for heroBackground.`,
      file_urls: [url],
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          tagline: { type: "string" },
          heroBackground: { type: "string" },
          services: { type: "string" },
          deliverables: { type: "string" },
        }
      }
    });
    setForm(f => ({
      ...f,
      title: result.title || f.title,
      tagline: result.tagline || f.tagline,
      heroBackground: result.heroBackground || f.heroBackground,
      services: result.services || f.services,
      deliverables: result.deliverables || f.deliverables,
    }));
    setAnalyzing(false);
    setAiApplied(true);
    setTimeout(() => setAiApplied(false), 4000);
  }

  async function handleGalleryUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingGallery(true);
    const urls = await Promise.all(files.map(f => db.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
    set("galleryImages", [...(form.galleryImages || []), ...urls]);
    setUploadingGallery(false);
  }

  function removeGalleryImage(idx) {
    set("galleryImages", (form.galleryImages || []).filter((_, i) => i !== idx));
  }

  async function handleFrameUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingFrame(true);
    const current = form.scrollableFrames || [];
    const newFrames = await Promise.all(
      files.map(async (f) => {
        const { file_url } = await db.integrations.Core.UploadFile({ file: f });
        return { label: `Preview ${current.length + files.indexOf(f) + 1}`, url: file_url };
      })
    );
    const updated = [...current, ...newFrames];
    set("scrollableFrames", updated);
    setActiveFrameTab(updated.length - 1);
    setUploadingFrame(false);
  }

  function removeFrame(idx) {
    const updated = (form.scrollableFrames || []).filter((_, i) => i !== idx);
    set("scrollableFrames", updated);
    setActiveFrameTab(Math.min(activeFrameTab, updated.length - 1));
  }

  function updateFrameLabel(idx, label) {
    const updated = (form.scrollableFrames || []).map((f, i) => i === idx ? { ...f, label } : f);
    set("scrollableFrames", updated);
  }

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white bg-white/[0.04] border border-white/10 rounded-xl text-sm font-inter transition-all hover:bg-white/[0.08]">
          <ArrowLeft size={15} /> Back to Projects
        </button>
        <div>
          <h2 className="font-inter text-lg font-bold text-white">{isNew ? "Add New Project" : `Edit: ${project.title}`}</h2>
          <p className="font-inter text-xs text-white/30">Fill in the project details below</p>
        </div>
      </div>

      {/* AI Analyzing Overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0e0e0e] border border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl" style={{ boxShadow: "0 0 60px rgba(139,92,246,0.2)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))", border: "1px solid rgba(139,92,246,0.4)" }}>
                <Sparkles size={26} className="text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-inter font-bold text-white text-base mb-1">AI is analyzing your image</p>
                <p className="font-inter text-sm text-white/40">Extracting title, tagline, colors, services & deliverables...</p>
              </div>
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
        {/* Basic Info */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider font-inter border-b border-white/[0.06] pb-2">Basic Info</p>
          <Field label="Title" value={form.title} onChange={v => set("title", v)} />

          {/* Image */}
          <div>
            <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1">Image / GIF</label>
            <p className="text-xs text-white/20 font-inter mb-1.5">Supports regular images and animated GIFs</p>
            <div className="flex gap-2 mb-2">
              <input type="text" value={form.mainImage || ""} onChange={e => set("mainImage", e.target.value)} placeholder="Paste image or GIF URL..." className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 placeholder-white/20" />
              <label className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs font-inter cursor-pointer hover:bg-white/10 transition-all whitespace-nowrap">
                {uploading ? "Uploading..." : <><Upload size={13} /> Upload</>}
                <input type="file" accept="image/*,.gif" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {form.mainImage && (
              <div className="flex items-start gap-3 flex-wrap">
                <div className="relative inline-block">
                  <img src={form.mainImage} alt="" className="h-24 rounded-lg object-cover" />
                  <span className="absolute top-1 right-1 bg-black/60 text-white/60 text-[10px] px-1.5 py-0.5 rounded font-inter flex items-center gap-1"><Image size={9} /> preview</span>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => analyzeImage()}
                    disabled={analyzing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-inter font-semibold transition-all border disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.2))", borderColor: "rgba(139,92,246,0.4)", color: "#c4b5fd" }}
                  >
                    {analyzing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    {analyzing ? "Analyzing image..." : "AI Auto-Fill Fields"}
                  </button>
                  <AnimatePresence>
                    {aiApplied && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-emerald-400 font-inter flex items-center gap-1"
                      >
                        <Check size={11} /> Fields filled by AI
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="text-[10px] text-white/20 font-inter">AI analyzes the image and auto-fills title, tagline, colors, services & deliverables</p>
                </div>
              </div>
            )}
          </div>

          <Field label="Hero Background (CSS gradient or color)" value={form.heroBackground} onChange={v => set("heroBackground", v)} placeholder="linear-gradient(135deg, #ff6b9d, #c0392b)" />
          <Field label="Tagline / Headline" value={form.tagline} onChange={v => set("tagline", v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status" value={form.status} onChange={v => set("status", v)} />
            <Field label="Display Order" value={String(form.order)} onChange={v => set("order", v)} />
          </div>
          <Field label="Services (comma separated)" value={form.services} onChange={v => set("services", v)} placeholder="Landing Page Design, UI/UX Design" />
          <Field label="Deliverables (comma separated)" value={form.deliverables} onChange={v => set("deliverables", v)} placeholder="Website, Mobile App" />
          <Field label="Project Link" value={form.projectLink} onChange={v => set("projectLink", v)} />
        </div>

        {/* Gallery Images */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider font-inter">Gallery Images</p>
          <p className="text-xs text-white/20 font-inter">These images appear in the project detail panel as a gallery visitors can browse.</p>
          <div className="grid grid-cols-3 gap-2">
            {(form.galleryImages || []).map((url, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden aspect-video bg-white/5 border border-white/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-video bg-white/[0.03] border border-dashed border-white/10 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-white/[0.06] transition-all text-white/30 hover:text-primary">
              {uploadingGallery ? <span className="text-xs font-inter">Uploading...</span> : <><Upload size={16} /><span className="text-[10px] mt-1 font-inter">Add Images</span></>}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
            </label>
          </div>
        </div>

        {/* Scrollable Frames */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider font-inter">Scrollable Frames</p>
              <p className="text-xs text-white/20 font-inter mt-0.5">Upload long screenshots — visitors can scroll them like a live website. Multiple uploads create tabs.</p>
            </div>
            <button onClick={() => set("scrollableFrameEnabled", !form.scrollableFrameEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-inter transition-all border ${form.scrollableFrameEnabled ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/40"}`}>
              <Monitor size={13} /> {form.scrollableFrameEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
          {form.scrollableFrameEnabled && (
            <div className="space-y-3">
              {/* Tab list */}
              {(form.scrollableFrames || []).length > 0 && (
                <div className="space-y-2">
                  {/* Tab headers */}
                  <div className="flex gap-2 flex-wrap">
                    {(form.scrollableFrames || []).map((frame, idx) => (
                      <button key={idx} onClick={() => setActiveFrameTab(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-inter transition-all border ${activeFrameTab === idx ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"}`}>
                        {frame.label || `Preview ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                  {/* Active frame editor */}
                  {form.scrollableFrames[activeFrameTab] && (
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={form.scrollableFrames[activeFrameTab].label || ""}
                          onChange={e => updateFrameLabel(activeFrameTab, e.target.value)}
                          placeholder={`Preview ${activeFrameTab + 1}`}
                          className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs font-inter focus:outline-none focus:border-primary/50 placeholder-white/20"
                        />
                        <button onClick={() => removeFrame(activeFrameTab)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><X size={13} /></button>
                      </div>
                      <div className="relative h-28 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                        <img src={form.scrollableFrames[activeFrameTab].url} alt="" className="w-full h-auto" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end p-2">
                          <span className="text-[10px] text-white/50 font-inter">Long screenshot preview</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Upload button */}
              <label className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-white/[0.05] transition-all text-white/40 hover:text-primary w-fit">
                {uploadingFrame ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Add Screenshot(s)</>}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFrameUpload} />
              </label>
              {(form.scrollableFrames || []).length === 0 && (
                <p className="text-xs text-white/20 font-inter">No frames yet. Upload one or more long screenshots.</p>
              )}
            </div>
          )}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 pt-2 border-t border-white/[0.06]">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider font-inter">Project Details</p>
          <Field label="Audience" value={form.audience} onChange={v => set("audience", v)} multiline />
          <Field label="Challenges & Solutions" value={form.challenges} onChange={v => set("challenges", v)} multiline />
          <Field label="Collaborative Innovation - Intro" value={form.collaborativeIntro} onChange={v => set("collaborativeIntro", v)} multiline hint="Paragraph under 'Introducing Enhanced Collaborative Design'" />
          <Field label="Collaborative Innovation in Action" value={form.collaborativeInAction} onChange={v => set("collaborativeInAction", v)} multiline />
          <WhatIDidEditor value={form.whatIDid} onChange={v => set("whatIDid", v)} />
          <Field label="What I Learned About the Project" value={form.whatILearned} onChange={v => set("whatILearned", v)} multiline />
        </div>

        <button onClick={handleSave} disabled={saved} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-500/80 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-70">
          {saved ? <><Check size={16} /> Saved! Going back...</> : <><Save size={16} /> Save Project</>}
        </button>
      </div>
    </motion.div>
  );
}