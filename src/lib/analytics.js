const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


// Use localStorage so the same visitor keeps the same session across reloads/tabs
export function getSessionId() {
  let sid = localStorage.getItem("portfolio_session_id");
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("portfolio_session_id", sid);
  }
  return sid;
}

let _pageViewId = null; // remember the created page_view record id for heartbeat updates

export async function trackEvent(eventType, meta = "") {
  const sessionId = getSessionId();
  try {
    const record = await db.entities.VisitorEvent.create({
      sessionId,
      eventType,
      meta,
      userAgent: navigator.userAgent.slice(0, 200),
      lastSeen: new Date().toISOString(),
    });
    if (eventType === "page_view" && record?.id) {
      _pageViewId = record.id;
    }
  } catch (e) {
    // silent fail
  }
}

// Heartbeat: every 30s update lastSeen on the page_view record so dashboard knows visitor is active
export function startHeartbeat() {
  const ping = async () => {
    if (!_pageViewId) return;
    try {
      await db.entities.VisitorEvent.update(_pageViewId, { lastSeen: new Date().toISOString() });
    } catch (e) {}
  };

  ping(); // immediate first ping
  const interval = setInterval(ping, 30000);

  return () => clearInterval(interval);
}