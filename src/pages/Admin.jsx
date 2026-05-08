import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Briefcase, Star, Settings, Plus, LogOut, ArrowLeft, Menu, X, MessageCircle, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLogin from "../components/admin/AdminLogin";
import HeroAboutSettings from "../components/admin/HeroAboutSettings";
import ProjectsManager from "../components/admin/ProjectsManager";
import ExperiencesManager from "../components/admin/ExperiencesManager";
import ExtraSectionsManager from "../components/admin/ExtraSectionsManager";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminChatManager from "../components/admin/AdminChatManager";
import NotificationSettings from "../components/admin/NotificationSettings";
import ProjectEditor from "../components/admin/ProjectEditor";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Portfolio Settings", icon: Settings },
  { id: "projects", label: "Projects", icon: Star },
  { id: "experiences", label: "Experiences", icon: Briefcase },
  { id: "extras", label: "Extra Sections", icon: Plus },
  { id: "chat", label: "Chat & Messages", icon: MessageCircle },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("portfolioAdmin") === "true");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Project editor state
  const [projectView, setProjectView] = useState(null); // null = list, { project, projectCount } = editor

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  function handleLogout() {
    localStorage.removeItem("portfolioAdmin");
    setIsLoggedIn(false);
  }

  return (
    <div className="min-h-screen bg-background font-inter flex">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>

        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col backdrop-blur-2xl bg-white/[0.03] border-r border-white/[0.06] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/60 to-pink-500/60 flex items-center justify-center">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <div>
                <p className="font-inter text-sm font-bold text-white">Admin Portal</p>
                <p className="font-inter text-xs text-white/30">Portfolio Manager</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setProjectView(null); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-inter transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/[0.06] space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05] text-sm font-inter transition-all">
              <ArrowLeft size={16} /> View Portfolio
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/5 text-sm font-inter transition-all">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="backdrop-blur-xl bg-white/[0.02] border-b border-white/[0.06] px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-white/50 hover:text-white">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-inter text-lg font-bold text-white">{TABS.find(t => t.id === activeTab)?.label}</h1>
            <p className="font-inter text-xs text-white/30">Manage your portfolio content</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Ambient blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
          </div>

          <div className={`relative z-10 ${activeTab === "chat" ? "max-w-5xl" : "max-w-3xl"}`}>
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "settings" && <HeroAboutSettings />}
            {activeTab === "projects" && !projectView && (
              <ProjectsManager
                onEdit={(proj) => setProjectView({ project: proj })}
                onAdd={(count) => setProjectView({ project: null, projectCount: count })}
              />
            )}
            {activeTab === "projects" && projectView && (
              <ProjectEditor
                project={projectView.project}
                projectCount={projectView.projectCount || 0}
                onBack={() => setProjectView(null)}
                onSaved={() => setProjectView(null)}
              />
            )}
            {activeTab === "experiences" && <ExperiencesManager />}
            {activeTab === "extras" && <ExtraSectionsManager />}
            {activeTab === "chat" && <AdminChatManager />}
            {activeTab === "notifications" && <NotificationSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}