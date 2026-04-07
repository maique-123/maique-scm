import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════ */
const GLOBAL_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f0f2f5;
    color: #1a2332;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  .fade-in { animation: fadeInUp 0.35s ease both; }
  .slide-in { animation: slideIn 0.3s ease both; }
  .shake { animation: shake 0.4s ease; }
  input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
`;

/* ═══════════════════════════════════════════
   USERS & ROLES
   ═══════════════════════════════════════════ */
const ROLES = {
  admin: {
    label: "管理员", color: "#dc2626",
    modules: ["dashboard","hr","operation","planning","design","order","tech","production","material","factory","quality","warehouse","finance","mall","system"],
  },
  designer: {
    label: "设计师", color: "#7c3aed",
    modules: ["dashboard","planning","design","tech"],
  },
  merchandiser: {
    label: "跟单员", color: "#2563eb",
    modules: ["dashboard","order","production","material","factory"],
  },
  quality: {
    label: "品控", color: "#059669",
    modules: ["dashboard","quality","warehouse"],
  },
  finance: {
    label: "财务", color: "#d97706",
    modules: ["dashboard","finance"],
  },
  operation: {
    label: "运营", color: "#0891b2",
    modules: ["dashboard","operation"],
  },
  viewer: {
    label: "访客", color: "#6b7280",
    modules: ["dashboard"],
  },
};

const USERS = [
  { username: "admin",     password: "admin123",  name: "系统管理员", role: "admin" },
  { username: "liuguang",  password: "lg123456",  name: "刘明光",     role: "admin" },
  { username: "designer1", password: "ds123456",  name: "王小设",     role: "designer" },
  { username: "designer2", password: "ds123456",  name: "李美琪",     role: "designer" },
  { username: "merch1",    password: "mc123456",  name: "张跟单",     role: "merchandiser" },
  { username: "merch2",    password: "mc123456",  name: "陈业务",     role: "merchandiser" },
  { username: "qc1",       password: "qc123456",  name: "赵品控",     role: "quality" },
  { username: "finance1",  password: "cw123456",  name: "周财务",     role: "finance" },
  { username: "ops1",      password: "op123456",  name: "运营小李",   role: "operation" },
  { username: "guest",     password: "guest123",  name: "访客",       role: "viewer" },
];

/* ═══════════════════════════════════════════
   MENU
   ═══════════════════════════════════════════ */
const ALL_MENU = [
  { icon: "📊", label: "工作台",   key: "dashboard" },
  { icon: "👥", label: "人事行政", key: "hr",         children: ["员工管理","考勤管理","薪资管理"] },
  { icon: "📣", label: "运营推广", key: "operation",  children: ["Listing编写","广告策略","广告优化"] },
  { icon: "🧭", label: "商品企划", key: "planning",   children: ["季度企划","趋势分析","款式库"] },
  { icon: "✏️",  label: "设计开发", key: "design",     children: ["设计稿管理","样衣管理","面料开发"] },
  { icon: "📋", label: "业务跟单", key: "order",      children: ["订单管理","跟单进度","客户管理"] },
  { icon: "📐", label: "技术版房", key: "tech",       children: ["版型管理","工艺单","尺寸规格"] },
  { icon: "🏭", label: "生产汇总", key: "production", children: ["生产进度","任务列表","排产计划"] },
  { icon: "🧵", label: "物料采购", key: "material",   children: ["采购计划","供应商管理","入库管理"] },
  { icon: "🔧", label: "工厂管理", key: "factory",    children: ["工厂列表","产能管理","合作记录"] },
  { icon: "✅", label: "品质控制", key: "quality",    children: ["质检标准","验货报告","不良分析"] },
  { icon: "📦", label: "仓库管理", key: "warehouse",  children: ["库存管理","出入库记录","盘点管理"] },
  { icon: "💰", label: "财务会计", key: "finance",    children: ["应收管理","应付管理","费用管理"] },
  { icon: "🛒", label: "商城系统", key: "mall",       children: ["商品管理","订单管理","营销活动"] },
  { icon: "⚙️",  label: "系统管理", key: "system",     children: ["用户管理","角色权限","系统日志"] },
];

const TABS = ["物料","订单明细","工艺","裁剪","工序进度","车缝","尾部"];

const MOCK_ORDERS = [
  { id:1, date:"2026-01-11", code:"20250109003",   styleNo:"test260109BB", qty:600,  factory:"广州商派供应链", color:"白色", status:"overdue",    days:76, progress:45 },
  { id:2, date:"2026-03-18", code:"20260311014",    styleNo:"htest01",      qty:20,   factory:"广州爱云纺服装", color:"米白", status:"overdue",    days:10, progress:72 },
  { id:3, date:"2026-03-18", code:"20260311014",    styleNo:"htest01",      qty:100,  factory:"广州爱云纺服装", color:"黑色", status:"overdue",    days:10, progress:30 },
  { id:4, date:"2026-03-10", code:"20260309",       styleNo:"26010",        qty:110,  factory:"佛山锦绣制衣",   color:"蓝色", status:"overdue",    days:18, progress:60 },
  { id:5, date:"2026-01-22", code:"20260122010",    styleNo:"test260109BB", qty:600,  factory:"广州商派供应链", color:"卡其", status:"overdue",    days:5,  progress:88 },
  { id:6, date:"2026-06-30", code:"20260324015",    styleNo:"OY-19Z7MJM",  qty:73,   factory:"广州商派供应链", color:"BK/RD",status:"notStarted", days:94, progress:0 },
  { id:7, date:"2026-01-23", code:"20250122009",    styleNo:"test260109BB", qty:40,   factory:"广州爱云纺服装", color:"白色", status:"overdue",    days:64, progress:55 },
  { id:8, date:"2026-01-23", code:"20260122010",    styleNo:"test260109BB", qty:1100, factory:"东莞名仕达制衣", color:"黑色", status:"overdue",    days:5,  progress:92 },
  { id:9, date:"2026-04-04", code:"ZD20260326003",  styleNo:"TEST01",       qty:600,  factory:"广州爱云纺",     color:"大白", status:"inProgress", days:7,  progress:35 },
];

const GARMENT_COLORS = ["#fef3c7","#dbeafe","#fce7f3","#d1fae5","#ede9fe","#fef9c3","#cffafe","#fae8ff","#e0e7ff"];
const GARMENT_EMOJI  = ["👗","👚","👕","🧥","👔","👘","🥼","👖","🧣"];

/* ═══════════════════════════════════════════
   AMAZON LISTING CONSTANTS
   ═══════════════════════════════════════════ */
const SITES = [
  { code: "US", flag: "🇺🇸", label: "美国站", lang: "English" },
  { code: "UK", flag: "🇬🇧", label: "英国站", lang: "British English" },
  { code: "DE", flag: "🇩🇪", label: "德国站", lang: "German" },
  { code: "FR", flag: "🇫🇷", label: "法国站", lang: "French" },
  { code: "JP", flag: "🇯🇵", label: "日本站", lang: "Japanese" },
  { code: "CA", flag: "🇨🇦", label: "加拿大站", lang: "English" },
];

const AMAZON_LIMITS = {
  title: 200,
  titleIdeal: 150,
  bullet: 250,
  bulletIdeal: 200,
  description: 2000,
  searchTerms: 250,
};

// 违禁词库（来自参考代码，精简版）
const PROHIBITED_HARD = [
  "cure","treat","heal","prevent disease","anti-bacterial","kills germs","kills bacteria",
  "antibacterial","antimicrobial","FDA approved","clinically proven","doctor recommended",
  "medical grade","therapeutic","best","#1","top","most","only","perfect","guaranteed",
  "100%","miracle","magic","revolutionary","unbreakable","flawless","risk-free",
  "patented","trademarked","better than","superior to",
];
const PROHIBITED_SOFT = [
  "waterproof","fireproof","military-grade","hospital-grade","eco-friendly","biodegradable",
  "BPA-free","lead-free","non-toxic","hypoallergenic","free","bonus","discount","sale",
  "deal","limited time","clearance","cheap","best seller","top rated","award-winning",
  "as seen on TV","#1 selling","most popular","trending","viral",
];

const REPLACEMENTS = {
  cure: "support, help with",
  best: "premium, superior",
  "#1": "top-rated",
  guaranteed: "designed to",
  "100%": "fully",
  perfect: "ideal, well-suited",
  waterproof: "water-resistant (IPX rating needed)",
  "eco-friendly": "made with sustainable materials",
  cheap: "affordable, budget-friendly",
  free: "included",
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function getMenuForRole(role) {
  const allowed = ROLES[role]?.modules || [];
  return ALL_MENU.filter(item => allowed.includes(item.key));
}
function hasAccess(role, key) {
  return ROLES[role]?.modules?.includes(key) || false;
}

function checkCompliance(text, brand = "") {
  const results = { hard: [], soft: [], info: [] };
  if (!text) return results;
  const lower = text.toLowerCase();
  PROHIBITED_HARD.forEach(w => {
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"gi");
    const m = lower.match(re);
    if (m) results.hard.push({ word: w, count: m.length, fix: REPLACEMENTS[w.toLowerCase()] || "建议手动替换" });
  });
  PROHIBITED_SOFT.forEach(w => {
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"gi");
    const m = lower.match(re);
    if (m) results.soft.push({ word: w, count: m.length, fix: REPLACEMENTS[w.toLowerCase()] || "需提供认证或替换" });
  });
  if (brand && brand.trim() && !lower.includes(brand.trim().toLowerCase())) {
    results.info.push({ msg: `Listing 中未包含品牌名 "${brand}"`, severity: "warn" });
  }
  return results;
}

// 解析AI生成的Listing文本到各板块
function parseListingSections(text) {
  if (!text) return null;
  const sections = { title: "", bullets: ["","","","",""], description: "", searchTerms: "" };
  
  // Title
  const titleMatch = text.match(/(?:^|\n)\s*(?:title|标题|product title)[:：\s]*\n?(.+?)(?=\n\s*(?:bullet|key features|product description|description|search terms|$))/is);
  if (titleMatch) sections.title = titleMatch[1].trim().split("\n")[0].trim();
  
  // Bullets
  const bulletSection = text.match(/(?:bullet points?|key features?|五点描述)[:：\s]*\n([\s\S]*?)(?=\n\s*(?:product description|description|search terms|$))/i);
  if (bulletSection) {
    const lines = bulletSection[1].split("\n").map(l => l.replace(/^[\s\-•*\d.)】】]+/, "").trim()).filter(l => l.length > 5);
    lines.slice(0, 5).forEach((l, i) => { sections.bullets[i] = l; });
  }
  
  // Description
  const descMatch = text.match(/(?:product description|description|产品描述)[:：\s]*\n([\s\S]*?)(?=\n\s*(?:search terms|backend keywords|$))/i);
  if (descMatch) sections.description = descMatch[1].trim();
  
  // Search Terms
  const stMatch = text.match(/(?:search terms|backend keywords|后台关键词)[:：\s]*\n?(.+?)$/is);
  if (stMatch) sections.searchTerms = stMatch[1].trim().split("\n")[0].trim();
  
  return sections;
}

/* ═══════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [shaking, setShaking]   = useState(false);

  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 500); };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) { setError("请输入用户名和密码"); shake(); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      const u = USERS.find(u => u.username === username.trim() && u.password === password);
      if (u) { onLogin(u); } else { setError("用户名或密码错误"); setLoading(false); shake(); }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute", inset:0, opacity:0.06, backgroundImage:"radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)", backgroundSize:"50px 50px" }}/>
      <div style={{ position:"absolute", top:-120, right:-120, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)" }}/>
      <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)" }}/>

      <div className={`fade-in ${shaking?"shake":""}`} style={{
        width:420, background:"rgba(255,255,255,0.03)", backdropFilter:"blur(20px)",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:16,
        padding:"48px 40px", position:"relative", zIndex:1,
      }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:56, height:56, borderRadius:14, background:"linear-gradient(135deg, #3b82f6, #6366f1)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:24, color:"#fff", fontWeight:800, marginBottom:16, boxShadow:"0 8px 24px rgba(59,130,246,0.3)" }}>M</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#f1f5f9", letterSpacing:2 }}>麦趣时尚</h1>
          <p style={{ fontSize:13, color:"#64748b", marginTop:6, letterSpacing:1 }}>供应链管理系统</p>
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={{ fontSize:12, color:"#94a3b8", marginBottom:6, display:"block", fontWeight:500 }}>用户名</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="请输入用户名" style={{ width:"100%", height:44, borderRadius:8, border:error?"1px solid #ef4444":"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", padding:"0 14px", fontSize:14, color:"#e2e8f0" }}/>
        </div>
        <div style={{ marginBottom:8 }}>
          <label style={{ fontSize:12, color:"#94a3b8", marginBottom:6, display:"block", fontWeight:500 }}>密码</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="请输入密码" style={{ width:"100%", height:44, borderRadius:8, border:error?"1px solid #ef4444":"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", padding:"0 14px", fontSize:14, color:"#e2e8f0" }}/>
        </div>

        {error && <p style={{ color:"#f87171", fontSize:13, margin:"8px 0" }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={{
          width:"100%", height:46, borderRadius:8, marginTop:16, border:"none",
          background: loading ? "#475569" : "linear-gradient(135deg, #3b82f6, #6366f1)",
          color:"#fff", fontSize:15, fontWeight:600, cursor:loading?"wait":"pointer",
          letterSpacing:1, boxShadow:"0 4px 16px rgba(59,130,246,0.3)", transition:"all 0.2s",
        }}>{loading ? "登录中..." : "登 录"}</button>

        <p style={{ textAlign:"center", fontSize:11, color:"#475569", marginTop:24 }}>maique.top · 内部系统 · 仅限授权人员访问</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════ */
function Sidebar({ activeMenu, setActiveMenu, expandedKey, setExpandedKey, collapsed, setCollapsed, user, opSubKey, setOpSubKey }) {
  const menu = getMenuForRole(user.role);
  return (
    <div style={{
      width: collapsed ? 64 : 228, minHeight:"100vh", background:"#fff",
      borderRight:"1px solid #e2e8f0", display:"flex", flexDirection:"column",
      transition:"width 0.25s cubic-bezier(.4,0,.2,1)", flexShrink:0, zIndex:10,
    }}>
      <div style={{ padding:collapsed?"20px 0":"20px 22px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:10, justifyContent:collapsed?"center":"flex-start", cursor:"pointer" }}
        onClick={()=>setCollapsed(!collapsed)}>
        <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg, #3b82f6, #6366f1)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:15, fontWeight:800, flexShrink:0 }}>M</div>
        {!collapsed && <div>
          <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", letterSpacing:1, lineHeight:1 }}>麦趣时尚</div>
          <div style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>供应链管理</div>
        </div>}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        {menu.map(item => {
          const isActive = activeMenu === item.key;
          const isExpanded = expandedKey === item.key;
          return (
            <div key={item.key}>
              <div onClick={() => { setActiveMenu(item.key); if(item.children) setExpandedKey(isExpanded?null:item.key); }}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:collapsed?"11px 0":"11px 22px", justifyContent:collapsed?"center":"flex-start",
                  cursor:"pointer", background:isActive?"#eff6ff":"transparent",
                  color:isActive?"#2563eb":"#4b5563", fontWeight:isActive?600:400, fontSize:13.5,
                  borderRight:isActive?"3px solid #2563eb":"3px solid transparent", transition:"all 0.15s",
                }}
                onMouseEnter={e=>{if(!isActive) e.currentTarget.style.background="#f8fafc"}}
                onMouseLeave={e=>{e.currentTarget.style.background=isActive?"#eff6ff":"transparent"}}
              >
                <span style={{ fontSize:16, width:20, textAlign:"center" }}>{item.icon}</span>
                {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
                {!collapsed && item.children && <span style={{ fontSize:10, opacity:0.4, transform:isExpanded?"rotate(90deg)":"none", transition:"transform 0.2s" }}>▶</span>}
              </div>
              {!collapsed && item.children && isExpanded && (
                <div className="slide-in">
                  {item.children.map(child => {
                    const isOpSubActive = item.key === "operation" && opSubKey === child;
                    return (
                      <div key={child}
                        onClick={() => { if(item.key==="operation") setOpSubKey(child); }}
                        style={{
                          padding:"9px 22px 9px 54px", fontSize:13,
                          color: isOpSubActive ? "#2563eb" : "#94a3b8",
                          fontWeight: isOpSubActive ? 600 : 400,
                          background: isOpSubActive ? "#f0f7ff" : "transparent",
                          cursor:"pointer", transition:"all 0.12s",
                        }}
                        onMouseEnter={e=>{if(!isOpSubActive){e.currentTarget.style.color="#2563eb";e.currentTarget.style.background="#f0f7ff"}}}
                        onMouseLeave={e=>{if(!isOpSubActive){e.currentTarget.style.color="#94a3b8";e.currentTarget.style.background="transparent"}}}
                      >{child}</div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!collapsed && (
        <div style={{ padding:"14px 22px", borderTop:"1px solid #f1f5f9", fontSize:12, color:"#94a3b8" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ display:"inline-block", padding:"1px 8px", borderRadius:4, fontSize:11, fontWeight:600, color:"#fff", background:ROLES[user.role]?.color||"#6b7280" }}>{ROLES[user.role]?.label}</span>
            <span>{user.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOP BAR
   ═══════════════════════════════════════════ */
function TopBar({ user, onLogout, activeMenu, opSubKey }) {
  const current = ALL_MENU.find(m=>m.key===activeMenu);
  const ri = ROLES[user.role];
  return (
    <div style={{ height:52, background:"#fff", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
        <span style={{ color:"#94a3b8" }}>工作台</span>
        {current && activeMenu!=="dashboard" && <><span style={{ color:"#cbd5e1" }}>/</span><span style={{ color: activeMenu==="operation" && opSubKey ? "#94a3b8" : "#2563eb", fontWeight:500 }}>{current.label}</span></>}
        {activeMenu==="operation" && opSubKey && <><span style={{ color:"#cbd5e1" }}>/</span><span style={{ color:"#2563eb", fontWeight:500 }}>{opSubKey}</span></>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:18 }}>
        <span style={{ cursor:"pointer", fontSize:16, opacity:0.5 }}>🔔</span>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg, ${ri.color}, ${ri.color}cc)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700 }}>{user.name.charAt(0)}</div>
          <div>
            <div style={{ fontSize:13, color:"#4b5563", lineHeight:1 }}>{user.name}</div>
            <div style={{ fontSize:10, color:ri.color, fontWeight:500 }}>{ri.label}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ border:"1px solid #e2e8f0", background:"#fff", borderRadius:6, padding:"4px 12px", fontSize:12, color:"#94a3b8", cursor:"pointer", transition:"all 0.15s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.color="#ef4444";e.currentTarget.style.borderColor="#fecaca"}}
          onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#94a3b8";e.currentTarget.style.borderColor="#e2e8f0"}}
        >退出</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ─── LISTING BUILDER (核心新功能) ───
   ═══════════════════════════════════════════ */

const LISTING_STEPS = [
  { id: 1, label: "填写产品信息", icon: "📦", color: "#3b82f6" },
  { id: 2, label: "生成AI提示词", icon: "🪄", color: "#8b5cf6" },
  { id: 3, label: "粘贴AI输出", icon: "📝", color: "#06b6d4" },
  { id: 4, label: "合规检查", icon: "✅", color: "#f59e0b" },
  { id: 5, label: "导出 & 历史", icon: "💾", color: "#10b981" },
];

function ListingBuilderPage() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  
  // 产品信息
  const [info, setInfo] = useState({
    projectName: "",
    targetSite: "US",
    brand: "",
    productName: "",
    category: "",
    priceRange: "",
    targetAudience: "",
    dimensions: "",
    colors: "",
    material: "",
    sellingPoints: "",
    diffPoints: "",
    useScenarios: "",
    packageContents: "",
    certifications: "",
    keywords: "",
    competitors: "",
  });
  
  // 生成的提示词
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  
  // AI输出
  const [aiOutput, setAiOutput] = useState("");
  const [parsedListing, setParsedListing] = useState(null);
  
  // 合规检查
  const [compliance, setCompliance] = useState(null);
  
  // 历史记录
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // 加载历史
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maique_listing_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);
  
  const saveHistory = (record) => {
    const newHistory = [record, ...history].slice(0, 50);
    setHistory(newHistory);
    try { localStorage.setItem("maique_listing_history", JSON.stringify(newHistory)); } catch {}
  };
  
  const loadHistory = (record) => {
    setInfo(record.info);
    setGeneratedPrompt(record.prompt || "");
    setAiOutput(record.aiOutput || "");
    setParsedListing(record.parsed || null);
    setCompliance(record.compliance || null);
    setShowHistory(false);
    setStep(5);
    setMaxStep(5);
  };
  
  const deleteHistory = (id) => {
    if (!confirm("确定删除这条历史记录吗？")) return;
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    try { localStorage.setItem("maique_listing_history", JSON.stringify(newHistory)); } catch {}
  };

  // 生成提示词
  const generatePrompt = () => {
    const site = SITES.find(s => s.code === info.targetSite);
    const lang = site?.lang || "English";
    
    const prompt = `你是拥有10年经验的资深亚马逊Listing文案专家，精通A9搜索算法、COSMO算法和Rufus AI推荐机制。请根据以下产品信息，生成一份高质量、符合亚马逊规则的Listing文案。

