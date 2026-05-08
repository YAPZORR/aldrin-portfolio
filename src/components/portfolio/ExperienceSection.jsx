const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import ExperienceCard from "./ExperienceCard";

const DEFAULT_EXPERIENCES = [
  { id: "e1", title: "Website Designer", date: "June 2024 - Present", company: "Mak Business Solution", type: "Part-time", mode: "Remote", description: "As a dedicated website designer specializing in the dental and restaurant industries, I create visually appealing and user-friendly websites tailored to meet the unique needs of these sectors.", order: 1 },
  { id: "e2", title: "Product Designer", date: "January 2024 - August", company: "Ocaye Ltd.", type: "Fulltime", mode: "Remote", description: "Formulated and executed comprehensive strategic plans encompassing both web and app development. Demonstrated effective collaboration as a liaison between management and developers.", order: 2 },
  { id: "e3", title: "Web Designer", date: "April 2023 - July 2023", company: "Megapower UK", type: "Contract", mode: "Remote", description: "Revamped the entire company website using Figma, Photoshop, and online design tools to enhance its aesthetic appeal, functionality, and user experience.", order: 3 },
  { id: "e4", title: "UI/UX Web Designer", date: "July 2023 - October 2023", company: "Author School (Norway)", type: "Part-time", mode: "Remote", description: "Led a significant overhaul of the entire system's user experience, including a redesign of the 66-page user portal. Achieved a rapid increase to over 1,000 users in just 1.5 months.", order: 4 },
  { id: "e5", title: "Web Designer", date: "October 2023 - December 2023", company: "Prospect Digital", type: "Part-time", mode: "Remote", description: "Collaborated closely with clients, actively contributing to web design projects. Crafted visually stunning websites tailored to the unique preferences of each client.", order: 5 },
];

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    db.entities.Experience.list("order", 50).then(data => {
      setExperiences(data.length > 0 ? data : DEFAULT_EXPERIENCES);
    });
  }, []);

  const sorted = [...experiences].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="experience" className="py-16 sm:py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="font-inter text-sm font-medium tracking-widest uppercase text-white/40 mb-2">
          Work Experiences
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="w-12 h-[2px] bg-primary mb-12" />
        <div className="relative">
          {sorted.map((exp, i) => (
            <ExperienceCard key={exp.id || i} {...exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}