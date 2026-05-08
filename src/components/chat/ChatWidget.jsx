const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown } from "lucide-react";

import { getSessionId, trackEvent } from "@/lib/analytics";

const WELCOME = "Hi there! 👋 I'm Aldrin's AI assistant. Feel free to ask me anything about Aldrin's work, projects, or experience — or leave a message and Aldrin will get back to you!";

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
        <Bot size={12} className="text-white" />
      </div>
      <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visitorName, setVisitorName] = useState("");
  const [nameStep, setNameStep] = useState(true);
  const bottomRef = useRef(null);
  const sessionId = getSessionId();

  useEffect(() => {
    // Load existing messages for this session
    db.entities.ChatMessage.filter({ sessionId }, "created_date", 50).then(msgs => {
      if (msgs.length > 0) {
        setMessages(msgs);
        setNameStep(false);
        const visitor = msgs.find(m => m.visitorName);
        if (visitor) setVisitorName(visitor.visitorName || "");
      } else {
        setMessages([{ id: "welcome", sender: "bot", message: WELCOME, created_date: new Date().toISOString() }]);
      }
    });
    
    // Subscribe to new messages (admin replies)
    const unsub = db.entities.ChatMessage.subscribe((event) => {
      if (event.data?.sessionId === sessionId && event.type === "create") {
        if (event.data.sender === "admin") {
          setMessages(prev => {
            if (prev.find(m => m.id === event.id)) return prev;
            return [...prev, event.data];
          });
          if (!open) setUnread(u => u + 1);
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  async function handleOpen() {
    setOpen(true);
    trackEvent("chat_open");
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    if (nameStep) {
      setVisitorName(text);
      setNameStep(false);
      const nameMsg = { id: `local_${Date.now()}`, sender: "visitor", message: text, visitorName: text, sessionId, created_date: new Date().toISOString() };
      setMessages(prev => [...prev, nameMsg]);
      await db.entities.ChatMessage.create({ sessionId, message: text, sender: "visitor", visitorName: text });
      
      setLoading(true);
      const botReply = { id: `bot_${Date.now()}`, sender: "bot", message: `Nice to meet you, ${text}! 😊 What would you like to know about Aldrin's work or portfolio?`, created_date: new Date().toISOString() };
      setTimeout(() => {
        setMessages(prev => [...prev, botReply]);
        setLoading(false);
      }, 1000);
      return;
    }

    const userMsg = { id: `local_${Date.now()}`, sender: "visitor", message: text, visitorName, sessionId, created_date: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    await db.entities.ChatMessage.create({ sessionId, message: text, sender: "visitor", visitorName });

    // Send email notification to admin (await settings first for reliability)
    const sendEmailNotification = async () => {
      const settings = await db.entities.AdminSettings.list();
      const adminEmail = settings[0]?.notificationEmail;
      if (adminEmail) {
        await db.integrations.Core.SendEmail({
          to: adminEmail,
          subject: `💬 New message from ${visitorName || "a visitor"} on your portfolio`,
          body: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Inter',Arial,sans-serif;"><div style="max-width:560px;margin:40px auto;background:linear-gradient(135deg,#13131a,#1a1a2e);border:1px solid rgba(139,92,246,0.2);border-radius:20px;overflow:hidden;"><div style="padding:28px 32px 20px;background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1));"><div style="width:44px;height:44px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;"><span style="font-size:20px;">💬</span></div><h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 4px;">New Message Received</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Someone just messaged you on your portfolio</p></div><div style="padding:24px 32px 32px;"><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;margin-bottom:20px;"><p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px;">From</p><p style="color:#ffffff;font-size:15px;font-weight:600;margin:0;">${visitorName || "Anonymous Visitor"}</p></div><div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.15);border-radius:12px;padding:16px;margin-bottom:24px;"><p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Message</p><p style="color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;margin:0;">${text}</p></div><a href="${window.location.origin}/admin" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:10px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;">Reply in Admin Portal →</a><p style="color:rgba(255,255,255,0.2);font-size:11px;margin-top:24px;text-align:center;">© 2025 Aldrin Eyana Portfolio</p></div></div></body></html>`,
        });
      }
    };
    sendEmailNotification().catch(() => {});

    // Check if admin has already replied in this session — if so, skip AI
    const hasAdminReplied = messages.some(m => m.sender === "admin");
    if (hasAdminReplied) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const history = messages.filter(m => m.id !== "welcome").slice(-6).map(m => `${m.sender === "visitor" ? "User" : "Assistant"}: ${m.message}`).join("\n");
    const response = await db.integrations.Core.InvokeLLM({
      prompt: `You are a helpful AI assistant for Aldrin Eyana's portfolio website. You help visitors learn about Aldrin's work as a UI/UX and Product Designer.

Aldrin's background:
- UI/UX & Product Designer with experience in web and mobile design
- Has worked at: Mak Business Solution (Website Designer, 2024-Present), Ocaye Ltd. (Product Designer, 2024), Author School Norway (UI/UX Designer, 2023), Megapower UK (Web Designer, 2023), Prospect Digital (Web Designer, 2023)
- Key projects: OrderCake App, Service Booking App, E-commerce Portal, Analytics Dashboard, Fitness Tracker, Dental Clinic Website, Educational Platform (1000+ users in 1.5 months), Restaurant Website
- Skills: Figma, UI/UX Design, Product Design, Web Design, Mobile App Design, Design Systems, Wireframing

If visitor wants to leave a message or speak with Aldrin directly, acknowledge it warmly and let them know Aldrin will respond to their chat. Keep replies concise, friendly, and helpful.

Recent conversation:
${history}

Visitor (${visitorName || "Guest"}): ${text}

Reply:`,
    });
    const botReply = { id: `bot_${Date.now()}`, sender: "bot", message: typeof response === "string" ? response : response?.response || "Thanks for your message! Aldrin will get back to you soon.", created_date: new Date().toISOString() };
    setMessages(prev => [...prev, botReply]);
    await db.entities.ChatMessage.create({ sessionId, message: botReply.message, sender: "bot", visitorName });
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[340px] sm:w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "rgba(10,10,15,0.97)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 border-b border-white/[0.07]" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))" }}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-sm font-semibold text-white">Chat with Aldrin</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="font-inter text-xs text-white/40">AI assistant · usually replies fast</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
              {nameStep && messages.length === 1 && (
                <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-xs text-primary/80 font-inter">👋 First, what's your name?</p>
                </div>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/[0.07]">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={nameStep ? "Enter your name..." : "Type a message..."}
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/90 font-inter placeholder-white/25 focus:outline-none focus:border-primary/40 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-all disabled:opacity-30 flex-shrink-0"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
              <p className="text-center text-[10px] text-white/15 font-inter mt-2">Powered by AI · Aldrin will also see your messages</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={open ? () => setOpen(false) : handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-2xl text-white relative"
        style={{ boxShadow: "0 8px 32px rgba(139,92,246,0.4)" }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><ChevronDown size={24} /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle size={24} /></motion.div>
          }
        </AnimatePresence>
        {unread > 0 && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{unread}</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isVisitor = msg.sender === "visitor";
  const isBot = msg.sender === "bot";
  const isAdmin = msg.sender === "admin";

  if (isVisitor) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[75%] bg-gradient-to-br from-primary/30 to-pink-500/20 border border-primary/20 rounded-2xl rounded-br-sm px-4 py-2.5">
          <p className="text-sm text-white/90 font-inter leading-relaxed">{msg.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-primary to-pink-500"}`}>
        {isAdmin ? <User size={11} className="text-white" /> : <Bot size={11} className="text-white" />}
      </div>
      <div className="max-w-[75%]">
        {isAdmin && <p className="text-[10px] text-amber-400/70 font-inter mb-1 ml-1">Aldrin</p>}
        <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-2.5">
          <p className="text-sm text-white/85 font-inter leading-relaxed">{msg.message}</p>
        </div>
      </div>
    </div>
  );
}