【目标站点】${site?.flag} ${site?.label} (${site?.code})
【输出语言】${lang}

【产品信息】
品牌名称: ${info.brand || "未填写"}
产品名称: ${info.productName || "未填写"}
产品类目: ${info.category || "未填写"}
价格定位: ${info.priceRange || "未填写"}
目标客户: ${info.targetAudience || "未填写"}
产品尺寸: ${info.dimensions || "未填写"}
颜色选项: ${info.colors || "未填写"}
材质工艺: ${info.material || "未填写"}

【核心卖点】
${info.sellingPoints || "未填写"}

【竞品差异化】
${info.diffPoints || "未填写"}

【使用场景】
${info.useScenarios || "未填写"}

【包装内容】
${info.packageContents || "未填写"}

【认证信息】
${info.certifications || "未填写"}

【核心关键词】
${info.keywords || "未填写"}

${info.competitors ? `【参考竞品ASIN】\n${info.competitors}\n` : ""}

【输出要求】
请严格按照以下格式输出，使用 ${lang} 撰写所有文案部分：

Title:
[产品标题，控制在 ${AMAZON_LIMITS.titleIdeal}-${AMAZON_LIMITS.title} 字符以内，包含品牌名+核心关键词+主要卖点]

Bullet Points:
1. [第一条卖点，250字符以内，开头大写突出核心价值]
2. [第二条卖点]
3. [第三条卖点]
4. [第四条卖点]
5. [第五条卖点]

