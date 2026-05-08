import { X, ExternalLink, Building2, ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProjectSidePanel({ project, onClose }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    if (project) { document.body.style.overflow = "hidden"; setGalleryIndex(0); setActiveFrame(0); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  let whatIDid = [];
  if (project?.whatIDid) {
    try { whatIDid = JSON.parse(project.whatIDid); } catch {}
  }

  const gallery = project?.galleryImages?.filter(Boolean) || [];
  const frames = project?.scrollableFrames?.filter(f => f.url) ||
    (project?.scrollableFrameImage ? [{ label: "Preview 1", url: project.scrollableFrameImage }] : []);

  const hasFrames = project?.scrollableFrameEnabled && frames.length > 0;

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Live Preview Panel — pops out to the LEFT of the sidebar */}
          {hasFrames && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: "spring", damping: 30, stiffness: 280, delay: 0.08 }}
              className="fixed top-4 bottom-4 right-[calc(min(100vw,768px)+16px)] z-50 flex flex-col"
              style={{ width: "clamp(500px, 65vw, 1100px)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/[0.07] shadow-2xl rounded-2xl overflow-hidden">
                {/* Panel header */}
                <div className="px-5 py-4 border-b border-white/[0.07] space-y-3" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.06))" }}>
                  <div className="flex items-center gap-2">
                    <Monitor size={15} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="font-inter text-sm font-semibold text-white leading-tight">Live Preview</p>
                      <p className="font-inter text-[11px] text-white/30 leading-tight">Scroll to explore the design</p>
                    </div>
                  </div>
                  {/* Tabs */}
                  {frames.length > 1 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {frames.map((frame, i) => (
                        <button key={i} onClick={() => setActiveFrame(i)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-inter font-medium transition-all border ${activeFrame === i ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/[0.04] border-white/10 text-white/40 hover:text-white/70"}`}>
                          {frame.label || `Preview ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Browser chrome */}
                <div className="bg-[#151515] px-4 py-2 flex items-center gap-2 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-2 bg-white/[0.04] rounded px-3 py-1 text-[10px] text-white/25 font-inter truncate">
                    {project.projectLink || "www.project-preview.com"}
                  </div>
                </div>

                {/* Scrollable frame */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeFrame} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <img src={frames[activeFrame]?.url} alt="Scrollable preview" className="w-full h-auto block" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-3xl bg-[#0d0d0d] z-50 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
              <X size={16} />
            </button>

            {/* Hero Image */}
            <div className="relative w-full h-64 sm:h-80 overflow-hidden flex items-center justify-center"
              style={{ background: project.heroBackground || "linear-gradient(135deg, #ff6b6b, #ffa07a)" }}>
              {project.mainImage && (
                <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Content */}
            <div className="px-6 sm:px-10 py-8 space-y-8">

              {/* Title + Company */}
              <div>
                <h2 className="font-inter text-xl sm:text-2xl font-bold text-white tracking-wide uppercase text-center mb-3">
                  {project.title}
                </h2>
                {project.tagline && (
                  <h3 className="font-inter text-base sm:text-lg font-bold text-white leading-tight mt-4 mb-2">
                    {project.title} - <span className="font-normal">{project.tagline}</span>
                  </h3>
                )}
                {project.company && (
                  <p className="flex items-center gap-1.5 text-primary text-sm font-inter">
                    <Building2 size={13} /> {project.company}
                  </p>
                )}
                {project.description && (
                  <p className="font-inter text-sm text-white/50 leading-relaxed mt-3">{project.description}</p>
                )}
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-white/10">
                <div>
                  <p className="font-inter text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Service</p>
                  {(project.services || []).map((s, i) => (
                    <p key={i} className="font-inter text-xs text-white/60 mb-1">{s}</p>
                  ))}
                </div>
                <div>
                  <p className="font-inter text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Deliverables</p>
                  {(project.deliverables || []).map((d, i) => (
                    <p key={i} className="font-inter text-xs text-white/60 mb-1">{d}</p>
                  ))}
                </div>
                <div>
                  <p className="font-inter text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Links</p>
                  {project.projectLink
                    ? <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="font-inter text-xs text-primary hover:text-purple-300 flex items-center gap-1">Website <ExternalLink size={10} /></a>
                    : <p className="font-inter text-xs text-white/30">—</p>}
                </div>
                <div>
                  <p className="font-inter text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Status</p>
                  <span className="font-inter text-xs text-green-400">{project.status || "Completed"}</span>
                </div>
              </div>

              {/* Audience */}
              {project.audience && (
                <div className="pb-6 border-b border-white/[0.06]">
                  <h4 className="font-inter text-sm font-bold text-white mb-3">Audience</h4>
                  <p className="font-inter text-sm text-white/50 leading-relaxed">{project.audience}</p>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && (
                <div className="pb-6 border-b border-white/[0.06]">
                  <h4 className="font-inter text-sm font-bold text-white mb-3">Challenges and Solutions.</h4>
                  <p className="font-inter text-sm text-white/50 leading-relaxed">{project.challenges}</p>
                </div>
              )}

              {/* Collaborative Innovation */}
              {(project.collaborativeIntro || project.collaborativeInAction) && (
                <div className="pb-6 border-b border-white/[0.06] space-y-4">
                  {project.collaborativeIntro && (
                    <div>
                      <h4 className="font-inter text-sm font-bold text-white mb-3">Introducing Enhanced Collaborative Design:</h4>
                      <p className="font-inter text-sm text-white/50 leading-relaxed">{project.collaborativeIntro}</p>
                    </div>
                  )}
                  {project.collaborativeInAction && (
                    <div>
                      <h4 className="font-inter text-sm font-bold text-white mb-3">Collaborative Innovation in Action:</h4>
                      <p className="font-inter text-sm text-white/50 leading-relaxed">{project.collaborativeInAction}</p>
                    </div>
                  )}
                </div>
              )}

              {/* What I Did */}
              {whatIDid.length > 0 && (
                <div className="pb-6 border-b border-white/[0.06]">
                  <h4 className="font-inter text-sm font-bold text-white mb-6">
                    What I did <span className="text-primary">•</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {whatIDid.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-sm font-inter font-semibold">
                          {i + 1}
                        </div>
                        <div>
                          <h5 className="font-inter text-sm font-bold text-white mb-2">{step.title}</h5>
                          <p className="font-inter text-xs text-white/50 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What I Learned */}
              {project.whatILearned && (
                <div className="pb-6 border-b border-white/[0.06]">
                  <h4 className="font-inter text-sm font-bold text-primary mb-3 underline underline-offset-4">
                    What I Learned About the Project
                  </h4>
                  <p className="font-inter text-sm text-white/50 leading-relaxed">{project.whatILearned}</p>
                </div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="pb-6 border-b border-white/[0.06]">
                  <h4 className="font-inter text-sm font-bold text-white mb-4">Gallery</h4>
                  <div className="relative">
                    <img src={gallery[galleryIndex]} alt={`Gallery ${galleryIndex + 1}`} className="w-full rounded-xl object-cover max-h-80" />
                    {gallery.length > 1 && (
                      <>
                        <button onClick={() => setGalleryIndex(i => (i - 1 + gallery.length) % gallery.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all">
                          <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => setGalleryIndex(i => (i + 1) % gallery.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all">
                          <ChevronRight size={16} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {gallery.map((_, i) => (
                            <button key={i} onClick={() => setGalleryIndex(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === galleryIndex ? "bg-white scale-125" : "bg-white/40"}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {gallery.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {gallery.map((url, i) => (
                        <button key={i} onClick={() => setGalleryIndex(i)}
                          className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === galleryIndex ? "border-primary" : "border-transparent opacity-50 hover:opacity-80"}`}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Live Preview indicator in sidebar (when panel is open to the left) */}
              {hasFrames && (
                <div className="pb-4">
                  <div className="flex items-center gap-2 px-4 py-3 bg-primary/[0.08] border border-primary/20 rounded-xl">
                    <Monitor size={14} className="text-primary flex-shrink-0" />
                    <p className="font-inter text-xs text-primary/80">Live preview is open to the left ←</p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}