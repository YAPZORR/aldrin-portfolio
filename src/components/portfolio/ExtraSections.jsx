import { motion } from "framer-motion";

function SkillsTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2">{data.title || "Skills"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-10" />
        <div className="flex flex-wrap justify-center gap-3">
          {(data.skills || []).map((skill, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm font-inter hover:bg-white/10 hover:border-primary/40 transition-all">
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(data.stats || []).map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <div className="font-inter text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-inter text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2">{data.title || "Services"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {(data.services || []).map((svc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-primary/30 transition-all text-left">
              <h3 className="font-inter font-semibold text-white mb-2">{svc.title}</h3>
              <p className="font-inter text-sm text-white/40 leading-relaxed">{svc.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8 bg-white/[0.02]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair text-xl sm:text-2xl italic text-white/80 mb-6 leading-relaxed">
          "{data.quote}"
        </motion.blockquote>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-4" />
        <p className="font-inter text-sm font-semibold text-white">{data.author}</p>
        <p className="font-inter text-xs text-white/40 mt-1">{data.role}</p>
      </div>
    </section>
  );
}

function ContactTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2">{data.title || "Get In Touch"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data.email && <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl"><p className="text-xs text-white/40 uppercase tracking-wider mb-2">Email</p><p className="text-sm text-white/70">{data.email}</p></div>}
          {data.phone && <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl"><p className="text-xs text-white/40 uppercase tracking-wider mb-2">Phone</p><p className="text-sm text-white/70">{data.phone}</p></div>}
          {data.location && <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl"><p className="text-xs text-white/40 uppercase tracking-wider mb-2">Location</p><p className="text-sm text-white/70">{data.location}</p></div>}
        </div>
      </div>
    </section>
  );
}

function TimelineTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2 text-center">{data.title || "My Journey"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-12" />
        <div className="relative pl-8 border-l border-white/10 space-y-10">
          {(data.items || []).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
              <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full bg-primary border-2 border-background" />
              <span className="font-inter text-xs text-primary font-bold tracking-wider">{item.year}</span>
              <h3 className="font-inter font-semibold text-white mt-1">{item.title}</h3>
              <p className="font-inter text-sm text-white/40 mt-1 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2 text-center">{data.title || "Tools I Use"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(data.tools || []).map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4">
              <span className="font-inter text-sm text-white/70 w-28 flex-shrink-0">{tool.name}</span>
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${tool.level}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.3, duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-primary to-pink-500" />
              </div>
              <span className="font-inter text-xs text-white/30 w-8 text-right">{tool.level}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2 text-center">{data.title || "FAQ"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-12" />
        <div className="space-y-4">
          {(data.items || []).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-primary/20 transition-all">
              <h3 className="font-inter font-semibold text-white mb-2">{item.question}</h3>
              <p className="font-inter text-sm text-white/45 leading-relaxed">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-10 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <h2 className="font-inter text-2xl sm:text-3xl font-bold text-white mb-3">{data.headline}</h2>
          <p className="font-inter text-white/40 mb-8 text-sm">{data.subtext}</p>
          <a href={`mailto:${data.buttonEmail}`} className="inline-block px-8 py-3.5 bg-gradient-to-r from-primary to-pink-500 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 transition-all shadow-lg">
            {data.buttonText || "Get In Touch"}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function AwardsTemplate({ data }) {
  return (
    <section className="py-20 px-4 md:px-8 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2 text-center">{data.title || "Awards"}</motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {(data.items || []).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-center hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-xl">🏆</span>
              </div>
              <h3 className="font-inter font-semibold text-white text-sm mb-1">{item.title}</h3>
              <p className="font-inter text-xs text-primary/70 mb-1">{item.org}</p>
              <p className="font-inter text-xs text-white/25">{item.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExtraSections({ sections }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {[...sections].sort((a, b) => (a.order || 0) - (b.order || 0)).map((section) => {
        let data = {};
        try { data = JSON.parse(section.content || "{}"); } catch {}

        switch (section.template) {
          case "skills": return <SkillsTemplate key={section.id} data={data} />;
          case "stats": return <StatsTemplate key={section.id} data={data} />;
          case "services": return <ServicesTemplate key={section.id} data={data} />;
          case "testimonial": return <TestimonialTemplate key={section.id} data={data} />;
          case "contact": return <ContactTemplate key={section.id} data={data} />;
          case "timeline": return <TimelineTemplate key={section.id} data={data} />;
          case "tools": return <ToolsTemplate key={section.id} data={data} />;
          case "faq": return <FaqTemplate key={section.id} data={data} />;
          case "cta": return <CtaTemplate key={section.id} data={data} />;
          case "awards": return <AwardsTemplate key={section.id} data={data} />;
          default: return null;
        }
      })}
    </>
  );
}