Product Description:
[产品描述，1500-2000字符，使用段落结构，突出场景化价值]

Search Terms:
[后台关键词，250字节以内，空格分隔，不重复Title已有词]

【重要规则】
1. ❌ 禁用词汇：best, #1, top, guaranteed, 100%, miracle, perfect, FDA approved, cure, treat, anti-bacterial, waterproof（除非有IPX认证）, eco-friendly（除非有认证）, free, sale, discount, limited time, best seller, award-winning 等
2. ✅ 必须自然融入核心关键词，提高搜索曝光
3. ✅ Title 必须包含品牌名和最重要的搜索关键词
4. ✅ Bullet points 必须以大写开头的关键短语开始
5. ✅ Description 使用场景化语言，让用户产生共鸣
6. ✅ Search Terms 不要重复 Title 中的词，挖掘长尾词

请开始生成。`;
    
    setGeneratedPrompt(prompt);
    setStep(2);
    if (maxStep < 2) setMaxStep(2);
  };
  
  // 复制提示词
  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    });
  };
  
  // 解析AI输出
  const parseOutput = () => {
    if (!aiOutput.trim()) {
      alert("请先粘贴AI生成的Listing内容");
      return;
    }
    const parsed = parseListingSections(aiOutput);
    setParsedListing(parsed);
    setStep(4);
    if (maxStep < 4) setMaxStep(4);
  };
  
  // 执行合规检查
  const runCompliance = () => {
    const result = checkCompliance(aiOutput, info.brand);
    setCompliance(result);
    setStep(5);
    if (maxStep < 5) setMaxStep(5);
    
    // 保存到历史
    const record = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("zh-CN"),
      projectName: info.projectName || info.productName || info.brand || "未命名Listing",
      targetSite: info.targetSite,
      info: { ...info },
      prompt: generatedPrompt,
      aiOutput: aiOutput,
      parsed: parsedListing,
      compliance: result,
    };
    saveHistory(record);
  };
  
  // 导出
  const exportListing = () => {
    if (!parsedListing) return;
    const text = `品牌: ${info.brand}\n产品: ${info.productName}\n站点: ${info.targetSite}\n生成时间: ${new Date().toLocaleString("zh-CN")}\n\n========== TITLE ==========\n${parsedListing.title}\n\n========== BULLET POINTS ==========\n${parsedListing.bullets.map((b,i) => `${i+1}. ${b}`).join("\n")}\n\n========== DESCRIPTION ==========\n${parsedListing.description}\n\n========== SEARCH TERMS ==========\n${parsedListing.searchTerms}`;
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Listing_${info.brand || "product"}_${info.targetSite}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // 重置
  const resetAll = () => {
    if (!confirm("确定重新开始吗？当前编辑将丢失（已保存到历史的不受影响）")) return;
    setStep(1);
    setMaxStep(1);
    setInfo({ projectName:"", targetSite:"US", brand:"", productName:"", category:"", priceRange:"", targetAudience:"", dimensions:"", colors:"", material:"", sellingPoints:"", diffPoints:"", useScenarios:"", packageContents:"", certifications:"", keywords:"", competitors:"" });
    setGeneratedPrompt("");
    setAiOutput("");
    setParsedListing(null);
    setCompliance(null);
  };
  
  // 表单字段
  const Field = ({ label, value, onChange, placeholder, multiline, rows = 3, required, hint }) => (
    <div>
      <label style={{ fontSize:12, color:"#475569", fontWeight:600, display:"block", marginBottom:5 }}>
        {label} {required && <span style={{ color:"#ef4444" }}>*</span>}
        {hint && <span style={{ fontSize:11, color:"#94a3b8", marginLeft:6, fontWeight:400 }}>{hint}</span>}
      </label>
      {multiline ? (
        <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
          style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:13, fontFamily:"inherit", resize:"vertical", lineHeight:1.6 }}/>
      ) : (
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{ width:"100%", height:36, padding:"0 12px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:13 }}/>
      )}
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 1200 }}>
      {/* 头部 */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:-0.5 }}>📝 Listing 智能编写</h1>
          <p style={{ fontSize:13, color:"#64748b", marginTop:4 }}>5步完成专业亚马逊Listing文案 — 提示词生成 + AI辅助 + 合规检查</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowHistory(!showHistory)} style={{
            padding:"8px 16px", borderRadius:8, fontSize:12.5, fontWeight:600, cursor:"pointer",
            background: showHistory ? "#2563eb" : "#fff", color: showHistory ? "#fff" : "#475569",
            border: showHistory ? "none" : "1px solid #e2e8f0", transition:"all .15s",
          }}>📋 历史 <span style={{ padding:"1px 7px", borderRadius:10, fontSize:10, fontWeight:700, background: showHistory?"#fff":"#2563eb", color: showHistory?"#2563eb":"#fff", marginLeft:4 }}>{history.length}</span></button>
          <button onClick={resetAll} style={{
            padding:"8px 16px", borderRadius:8, fontSize:12.5, fontWeight:600, cursor:"pointer",
            background:"#fff", color:"#94a3b8", border:"1px solid #e2e8f0",
          }}>↻ 重新开始</button>
        </div>
      </div>

      {/* 历史记录面板 */}
      {showHistory && (
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>历史记录 ({history.length})</div>
          {history.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#94a3b8", fontSize:13 }}>
              暂无历史记录，完成一次Listing生成后会自动保存
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:300, overflowY:"auto" }}>
              {history.map(h => (
                <div key={h.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#f8fafc", borderRadius:8, border:"1px solid #f1f5f9" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{h.projectName}</div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{h.timestamp} · {SITES.find(s=>s.code===h.targetSite)?.flag} {h.targetSite}</div>
                  </div>
                  <button onClick={()=>loadHistory(h)} style={{ padding:"4px 12px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", background:"#eff6ff", color:"#2563eb", border:"1px solid #bfdbfe" }}>查看</button>
                  <button onClick={()=>deleteHistory(h.id)} style={{ padding:"4px 12px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", background:"#fef2f2", color:"#ef4444", border:"1px solid #fecaca" }}>删除</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 步骤进度条 */}
      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:24, background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"6px 8px" }}>
        {LISTING_STEPS.map((s, i) => {
          const active = step === s.id;
          const done = step > s.id;
          const clickable = s.id <= maxStep;
          return (
            <div key={s.id} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <div onClick={()=>{if(clickable) setStep(s.id);}} style={{
                display:"flex", alignItems:"center", gap:8, flex:1,
                padding:"10px 14px", borderRadius:10, cursor: clickable?"pointer":"default",
                background: active ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : done ? "#eff6ff" : "transparent",
                transition:"all .25s ease",
              }}>
                <div style={{
                  width:26, height:26, borderRadius:"50%", flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700,
                  background: done ? "#2563eb" : active ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                  color: done||active ? "#fff" : "#94a3b8",
                }}>{done ? "✓" : s.id}</div>
                <span style={{
                  fontSize:12.5, fontWeight: active?700: done?600:400, whiteSpace:"nowrap",
                  color: active?"#fff" : done?"#2563eb" : "#94a3b8",
                }}>{s.label}</span>
              </div>
              {i < LISTING_STEPS.length-1 && (
                <div style={{ width:16, height:2, background: done?"#93c5fd":"#e2e8f0", flexShrink:0 }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* ───── Step 1: 产品信息 ───── */}
      {step === 1 && (
        <div className="fade-in" style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"24px 28px" }}>
          <div style={{ marginBottom:18 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>📦 填写产品信息</h2>
            <p style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>信息越详细，AI生成的Listing越精准。带 * 为必填项</p>
          </div>

          {/* 站点选择 */}
          <div style={{ padding:"14px 18px", background:"linear-gradient(135deg,#eff6ff,#eef2ff)", borderRadius:10, border:"1px solid #bfdbfe", marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#1e40af", marginBottom:10 }}>🌐 目标站点（决定输出语言）</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {SITES.map(s => (
                <button key={s.code} onClick={()=>setInfo({...info, targetSite:s.code})} style={{
                  padding:"7px 16px", borderRadius:8, fontSize:12.5, fontWeight:600, cursor:"pointer",
                  background: info.targetSite===s.code ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "#fff",
                  color: info.targetSite===s.code ? "#fff" : "#475569",
                  border: info.targetSite===s.code ? "none" : "1px solid #e2e8f0",
                }}>{s.flag} {s.code} <span style={{ fontSize:10, opacity:0.8 }}>({s.lang})</span></button>
              ))}
            </div>
          </div>

          {/* 项目名称 */}
          <div style={{ padding:"14px 18px", background:"linear-gradient(135deg,#ecfdf5,#f0fdf4)", borderRadius:10, border:"1px solid #a7f3d0", marginBottom:16 }}>
            <Field label="📌 项目名称" value={info.projectName} onChange={v=>setInfo({...info,projectName:v})} placeholder="例: 麦趣 春季新款连衣裙 US站" hint="用于历史记录命名"/>
          </div>

          {/* 基本信息 */}
          <div style={{ padding:"16px 18px", background:"#f8fafc", borderRadius:10, border:"1px solid #e2e8f0", marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#334155", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:20, height:20, borderRadius:5, background:"#2563eb", color:"#fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800 }}>1</span> 基本信息
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="品牌名称 Brand" value={info.brand} onChange={v=>setInfo({...info,brand:v})} placeholder="Maique" required/>
              <Field label="产品名称" value={info.productName} onChange={v=>setInfo({...info,productName:v})} placeholder="Spring Floral Midi Dress"/>
              <Field label="产品类目" value={info.category} onChange={v=>setInfo({...info,category:v})} placeholder="Women's Clothing > Dresses"/>
              <Field label="价格定位" value={info.priceRange} onChange={v=>setInfo({...info,priceRange:v})} placeholder="$29.99 / 中端定位"/>
              <Field label="目标客户" value={info.targetAudience} onChange={v=>setInfo({...info,targetAudience:v})} placeholder="25-40岁职场女性"/>
            </div>
          </div>

          {/* 产品参数 */}
          <div style={{ padding:"16px 18px", background:"#f8fafc", borderRadius:10, border:"1px solid #e2e8f0", marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#334155", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:20, height:20, borderRadius:5, background:"#8b5cf6", color:"#fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800 }}>2</span> 产品参数
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <Field label="尺寸/规格" value={info.dimensions} onChange={v=>setInfo({...info,dimensions:v})} placeholder="S/M/L/XL"/>
              <Field label="颜色选项" value={info.colors} onChange={v=>setInfo({...info,colors:v})} placeholder="Black, Navy, Red"/>
              <Field label="材质工艺" value={info.material} onChange={v=>setInfo({...info,material:v})} placeholder="100% Cotton, machine washable"/>
            </div>
          </div>

          {/* 卖点（最重要） */}
          <div style={{ padding:"16px 18px", background:"#f0fdf4", borderRadius:10, border:"1px solid #bbf7d0", marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#166534", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:20, height:20, borderRadius:5, background:"#059669", color:"#fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800 }}>3</span>
              卖点与差异化 <span style={{ fontSize:11, fontWeight:400, color:"#059669" }}>(最重要！)</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Field label="核心卖点" value={info.sellingPoints} onChange={v=>setInfo({...info,sellingPoints:v})} placeholder={"列出3-5个核心卖点，例如：\n1. 加厚高密度面料\n2. 独特剪裁修身显瘦\n3. 透气速干"} multiline rows={4} required/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="竞品差异化" value={info.diffPoints} onChange={v=>setInfo({...info,diffPoints:v})} placeholder="比竞品好在哪？" multiline rows={2}/>
                <Field label="使用场景" value={info.useScenarios} onChange={v=>setInfo({...info,useScenarios:v})} placeholder="办公、约会、聚会" multiline rows={2}/>
              </div>
            </div>
          </div>

          {/* 补充信息（可折叠） */}
          <details style={{ marginBottom:16 }}>
            <summary style={{ padding:"12px 18px", background:"#f8fafc", borderRadius:10, border:"1px solid #e2e8f0", cursor:"pointer", fontSize:13, fontWeight:700, color:"#475569" }}>
              <span style={{ width:20, height:20, borderRadius:5, background:"#64748b", color:"#fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, marginRight:6 }}>4</span>
              补充信息（选填，点击展开）
            </summary>
            <div style={{ padding:"14px 18px", background:"#fff", border:"1px solid #e2e8f0", borderTop:"none", borderRadius:"0 0 10px 10px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="包装内容" value={info.packageContents} onChange={v=>setInfo({...info,packageContents:v})} placeholder="1x Dress, 1x Belt"/>
                <Field label="认证信息" value={info.certifications} onChange={v=>setInfo({...info,certifications:v})} placeholder="OEKO-TEX, CE"/>
                <Field label="核心关键词" value={info.keywords} onChange={v=>setInfo({...info,keywords:v})} placeholder="floral dress, summer dress, midi dress"/>
                <Field label="参考竞品ASIN" value={info.competitors} onChange={v=>setInfo({...info,competitors:v})} placeholder="B09XXX, B08YYY"/>
              </div>
            </div>
          </details>

          {/* 操作按钮 */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20, paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
            <button onClick={generatePrompt} disabled={!info.brand || !info.sellingPoints} style={{
              padding:"11px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor: (!info.brand || !info.sellingPoints)?"not-allowed":"pointer",
              background: (!info.brand || !info.sellingPoints) ? "#e2e8f0" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
              color: (!info.brand || !info.sellingPoints) ? "#94a3b8" : "#fff",
              border:"none", boxShadow: (!info.brand || !info.sellingPoints) ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
            }}>🪄 生成AI提示词 →</button>
          </div>
        </div>
      )}

      {/* ───── Step 2: 显示生成的提示词 ───── */}
      {step === 2 && (
        <div className="fade-in" style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"24px 28px" }}>
          <div style={{ marginBottom:18 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>🪄 AI 提示词已生成</h2>
            <p style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>复制下方提示词，粘贴到 ChatGPT / Claude / DeepSeek / Gemini 等AI工具中生成Listing</p>
          </div>

          <div style={{ padding:"14px 18px", background:"#fffbeb", borderRadius:10, border:"1px solid #fde68a", marginBottom:16, fontSize:12.5, color:"#92400e", lineHeight:1.7 }}>
            💡 <b>使用说明：</b>
            <ol style={{ marginTop:6, paddingLeft:18 }}>
              <li>点击下方"📋 复制提示词"按钮</li>
              <li>打开你常用的AI工具（推荐 Claude / ChatGPT / DeepSeek）</li>
              <li>粘贴提示词并发送，等待AI生成完整Listing</li>
              <li>复制AI返回的全部内容，回到本系统进入下一步</li>
            </ol>
          </div>

          <div style={{ position:"relative", marginBottom:16 }}>
            <textarea value={generatedPrompt} readOnly rows={20} style={{
              width:"100%", padding:"16px 18px", borderRadius:10, border:"1px solid #e2e8f0",
              fontSize:12.5, fontFamily:"'SF Mono', Monaco, Consolas, monospace", lineHeight:1.7,
              background:"#f8fafc", color:"#334155", resize:"vertical",
            }}/>
            <button onClick={copyPrompt} style={{
              position:"absolute", top:12, right:12,
              padding:"7px 16px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer",
              background: promptCopied ? "#10b981" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
              color:"#fff", border:"none", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", transition:"all .2s",
            }}>{promptCopied ? "✓ 已复制" : "📋 复制提示词"}</button>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", gap:10, paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
            <button onClick={()=>setStep(1)} style={{ padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", background:"#fff", color:"#64748b", border:"1px solid #e2e8f0" }}>← 返回修改产品信息</button>
            <button onClick={()=>{setStep(3); if(maxStep<3) setMaxStep(3);}} style={{
              padding:"11px 28px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
              background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", border:"none",
              boxShadow:"0 4px 12px rgba(37,99,235,0.3)",
            }}>下一步: 粘贴AI输出 →</button>
          </div>
        </div>
      )}

      {/* ───── Step 3: 粘贴AI输出 ───── */}
      {step === 3 && (
        <div className="fade-in" style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"24px 28px" }}>
          <div style={{ marginBottom:18 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>📝 粘贴AI生成的Listing</h2>
            <p style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>将AI返回的完整Listing文案粘贴到下方文本框，系统将自动解析各板块</p>
          </div>

          <textarea value={aiOutput} onChange={e=>setAiOutput(e.target.value)} placeholder={`粘贴AI生成的Listing内容，例如：\n\nTitle:\nMaique Women's Floral Midi Dress, Cotton Summer Dress with Belt...\n\nBullet Points:\n1. PREMIUM COTTON FABRIC – Made with 100% breathable cotton...\n2. FLATTERING SILHOUETTE – ...\n...\n\nProduct Description:\n...\n\nSearch Terms:\nfloral midi dress women cotton summer ...`} rows={18} style={{
            width:"100%", padding:"16px 18px", borderRadius:10, border:"1px solid #e2e8f0",
            fontSize:13, fontFamily:"inherit", lineHeight:1.7, resize:"vertical", marginBottom:16,
          }}/>

          <div style={{ display:"flex", justifyContent:"space-between", gap:10, paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
            <button onClick={()=>setStep(2)} style={{ padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", background:"#fff", color:"#64748b", border:"1px solid #e2e8f0" }}>← 返回提示词</button>
            <button onClick={parseOutput} disabled={!aiOutput.trim()} style={{
              padding:"11px 28px", borderRadius:8, fontSize:13, fontWeight:700, cursor: !aiOutput.trim()?"not-allowed":"pointer",
              background: !aiOutput.trim() ? "#e2e8f0" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
              color: !aiOutput.trim() ? "#94a3b8" : "#fff", border:"none",
              boxShadow: !aiOutput.trim() ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
            }}>解析 & 进入合规检查 →</button>
          </div>
        </div>
      )}

      {/* ───── Step 4: 合规检查 ───── */}
      {step === 4 && parsedListing && (
        <div className="fade-in">
          {/* Listing 板块展示 */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"24px 28px", marginBottom:16 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#0f172a", marginBottom:16 }}>📋 解析后的 Listing</h2>
            
            {/* TITLE */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ padding:"2px 10px", borderRadius:5, fontSize:11, fontWeight:700, background:"#2563eb", color:"#fff" }}>TITLE</span>
                <span style={{ fontSize:11, color: parsedListing.title.length > AMAZON_LIMITS.title ? "#ef4444" : parsedListing.title.length > AMAZON_LIMITS.titleIdeal ? "#f59e0b" : "#10b981", fontWeight:600 }}>
                  {parsedListing.title.length} / {AMAZON_LIMITS.title} 字符
                </span>
              </div>
              <div style={{ padding:"12px 16px", background:"#f8fafc", borderRadius:8, fontSize:13, lineHeight:1.7, color:"#1e293b", border:"1px solid #e2e8f0" }}>
                {parsedListing.title || <span style={{ color:"#cbd5e1" }}>未解析到标题</span>}
              </div>
            </div>

            {/* BULLETS */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ padding:"2px 10px", borderRadius:5, fontSize:11, fontWeight:700, background:"#7c3aed", color:"#fff" }}>BULLET POINTS</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {parsedListing.bullets.map((b, i) => (
                  <div key={i} style={{ padding:"10px 14px", background:"#f8fafc", borderRadius:8, border:"1px solid #e2e8f0" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#7c3aed" }}>Bullet {i+1}</span>
                      <span style={{ fontSize:11, color: b.length > AMAZON_LIMITS.bullet ? "#ef4444" : b.length > AMAZON_LIMITS.bulletIdeal ? "#f59e0b" : "#10b981", fontWeight:600 }}>
                        {b.length} / {AMAZON_LIMITS.bullet}
                      </span>
                    </div>
                    <div style={{ fontSize:13, lineHeight:1.6, color:"#1e293b" }}>{b || <span style={{ color:"#cbd5e1" }}>未解析到内容</span>}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ padding:"2px 10px", borderRadius:5, fontSize:11, fontWeight:700, background:"#ea580c", color:"#fff" }}>DESCRIPTION</span>
                <span style={{ fontSize:11, color: parsedListing.description.length > AMAZON_LIMITS.description ? "#ef4444" : "#10b981", fontWeight:600 }}>
                  {parsedListing.description.length} / {AMAZON_LIMITS.description} 字符
                </span>
              </div>
              <div style={{ padding:"12px 16px", background:"#f8fafc", borderRadius:8, fontSize:13, lineHeight:1.7, color:"#1e293b", border:"1px solid #e2e8f0", maxHeight:200, overflowY:"auto" }}>
                {parsedListing.description || <span style={{ color:"#cbd5e1" }}>未解析到描述</span>}
              </div>
            </div>

            {/* SEARCH TERMS */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ padding:"2px 10px", borderRadius:5, fontSize:11, fontWeight:700, background:"#059669", color:"#fff" }}>SEARCH TERMS</span>
                <span style={{ fontSize:11, color: parsedListing.searchTerms.length > AMAZON_LIMITS.searchTerms ? "#ef4444" : "#10b981", fontWeight:600 }}>
                  {parsedListing.searchTerms.length} / {AMAZON_LIMITS.searchTerms} 字节
                </span>
              </div>
              <div style={{ padding:"12px 16px", background:"#f8fafc", borderRadius:8, fontSize:13, lineHeight:1.6, color:"#1e293b", border:"1px solid #e2e8f0", fontFamily:"monospace" }}>
                {parsedListing.searchTerms || <span style={{ color:"#cbd5e1" }}>未解析到搜索词</span>}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
            <button onClick={()=>setStep(3)} style={{ padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", background:"#fff", color:"#64748b", border:"1px solid #e2e8f0" }}>← 修改AI输出</button>
            <button onClick={runCompliance} style={{
              padding:"11px 28px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
              background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#fff", border:"none",
              boxShadow:"0 4px 12px rgba(245,158,11,0.3)",
            }}>✅ 执行合规检查 →</button>
          </div>
        </div>
      )}

      {/* ───── Step 5: 合规结果 + 导出 ───── */}
      {step === 5 && compliance && (
        <div className="fade-in">
          {/* 合规摘要 */}
          <div style={{
            padding:"18px 24px", borderRadius:14, marginBottom:16,
            background: (compliance.hard.length === 0 && compliance.soft.length === 0) ? "linear-gradient(135deg,#ecfdf5,#d1fae5)" : compliance.hard.length > 0 ? "linear-gradient(135deg,#fef2f2,#fee2e2)" : "linear-gradient(135deg,#fffbeb,#fef3c7)",
            border: `1px solid ${(compliance.hard.length === 0 && compliance.soft.length === 0) ? "#a7f3d0" : compliance.hard.length > 0 ? "#fecaca" : "#fde68a"}`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:36 }}>
                {(compliance.hard.length === 0 && compliance.soft.length === 0) ? "✅" : compliance.hard.length > 0 ? "❌" : "⚠️"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:700, color: (compliance.hard.length === 0 && compliance.soft.length === 0) ? "#065f46" : compliance.hard.length > 0 ? "#991b1b" : "#92400e" }}>
                  {(compliance.hard.length === 0 && compliance.soft.length === 0) ? "合规检查通过" : compliance.hard.length > 0 ? `发现 ${compliance.hard.length} 个严重违规` : `发现 ${compliance.soft.length} 个建议优化项`}
                </div>
                <div style={{ fontSize:12, color: (compliance.hard.length === 0 && compliance.soft.length === 0) ? "#059669" : compliance.hard.length > 0 ? "#dc2626" : "#d97706", marginTop:3 }}>
                  {(compliance.hard.length === 0 && compliance.soft.length === 0) ? "你的Listing未发现违禁词，可以放心使用" : compliance.hard.length > 0 ? "存在亚马逊禁止使用的词汇，必须修改" : "包含一些需要谨慎使用的词汇，建议检查"}
                </div>
              </div>
            </div>
          </div>

          {/* 严重违规 */}
          {compliance.hard.length > 0 && (
            <div style={{ background:"#fff", borderRadius:14, border:"2px solid #fecaca", padding:"18px 24px", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#dc2626", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                🚫 严重违规词汇 <span style={{ fontSize:11, fontWeight:400, color:"#94a3b8" }}>(必须修改)</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {compliance.hard.map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#fef2f2", borderRadius:8, border:"1px solid #fecaca" }}>
                    <span style={{ padding:"3px 10px", borderRadius:5, fontSize:12, fontWeight:700, background:"#dc2626", color:"#fff", fontFamily:"monospace" }}>{item.word}</span>
                    <span style={{ fontSize:11, color:"#94a3b8" }}>×{item.count}次</span>
                    <span style={{ flex:1, fontSize:12, color:"#991b1b" }}>建议: <b>{item.fix}</b></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 建议优化 */}
          {compliance.soft.length > 0 && (
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #fde68a", padding:"18px 24px", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#d97706", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                ⚠️ 建议优化词汇 <span style={{ fontSize:11, fontWeight:400, color:"#94a3b8" }}>(谨慎使用)</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {compliance.soft.map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#fffbeb", borderRadius:8, border:"1px solid #fde68a" }}>
                    <span style={{ padding:"3px 10px", borderRadius:5, fontSize:12, fontWeight:700, background:"#f59e0b", color:"#fff", fontFamily:"monospace" }}>{item.word}</span>
                    <span style={{ fontSize:11, color:"#94a3b8" }}>×{item.count}次</span>
                    <span style={{ flex:1, fontSize:12, color:"#92400e" }}>建议: <b>{item.fix}</b></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 信息提示 */}
          {compliance.info.length > 0 && (
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #bfdbfe", padding:"18px 24px", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#2563eb", marginBottom:12 }}>ℹ️ 其他提示</div>
              {compliance.info.map((item, i) => (
                <div key={i} style={{ padding:"8px 12px", background:"#eff6ff", borderRadius:6, fontSize:12, color:"#1e40af" }}>{item.msg}</div>
              ))}
            </div>
          )}

          {/* 操作 */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"20px 24px" }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#475569", marginBottom:14 }}>🎉 完成！可以保存或导出 Listing</div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={exportListing} style={{
                padding:"11px 24px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
                background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", border:"none",
                boxShadow:"0 4px 12px rgba(16,185,129,0.3)",
              }}>💾 导出 .txt 文件</button>
              <button onClick={()=>{
                navigator.clipboard.writeText(aiOutput);
                alert("已复制完整Listing到剪贴板");
              }} style={{
                padding:"11px 24px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
                background:"#fff", color:"#2563eb", border:"1px solid #bfdbfe",
              }}>📋 复制完整Listing</button>
              <button onClick={resetAll} style={{
                padding:"11px 24px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
                background:"#fff", color:"#64748b", border:"1px solid #e2e8f0",
              }}>↻ 编写新的Listing</button>
            </div>
            <div style={{ marginTop:14, padding:"10px 14px", background:"#f0fdf4", borderRadius:8, fontSize:12, color:"#059669", border:"1px solid #a7f3d0" }}>
              ✓ 本次Listing已自动保存到历史记录，可在右上角"📋 历史"中查看
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   OPERATION MODULE (容器：根据子菜单切换)
   ═══════════════════════════════════════════ */
function OperationPage({ subKey }) {
  if (subKey === "Listing编写") return <ListingBuilderPage/>;
  if (subKey === "广告策略") return <PlaceholderPage label="广告策略"/>;
  if (subKey === "广告优化") return <PlaceholderPage label="广告优化"/>;
  
  // 默认：模块入口
  return (
    <div className="fade-in">
      <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", marginBottom:6 }}>📣 运营推广中心</h1>
      <p style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>跨境电商运营全流程工具集</p>
      
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
        {[
          { title:"Listing编写", desc:"AI辅助生成专业亚马逊Listing文案，含合规检查", icon:"📝", color:"#2563eb", bg:"#eff6ff" },
          { title:"广告策略", desc:"产品级广告策略规划与新品Launch方案", icon:"📊", color:"#7c3aed", bg:"#f5f3ff" },
          { title:"广告优化", desc:"PPC广告智能诊断与优化建议", icon:"🎯", color:"#059669", bg:"#ecfdf5" },
        ].map(card => (
          <div key={card.title} style={{
            background:"#fff", borderRadius:14, padding:"24px", border:"1px solid #e2e8f0",
            cursor:"pointer", transition:"all .2s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}
          >
            <div style={{ width:50, height:50, borderRadius:12, background:card.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14 }}>{card.icon}</div>
            <div style={{ fontSize:16, fontWeight:700, color:card.color, marginBottom:6 }}>{card.title}</div>
            <div style={{ fontSize:12.5, color:"#64748b", lineHeight:1.6 }}>{card.desc}</div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop:20, padding:"14px 18px", background:"#fffbeb", borderRadius:10, border:"1px solid #fde68a", fontSize:12.5, color:"#92400e" }}>
        💡 点击左侧菜单 <b>"运营推广"</b> 下的子菜单进入对应工具
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FILTER BAR + ORDER CARD (生产模块复用)
   ═══════════════════════════════════════════ */
function FilterBar() {
  const fields = [
    { label:"年份", placeholder:"2026", w:80 },
    { label:"季节", placeholder:"全部", w:90, s:1 },
    { label:"波段", placeholder:"全部", w:90, s:1 },
    { label:"款式类别", placeholder:"全部", w:110, s:1 },
    { label:"款号", placeholder:"", w:110 },
    { label:"客户PPO", placeholder:"", w:110 },
    { label:"客户", placeholder:"全部", w:100, s:1 },
    { label:"加工厂", placeholder:"全部", w:100, s:1 },
    { label:"订单类型", placeholder:"全部", w:100, s:1 },
    { label:"加工类型", placeholder:"全部", w:100, s:1 },
    { label:"客户品牌", placeholder:"全部", w:100, s:1 },
    { label:"设计师", placeholder:"全部", w:100, s:1 },
  ];
  const st = { height:32, borderRadius:6, border:"1px solid #e2e8f0", fontSize:13, padding:"0 10px", color:"#374151", background:"#fff" };
  return (
    <div style={{ background:"#fff", borderRadius:10, padding:"16px 20px", marginBottom:16, border:"1px solid #e2e8f0" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"flex-end" }}>
        {fields.map((f,i)=>(
          <div key={i} style={{ display:"flex", flexDirection:"column", gap:3 }}>
            <label style={{ fontSize:11, color:"#94a3b8", fontWeight:500 }}>{f.label}</label>
            {f.s ? <select style={{...st,width:f.w}}><option>{f.placeholder}</option></select> : <input placeholder={f.placeholder} style={{...st,width:f.w}}/>}
          </div>
        ))}
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ height:32, padding:"0 14px", borderRadius:6, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, color:"#6b7280", cursor:"pointer" }}>重置</button>
          <button style={{ height:32, padding:"0 18px", borderRadius:6, border:"none", background:"#2563eb", color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer" }}>🔍 查询</button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, days }) {
  const m = { overdue:{bg:"#ef4444",t:`逾期${days}天`}, inProgress:{bg:"#3b82f6",t:`进行${days}天`}, notStarted:{bg:"#f59e0b",t:`剩余${days}天`}, completed:{bg:"#22c55e",t:"已完成"} };
  const s = m[status]||m.inProgress;
  return <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:600, color:"#fff", background:s.bg }}>{s.t}</span>;
}

function OrderCard({ order, index }) {
  return (
    <div className="fade-in" style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", overflow:"hidden", cursor:"pointer", transition:"all 0.2s ease", animationDelay:`${index*0.04}s` }}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.07)";e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}
    >
      <div style={{ display:"flex", gap:12, padding:14 }}>
        <div style={{ width:88, height:98, borderRadius:8, background:GARMENT_COLORS[order.id%GARMENT_COLORS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, flexShrink:0, position:"relative" }}>
          {GARMENT_EMOJI[order.id%GARMENT_EMOJI.length]}
          <div style={{ position:"absolute", top:4, left:4 }}><StatusBadge status={order.status} days={order.days}/></div>
        </div>
        <div style={{ flex:1, fontSize:12.5, color:"#4b5563", lineHeight:1.9 }}>
          <div>货期: <b style={{ color:"#0f172a" }}>{order.date}</b></div>
          <div style={{ color:"#94a3b8", fontSize:12 }}>制单号: {order.code}</div>
          <div>大货款号: <b>{order.styleNo}</b></div>
          <div style={{ display:"flex", justifyContent:"space-between" }}><span>数量: {order.qty}</span><span>颜色: {order.color}</span></div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>加工厂: {order.factory}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
            <div style={{ flex:1, height:5, background:"#e5e7eb", borderRadius:3 }}>
              <div style={{ width:`${order.progress}%`, height:"100%", borderRadius:3, background:order.progress>80?"#22c55e":order.progress>50?"#3b82f6":"#f59e0b", transition:"width 0.5s ease" }}/>
            </div>
            <span style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{order.progress}%</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", borderTop:"1px solid #f1f5f9", background:"#fafbfc" }}>
        {TABS.map((tab,i)=>(<div key={tab} style={{ flex:1, textAlign:"center", padding:"7px 0", fontSize:12, color:i===0?"#2563eb":"#b0b8c4", fontWeight:i===0?600:400, cursor:"pointer", borderBottom:i===0?"2px solid #2563eb":"2px solid transparent" }}>{tab}</div>))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════ */
function DashboardPage({ user }) {
  const ri = ROLES[user.role];
  const stats = [
    { label:"进行中订单", value:47, icon:"📋", color:"#3b82f6", bg:"#eff6ff" },
    { label:"逾期订单",   value:8,  icon:"⚠️", color:"#ef4444", bg:"#fef2f2" },
    { label:"今日交货",   value:3,  icon:"🚚", color:"#22c55e", bg:"#f0fdf4" },
    { label:"工厂数量",   value:12, icon:"🏭", color:"#8b5cf6", bg:"#f5f3ff" },
    { label:"本月完成",   value:156,icon:"✅", color:"#06b6d4", bg:"#ecfeff" },
    { label:"在途物料",   value:34, icon:"🧵", color:"#f59e0b", bg:"#fffbeb" },
  ];
  const qa = getMenuForRole(user.role).filter(m=>m.key!=="dashboard").slice(0,6).map(m=>m.label);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <h2 style={{ fontSize:18, fontWeight:700 }}>欢迎回来，{user.name}</h2>
        <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:4, fontSize:12, fontWeight:600, color:"#fff", background:ri.color }}>{ri.label}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14, marginBottom:24 }}>
        {stats.map((s,i)=>(
          <div key={i} className="fade-in" style={{ background:"#fff", borderRadius:10, padding:"18px 20px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:14, animationDelay:`${i*0.06}s` }}>
            <div style={{ width:46, height:46, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.icon}</div>
            <div><div style={{ fontSize:12, color:"#94a3b8" }}>{s.label}</div><div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div></div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:"#fff", borderRadius:10, padding:20, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>我的模块</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {qa.map(a=>(
              <button key={a} style={{ padding:"8px 16px", borderRadius:6, border:"1px solid #e2e8f0", background:"#f8fafc", fontSize:13, color:"#4b5563", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#2563eb";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="#2563eb"}}
                onMouseLeave={e=>{e.currentTarget.style.background="#f8fafc";e.currentTarget.style.color="#4b5563";e.currentTarget.style.borderColor="#e2e8f0"}}
              >{a}</button>
            ))}
          </div>
        </div>
        <div style={{ background:"#fff", borderRadius:10, padding:20, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>最近动态</div>
          {[
            { time:"10:23", text:"订单 #20260311014 裁剪工序已完成", t:"success" },
            { time:"09:45", text:"订单 #20250109003 已逾期76天", t:"warning" },
            { time:"09:12", text:"新增客户订单 TEST01，数量600件", t:"info" },
            { time:"昨天",  text:"广州商派工厂产能报告已更新", t:"info" },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<3?"1px solid #f1f5f9":"none" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background:item.t==="success"?"#22c55e":item.t==="warning"?"#ef4444":"#3b82f6" }}/>
              <span style={{ fontSize:13, color:"#4b5563", flex:1 }}>{item.text}</span>
              <span style={{ fontSize:11, color:"#cbd5e1" }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductionPage() {
  const si = [
    { label:"生产进度", sub:"11单 / 4,203件", active:true },
    { label:"货期状态（未完成）", sub:"11单 / 4,203件", active:false },
    { label:"全部", sub:"17单 / 6,003件", active:false },
  ];
  return (
    <div>
      <FilterBar/>
      <div style={{ display:"flex", gap:16 }}>
        <div style={{ width:186, background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:"14px 0", flexShrink:0, alignSelf:"flex-start" }}>
          <div style={{ fontSize:14, fontWeight:600, padding:"0 16px 12px", borderBottom:"1px solid #f1f5f9" }}>生产汇总列表</div>
          {si.map((it,i)=>(
            <div key={i} style={{ padding:"10px 16px", fontSize:13, color:it.active?"#2563eb":"#4b5563", fontWeight:it.active?600:400, background:it.active?"#eff6ff":"transparent", cursor:"pointer", borderLeft:it.active?"3px solid #2563eb":"3px solid transparent" }}
              onMouseEnter={e=>{if(!it.active) e.currentTarget.style.background="#f8fafc"}}
              onMouseLeave={e=>{e.currentTarget.style.background=it.active?"#eff6ff":"transparent"}}
            ><div>{it.label}</div><div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{it.sub}</div></div>
          ))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:600 }}>任务列表</span>
            <span style={{ fontSize:13, color:"#94a3b8" }}>⚙</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14 }}>
            {MOCK_ORDERS.map((order,i)=><OrderCard key={order.id} order={order} index={i}/>)}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, padding:"14px 0", fontSize:13, color:"#6b7280" }}>
            <span>共 11 条</span>
            <select style={{ height:28, borderRadius:4, border:"1px solid #d1d5db", fontSize:12, padding:"0 6px" }}><option>20条/页</option></select>
            {["‹","1","›"].map((t,i)=>(<span key={i} style={{ width:28, height:28, borderRadius:4, display:"inline-flex", alignItems:"center", justifyContent:"center", background:t==="1"?"#2563eb":"#fff", color:t==="1"?"#fff":"#6b7280", border:t==="1"?"none":"1px solid #d1d5db", cursor:"pointer", fontSize:13 }}>{t}</span>))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagementPage({ user }) {
  if (user.role !== "admin") {
    return <div className="fade-in" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, color:"#94a3b8" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🔒</div><div style={{ fontSize:15, fontWeight:500 }}>无访问权限</div>
    </div>;
  }
  return (
    <div className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <h2 style={{ fontSize:18, fontWeight:700 }}>用户管理</h2>
        <div style={{ fontSize:12, color:"#94a3b8", background:"#f8fafc", padding:"6px 14px", borderRadius:6, border:"1px solid #e2e8f0" }}>
          修改账号请编辑代码中的 USERS 数组
        </div>
      </div>
      <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
              {["用户名","姓名","角色","密码","可访问模块"].map(h=><th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#4b5563" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {USERS.map((u,i)=>{
              const r=ROLES[u.role];
              const mods=r.modules.map(k=>ALL_MENU.find(m=>m.key===k)?.label).filter(Boolean);
              return (
                <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#fafbfc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"12px 16px", fontFamily:"monospace", color:"#6b7280" }}>{u.username}</td>
                  <td style={{ padding:"12px 16px", fontWeight:500 }}>{u.name}</td>
                  <td style={{ padding:"12px 16px" }}><span style={{ display:"inline-block", padding:"2px 10px", borderRadius:4, fontSize:12, fontWeight:600, color:"#fff", background:r.color }}>{r.label}</span></td>
                  <td style={{ padding:"12px 16px", fontFamily:"monospace", color:"#94a3b8" }}>{u.password}</td>
                  <td style={{ padding:"12px 16px", color:"#6b7280", fontSize:12 }}>{mods.join("、")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop:20, background:"#fff", borderRadius:10, padding:20, border:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>角色权限说明</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
          {Object.entries(ROLES).map(([key,r])=>(
            <div key={key} style={{ padding:"12px 16px", borderRadius:8, background:"#f8fafc", border:"1px solid #e2e8f0" }}>
              <div style={{ marginBottom:6 }}><span style={{ display:"inline-block", padding:"2px 10px", borderRadius:4, fontSize:12, fontWeight:600, color:"#fff", background:r.color }}>{r.label}</span></div>
              <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{r.modules.map(k=>ALL_MENU.find(m=>m.key===k)?.label).filter(Boolean).join("、")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ label }) {
  return <div className="fade-in" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:420, color:"#94a3b8" }}>
    <div style={{ fontSize:52, marginBottom:16 }}>🚧</div>
    <div style={{ fontSize:17, fontWeight:600, color:"#64748b" }}>{label}</div>
    <div style={{ fontSize:13, marginTop:6 }}>该模块正在开发中，敬请期待</div>
  </div>;
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [user, setUser]             = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [expandedKey, setExpandedKey] = useState(null);
  const [collapsed, setCollapsed]   = useState(false);
  const [opSubKey, setOpSubKey]     = useState(null); // 运营推广子菜单

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  useEffect(() => {
    try { const s = sessionStorage.getItem("maique_user"); if(s) setUser(JSON.parse(s)); } catch{}
  }, []);

  const handleLogin = (u) => {
    setUser(u); setActiveMenu("dashboard");
    try { sessionStorage.setItem("maique_user", JSON.stringify(u)); } catch{}
  };
  const handleLogout = () => {
    setUser(null); setActiveMenu("dashboard"); setExpandedKey(null); setOpSubKey(null);
    try { sessionStorage.removeItem("maique_user"); } catch{}
  };

  // 切换主菜单时清空子菜单
  useEffect(() => {
    if (activeMenu !== "operation") setOpSubKey(null);
  }, [activeMenu]);

  useEffect(() => {
    if (user && !hasAccess(user.role, activeMenu)) setActiveMenu("dashboard");
  }, [activeMenu, user]);

  if (!user) return <LoginPage onLogin={handleLogin}/>;

  const currentLabel = ALL_MENU.find(m=>m.key===activeMenu)?.label||"";
  const pages = {
    dashboard: <DashboardPage user={user}/>,
    production: <ProductionPage/>,
    operation: <OperationPage subKey={opSubKey}/>,
    system: <UserManagementPage user={user}/>,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} expandedKey={expandedKey} setExpandedKey={setExpandedKey} collapsed={collapsed} setCollapsed={setCollapsed} user={user} opSubKey={opSubKey} setOpSubKey={setOpSubKey}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <TopBar user={user} onLogout={handleLogout} activeMenu={activeMenu} opSubKey={opSubKey}/>
        <div style={{ flex:1, padding:20, overflowY:"auto" }}>
          {pages[activeMenu] || <PlaceholderPage label={currentLabel}/>}
        </div>
      </div>
    </div>
  );
}
