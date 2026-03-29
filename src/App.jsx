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
  input:focus, select:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
`;

/* ═══════════════════════════════════════════
   USERS & ROLES CONFIG
   ═══════════════════════════════════════════
   
   ★ 角色说明 ★
   admin（管理员）: 所有模块
   designer（设计师）: 设计开发、技术版房、商品企划
   merchandiser（跟单员）: 业务跟单、生产汇总、物料采购、工厂管理
   quality（品控）: 品质控制、仓库管理
   finance（财务）: 财务会计
   viewer（访客）: 只能看工作台
   
   ★ 修改账号 ★ 直接编辑下面的 USERS 数组即可
*/
const ROLES = {
  admin: {
    label: "管理员", color: "#dc2626",
    modules: ["dashboard","hr","planning","design","order","tech","production","material","factory","quality","warehouse","finance","mall","system"],
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
  { username: "guest",     password: "guest123",  name: "访客",       role: "viewer" },
];

/* ═══════════════════════════════════════════
   MENU & MOCK DATA
   ═══════════════════════════════════════════ */
const ALL_MENU = [
  { icon: "📊", label: "工作台",   key: "dashboard" },
  { icon: "👥", label: "人事行政", key: "hr",         children: ["员工管理","考勤管理","薪资管理"] },
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
   HELPERS
   ═══════════════════════════════════════════ */
function getMenuForRole(role) {
  const allowed = ROLES[role]?.modules || [];
  return ALL_MENU.filter(item => allowed.includes(item.key));
}
function hasAccess(role, key) {
  return ROLES[role]?.modules?.includes(key) || false;
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
   SIDEBAR (role-filtered)
   ═══════════════════════════════════════════ */
function Sidebar({ activeMenu, setActiveMenu, expandedKey, setExpandedKey, collapsed, setCollapsed, user }) {
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
                  {item.children.map(child => (
                    <div key={child} style={{ padding:"9px 22px 9px 54px", fontSize:13, color:"#94a3b8", cursor:"pointer", transition:"all 0.12s" }}
                      onMouseEnter={e=>{e.currentTarget.style.color="#2563eb";e.currentTarget.style.background="#f0f7ff"}}
                      onMouseLeave={e=>{e.currentTarget.style.color="#94a3b8";e.currentTarget.style.background="transparent"}}
                    >{child}</div>
                  ))}
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
function TopBar({ user, onLogout, activeMenu }) {
  const current = ALL_MENU.find(m=>m.key===activeMenu);
  const ri = ROLES[user.role];
  return (
    <div style={{ height:52, background:"#fff", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
        <span style={{ color:"#94a3b8" }}>工作台</span>
        {current && activeMenu!=="dashboard" && <><span style={{ color:"#cbd5e1" }}>/</span><span style={{ color:"#2563eb", fontWeight:500 }}>{current.label}</span></>}
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
   FILTER BAR
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

/* ═══════════════════════════════════════════
   ORDER CARD + STATUS
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   USER MANAGEMENT PAGE (admin only)
   ═══════════════════════════════════════════ */
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

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  // Restore session
  useEffect(() => {
    try { const s = sessionStorage.getItem("maique_user"); if(s) setUser(JSON.parse(s)); } catch{}
  }, []);

  const handleLogin = (u) => {
    setUser(u); setActiveMenu("dashboard");
    try { sessionStorage.setItem("maique_user", JSON.stringify(u)); } catch{}
  };
  const handleLogout = () => {
    setUser(null); setActiveMenu("dashboard"); setExpandedKey(null);
    try { sessionStorage.removeItem("maique_user"); } catch{}
  };

  // Guard unauthorized access
  useEffect(() => {
    if (user && !hasAccess(user.role, activeMenu)) setActiveMenu("dashboard");
  }, [activeMenu, user]);

  if (!user) return <LoginPage onLogin={handleLogin}/>;

  const currentLabel = ALL_MENU.find(m=>m.key===activeMenu)?.label||"";
  const pages = {
    dashboard: <DashboardPage user={user}/>,
    production: <ProductionPage/>,
    system: <UserManagementPage user={user}/>,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} expandedKey={expandedKey} setExpandedKey={setExpandedKey} collapsed={collapsed} setCollapsed={setCollapsed} user={user}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <TopBar user={user} onLogout={handleLogout} activeMenu={activeMenu}/>
        <div style={{ flex:1, padding:20, overflowY:"auto" }}>
          {pages[activeMenu] || <PlaceholderPage label={currentLabel}/>}
        </div>
      </div>
    </div>
  );
}
