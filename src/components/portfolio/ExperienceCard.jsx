import { motion } from "framer-motion";

export default function ExperienceCard({ title, date, company, type, mode, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative pl-8 pb-12 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-[1px] bg-white/10 group-last:hidden" />
      {/* Timeline dot */}
      <div className="absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full bg-primary border-2 border-background" />

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
        <h3 className="font-inter font-semibold text-white text-lg mb-1">{title}</h3>
        <p className="text-primary font-inter text-sm font-medium mb-3">{date} | {company}</p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-inter text-white/50 px-3 py-1 bg-white/[0.05] rounded-full">{type}</span>
          <span className="text-xs font-inter text-white/50 px-3 py-1 bg-white/[0.05] rounded-full">{mode}</span>
        </div>
        <p className="font-inter text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}