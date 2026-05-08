const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { Plus, Trash2, Edit2 } from "lucide-react";

export default function ProjectsManager({ onEdit, onAdd }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    db.entities.Project.list("order", 50).then(setProjects);
  }, []);

  async function handleDelete(id) {
    await db.entities.Project.delete(id);
    setProjects(p => p.filter(x => x.id !== id));
  }

  const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">Projects ({projects.length})</h3>
        <button onClick={() => onAdd(projects.length)} className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-primary text-sm font-inter hover:bg-primary/30 transition-all">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((proj) => (
          <div key={proj.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl">
            {proj.mainImage && <img src={proj.mainImage} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm text-white truncate">{proj.title}</p>
              <p className="font-inter text-xs text-white/30">{proj.status} · Order {proj.order}</p>
            </div>
            <button onClick={() => onEdit(proj)} className="p-2 text-white/40 hover:text-white transition-colors"><Edit2 size={15} /></button>
            <button onClick={() => handleDelete(proj.id)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
          </div>
        ))}
        {sorted.length === 0 && <p className="text-sm text-white/20 font-inter py-4 text-center">No projects yet. Add your first one!</p>}
      </div>
    </div>
  );
}