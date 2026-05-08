const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import HeroSection from "../components/portfolio/HeroSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import ExperienceSection from "../components/portfolio/ExperienceSection";
import AboutSection from "../components/portfolio/AboutSection";
import ExtraSections from "../components/portfolio/ExtraSections";
import Footer from "../components/portfolio/Footer";
import ChatWidget from "../components/chat/ChatWidget";
import { trackEvent, startHeartbeat } from "@/lib/analytics";
import { useParams } from "react-router-dom";

export default function Home() {
  const { projectId } = useParams();
  const initialProjectId = projectId || null;
  const [extraSections, setExtraSections] = useState([]);

  useEffect(() => {
    db.entities.ExtraSection.list("order", 50).then(setExtraSections);
    trackEvent("page_view");
    const stopHeartbeat = startHeartbeat();
    return stopHeartbeat;
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter">
      <HeroSection />
      <ProjectsSection initialProjectId={initialProjectId} />
      <ExperienceSection />
      <ExtraSections sections={extraSections} />
      <AboutSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}