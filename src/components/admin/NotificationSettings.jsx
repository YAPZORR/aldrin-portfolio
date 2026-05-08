const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Mail, Save, Check, Bell, BellOff, TestTube, Loader2 } from "lucide-react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState(null);
  const [settingsId, setSettingsId] = useState(null);
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [welcome, setWelcome] = useState("Hi there! I'm Aldrin's AI assistant. Ask me anything about Aldrin's work!");
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    db.entities.AdminSettings.list().then(data => {
      if (data.length > 0) {
        const s = data[0];
        setSettingsId(s.id);
        setEmail(s.notificationEmail || "");
        setEnabled(s.chatBotEnabled !== false);
        setWelcome(s.chatWelcomeMessage || welcome);
      }
    });
  }, []);

  async function handleSave() {
    const data = { notificationEmail: email, chatBotEnabled: enabled, chatWelcomeMessage: welcome };
    if (settingsId) {
      await db.entities.AdminSettings.update(settingsId, data);
    } else {
      const r = await db.entities.AdminSettings.create(data);
      setSettingsId(r.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function sendTestEmail() {
    if (!email) return;
    setTesting(true);
    try {
      await db.integrations.Core.SendEmail({
        to: email,
        subject: "✅ Test — Portfolio Chat Notifications Active",
        body: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:linear-gradient(135deg,#13131a,#1a1a2e);border:1px solid rgba(139,92,246,0.2);border-radius:20px;overflow:hidden;">
    <div style="padding:32px 32px 20px;background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1));">
      <div style="width:48px;height:48px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:22px;">✅</span>
      </div>
      <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 6px;">Notifications are Active!</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">Your portfolio chat notification system is set up correctly.</p>
    </div>
    <div style="padding:24px 32px 32px;">
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;">You'll receive an email like this whenever a visitor sends you a new message through the chat on your portfolio.</p>
      <div style="margin-top:24px;padding:16px;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.15);border-radius:12px;">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Notification Email</p>
        <p style="color:#8b5cf6;font-size:14px;font-weight:600;margin:0;">${email}</p>
      </div>
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:24px;text-align:center;">© 2025 Aldrin Eyana Portfolio</p>
    </div>
  </div>
</body>
</html>`,
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (e) { }
    setTesting(false);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="font-inter text-lg font-bold text-white mb-1">Notification Settings</h2>
        <p className="font-inter text-sm text-white/30">Configure chat notifications and bot behavior</p>
      </div>

      {/* Email */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Mail size={15} className="text-primary" />
          <h3 className="font-inter text-sm font-semibold text-white">Email Notifications</h3>
        </div>
        <div>
          <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1.5">Your Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 placeholder-white/20 transition-all" />
          <p className="font-inter text-xs text-white/25 mt-1.5">You'll receive an email alert when a visitor sends a new message</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={sendTestEmail} disabled={!email || testing}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white/60 text-xs font-inter hover:bg-white/10 transition-all disabled:opacity-40">
            {testing ? <Loader2 size={13} className="animate-spin" /> : testSent ? <Check size={13} className="text-emerald-400" /> : <TestTube size={13} />}
            {testSent ? "Test email sent!" : "Send Test Email"}
          </button>
        </div>
      </div>

      {/* Chatbot toggle */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={15} className="text-amber-400" />
          <h3 className="font-inter text-sm font-semibold text-white">Chatbot Settings</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-inter text-sm text-white/70">AI Chatbot Enabled</p>
            <p className="font-inter text-xs text-white/30">Auto-replies using AI when you're unavailable</p>
          </div>
          <button onClick={() => setEnabled(!enabled)} className={`w-12 h-6 rounded-full transition-all relative ${enabled ? "bg-primary" : "bg-white/10"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? "right-1" : "left-1"}`} />
          </button>
        </div>
        <div>
          <label className="block font-inter text-xs text-white/40 uppercase tracking-wider mb-1.5">Welcome Message</label>
          <textarea value={welcome} onChange={e => setWelcome(e.target.value)} rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm font-inter focus:outline-none focus:border-primary/50 placeholder-white/20 resize-none transition-all" />
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-500/80 rounded-xl text-white font-inter font-semibold text-sm hover:opacity-90 transition-all">
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>
    </div>
  );
}