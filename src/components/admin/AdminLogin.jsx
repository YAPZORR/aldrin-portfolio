import { useState } from "react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      localStorage.setItem("portfolioAdmin", "true");
      onLogin();
    } else {
      setError("Invalid credentials. Try admin / admin");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-pink-500/15 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[40%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Liquid glass card */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/60 to-pink-500/60 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="font-inter text-xl font-bold text-white">Admin Portal</h1>
            <p className="font-inter text-xs text-white/40 mt-1">Portfolio Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1.5">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-inter placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-inter text-xs text-white/50 uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-9 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-inter placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-inter text-center">
                {error}
              </motion.p>
            )}

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary via-pink-500/80 to-orange-400/80 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-2">
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-white/20 font-inter mt-6">
            Default: admin / admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}