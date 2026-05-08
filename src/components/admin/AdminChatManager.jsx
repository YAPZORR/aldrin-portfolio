const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, MessageCircle, Circle, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminChatManager() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadSessions();
    const unsub = db.entities.ChatMessage.subscribe((event) => {
      if (event.type === "create" && event.data.sender === "visitor") {
        loadSessions();
        if (event.data.sessionId === selectedSession) {
          setMessages(prev => {
            if (prev.find(m => m.id === event.id)) return prev;
            return [...prev, event.data];
          });
        }
      }
    });
    return unsub;
  }, [selectedSession]);

  async function loadSessions() {
    const all = await db.entities.ChatMessage.list("-created_date", 200);
    const sessionMap = {};
    all.forEach(msg => {
      if (!sessionMap[msg.sessionId]) {
        sessionMap[msg.sessionId] = { sessionId: msg.sessionId, visitorName: msg.visitorName || "Anonymous", messages: [], unread: 0, lastMessage: msg.message, lastTime: msg.created_date };
      }
      sessionMap[msg.sessionId].messages.push(msg);
      if (new Date(msg.created_date) > new Date(sessionMap[msg.sessionId].lastTime)) {
        sessionMap[msg.sessionId].lastTime = msg.created_date;
        sessionMap[msg.sessionId].lastMessage = msg.message;
      }
      if (msg.sender === "visitor" && !msg.isRead) {
        sessionMap[msg.sessionId].unread++;
      }
    });
    const sorted = Object.values(sessionMap).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
    setSessions(sorted);
  }

  async function openSession(sessionId) {
    setSelectedSession(sessionId);
    const msgs = await db.entities.ChatMessage.filter({ sessionId }, "created_date", 100);
    setMessages(msgs);
    // Mark as read
    const unread = msgs.filter(m => m.sender === "visitor" && !m.isRead);
    await Promise.all(unread.map(m => db.entities.ChatMessage.update(m.id, { isRead: true })));
    loadSessions();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply() {
    if (!replyText.trim() || !selectedSession || sending) return;
    const text = replyText.trim();
    setReplyText("");
    setSending(true);
    await db.entities.ChatMessage.create({ sessionId: selectedSession, message: text, sender: "admin", isRead: true });
    setMessages(prev => [...prev, { id: `adm_${Date.now()}`, sessionId: selectedSession, message: text, sender: "admin", created_date: new Date().toISOString() }]);
    loadSessions();
    setSending(false);
  }

  async function deleteSession(sessionId, e) {
    e.stopPropagation();
    const msgs = await db.entities.ChatMessage.filter({ sessionId });
    await Promise.all(msgs.map(m => db.entities.ChatMessage.delete(m.id)));
    if (selectedSession === sessionId) { setSelectedSession(null); setMessages([]); }
    loadSessions();
  }

  const session = sessions.find(s => s.sessionId === selectedSession);

  return (
    <div className="flex gap-4 h-[calc(100vh-180px)] min-h-[500px]">
      {/* Sessions List */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={14} className="text-primary" />
          <h3 className="font-inter text-sm font-semibold text-white/60 uppercase tracking-wider">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sessions.length === 0 && (
            <div className="p-4 text-center">
              <MessageCircle size={28} className="text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/20 font-inter">No conversations yet</p>
            </div>
          )}
          {sessions.map(s => (
            <button key={s.sessionId} onClick={() => openSession(s.sessionId)}
              className={`w-full text-left p-3 rounded-xl border transition-all group ${selectedSession === s.sessionId ? "bg-primary/15 border-primary/25" : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-pink-500/30 flex items-center justify-center">
                    <User size={11} className="text-white/70" />
                  </div>
                  <span className="font-inter text-xs font-medium text-white/80 truncate max-w-[90px]">{s.visitorName || "Guest"}</span>
                </div>
                <div className="flex items-center gap-1">
                  {s.unread > 0 && <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">{s.unread}</span>}
                  <button onClick={(e) => deleteSession(s.sessionId, e)} className="opacity-0 group-hover:opacity-100 p-0.5 text-white/20 hover:text-red-400 transition-all"><Trash2 size={11} /></button>
                </div>
              </div>
              <p className="font-inter text-[10px] text-white/30 truncate">{s.lastMessage}</p>
              <p className="font-inter text-[9px] text-white/15 mt-0.5">{format(new Date(s.lastTime), "MMM d, h:mm a")}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        {!selectedSession ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center">
              <MessageCircle size={22} className="text-white/20" />
            </div>
            <p className="font-inter text-sm text-white/25">Select a conversation to view</p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-pink-500/30 flex items-center justify-center">
                <User size={14} className="text-white/70" />
              </div>
              <div>
                <p className="font-inter text-sm font-semibold text-white">{session?.visitorName || "Guest"}</p>
                <p className="font-inter text-xs text-white/30">{session?.messages?.length || 0} messages</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {messages.map(msg => {
                const isVisitor = msg.sender === "visitor";
                const isAdmin = msg.sender === "admin";
                return (
                  <div key={msg.id} className={`flex ${isVisitor ? "justify-start" : "justify-end"} mb-3`}>
                    {isVisitor && (
                      <div className="flex items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <User size={11} className="text-white/50" />
                        </div>
                        <div className="max-w-[70%]">
                          <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-2.5">
                            <p className="text-sm text-white/85 font-inter leading-relaxed">{msg.message}</p>
                          </div>
                          <p className="text-[9px] text-white/15 font-inter mt-1 ml-1">{format(new Date(msg.created_date), "h:mm a")}</p>
                        </div>
                      </div>
                    )}
                    {!isVisitor && (
                      <div className="flex items-end gap-2">
                        <div className="max-w-[70%] text-right">
                          <p className="text-[10px] text-white/25 font-inter mb-1 mr-1">{isAdmin ? "You" : "Bot"}</p>
                          <div className={`rounded-2xl rounded-br-sm px-4 py-2.5 ${isAdmin ? "bg-gradient-to-br from-primary/30 to-pink-500/20 border border-primary/20" : "bg-white/[0.04] border border-white/[0.07]"}`}>
                            <p className="text-sm text-white/85 font-inter leading-relaxed">{msg.message}</p>
                          </div>
                          <p className="text-[9px] text-white/15 font-inter mt-1 mr-1">{format(new Date(msg.created_date), "h:mm a")}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-primary to-pink-500"}`}>
                          {isAdmin ? <User size={11} className="text-white" /> : <Bot size={11} className="text-white" />}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-white/[0.07]">
              <div className="flex items-center gap-2">
                <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply()}
                  placeholder="Reply as Aldrin..." className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/90 font-inter placeholder-white/25 focus:outline-none focus:border-primary/40 transition-all" />
                <button onClick={sendReply} disabled={!replyText.trim() || sending} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-all disabled:opacity-30 flex-shrink-0">
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}