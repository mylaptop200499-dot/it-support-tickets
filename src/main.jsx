import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const KIND = "tickets";
const seeds = {
 employees:[
  {id:"e1",name:"Ava Wilson",email:"ava.wilson@example.com",department:"Design",role:"Product Designer",status:"Active",salary:72000},
  {id:"e2",name:"Noah Patel",email:"noah.patel@example.com",department:"Engineering",role:"Frontend Developer",status:"Active",salary:84000},
  {id:"e3",name:"Mia Chen",email:"mia.chen@example.com",department:"Marketing",role:"Marketing Lead",status:"On leave",salary:68000},
  {id:"e4",name:"Liam Garcia",email:"liam.garcia@example.com",department:"Engineering",role:"QA Engineer",status:"Active",salary:76000}],
 shop:[
  {id:"p1",name:"Everyday Backpack",category:"Accessories",price:54,detail:"A lightweight companion for daily adventures.",status:"In stock",emoji:"🎒"},
  {id:"p2",name:"Studio Headphones",category:"Electronics",price:89,detail:"Rich sound, soft cushions, all-day comfort.",status:"In stock",emoji:"🎧"},
  {id:"p3",name:"Ceramic Coffee Set",category:"Home",price:32,detail:"A calm start to your morning ritual.",status:"In stock",emoji:"☕"},
  {id:"p4",name:"Minimal Watch",category:"Accessories",price:115,detail:"A timeless silhouette with a clean dial.",status:"In stock",emoji:"⌚"},
  {id:"p5",name:"Desk Lamp",category:"Home",price:47,detail:"Warm, adjustable light for focused work.",status:"In stock",emoji:"💡"},
  {id:"p6",name:"Wireless Speaker",category:"Electronics",price:69,detail:"Compact design with room-filling sound.",status:"In stock",emoji:"🔊"}],
 students:[
  {id:"s1",name:"Olivia Martin",email:"olivia@example.com",course:"Computer Science",marks:92,status:"Enrolled"},
  {id:"s2",name:"Ethan Brown",email:"ethan@example.com",course:"Business",marks:78,status:"Enrolled"},
  {id:"s3",name:"Sophia Davis",email:"sophia@example.com",course:"Design",marks:86,status:"Enrolled"},
  {id:"s4",name:"Lucas Wilson",email:"lucas@example.com",course:"Computer Science",marks:64,status:"On hold"}],
 tasks:[
  {id:"t1",name:"Prepare sprint review",owner:"Design team",due:"2026-10-30",priority:"High",status:"In progress"},
  {id:"t2",name:"Update landing page",owner:"Ava Wilson",due:"2026-11-02",priority:"Medium",status:"To do"},
  {id:"t3",name:"Review accessibility",owner:"Noah Patel",due:"2026-10-29",priority:"High",status:"Done"},
  {id:"t4",name:"Organize project files",owner:"Mia Chen",due:"2026-11-05",priority:"Low",status:"To do"}],
 expenses:[
  {id:"x1",name:"Groceries",category:"Food",amount:82.4,date:"2026-10-27",note:"Weekly shopping"},
  {id:"x2",name:"Monthly transit",category:"Transport",amount:45,date:"2026-10-25",note:"Travel pass"},
  {id:"x3",name:"Streaming subscription",category:"Entertainment",amount:14.99,date:"2026-10-22",note:"Monthly plan"},
  {id:"x4",name:"Coffee with friends",category:"Food",amount:18.5,date:"2026-10-20",note:"Weekend"}],
 food:[
  {id:"f1",name:"Garden Pesto Pasta",category:"Mains",price:14.5,detail:"Basil pesto, cherry tomatoes, parmesan.",emoji:"🍝"},
  {id:"f2",name:"Crispy Halloumi Bowl",category:"Mains",price:16,detail:"Grains, greens, lemon tahini dressing.",emoji:"🥗"},
  {id:"f3",name:"Truffle Fries",category:"Sides",price:7,detail:"Golden fries with herbs and parmesan.",emoji:"🍟"},
  {id:"f4",name:"Berry Cheesecake",category:"Desserts",price:8.5,detail:"Creamy cheesecake with berry compote.",emoji:"🍰"},
  {id:"f5",name:"Iced Matcha Latte",category:"Drinks",price:5.5,detail:"Ceremonial matcha with chilled milk.",emoji:"🍵"},
  {id:"f6",name:"Roasted Tomato Soup",category:"Sides",price:8,detail:"Slow-roasted tomatoes and fresh basil.",emoji:"🍲"}],
 hospital:[
  {id:"h1",name:"Dr. Amelia Brooks",specialty:"Cardiology",experience:"12 years experience",fee:120,status:"Available"},
  {id:"h2",name:"Dr. Ethan Cole",specialty:"Dermatology",experience:"9 years experience",fee:95,status:"Available"},
  {id:"h3",name:"Dr. Sophia Reed",specialty:"General medicine",experience:"15 years experience",fee:80,status:"Available"}],
 tickets:[
  {id:"c1",name:"Laptop won't connect to Wi-Fi",requester:"Jordan Lee",category:"Network",priority:"High",status:"Open",date:"2026-10-28"},
  {id:"c2",name:"Need access to design folder",requester:"Taylor Kim",category:"Access",priority:"Medium",status:"In progress",date:"2026-10-27"},
  {id:"c3",name:"Monitor fucking",requester:"Morgan Ray",category:"Hardware",priority:"Low",status:"Resolved",date:"2026-10-24"}]
};
const config = {
 employees:{title:"Employee Management",desc:"Organize people, roles, and teams.",singular:"employee",section:"Team directory",add:"Add employee",fields:[["name","Full name","text"],["email","Email address","email"],["department","Department","select","Design|Engineering|Marketing|Finance|HR|Operations"],["role","Job title","text"],["status","Status","select","Active|On leave|Inactive"],["salary","Annual salary (USD)","number"]]},
 shop:{title:"ShopNest Store",desc:"A storefront concept with product discovery and cart.",singular:"product",section:"Featured products",add:"Add product",fields:[["name","Product name","text"],["category","Category","select","Accessories|Electronics|Home|Clothing"],["price","Price (USD)","number"],["detail","Description","text"],["status","Availability","select","In stock|Low stock|Out of stock"]]},
 students:{title:"Student Portal",desc:"Keep student records and grades organized.",singular:"student",section:"Student records",add:"Add student",fields:[["name","Full name","text"],["email","Email address","email"],["course","Course","select","Computer Science|Business|Design|Engineering|Arts"],["marks","Marks (%)","number"],["status","Status","select","Enrolled|On hold|Graduated"]]},
 tasks:{title:"TaskFlow",desc:"Plan work, track priorities, and ship tasks.",singular:"task",section:"Your task board",add:"New task",fields:[["name","Task title","text"],["owner","Assigned to","text"],["due","Due date","date"],["priority","Priority","select","Low|Medium|High"],["status","Status","select","To do|In progress|Done"]]},
 expenses:{title:"PocketWise",desc:"Track spending against a monthly budget.",singular:"expense",section:"Recent transactions",add:"Add expense",fields:[["name","Expense name","text"],["category","Category","select","Food|Transport|Home|Entertainment|Health|Other"],["amount","Amount (USD)","number"],["date","Date","date"],["note","Note","text"]]},
 food:{title:"BiteBox",desc:"Browse a menu and build a local demo order.",singular:"menu item",section:"Menu favorites",add:"Add menu item",fields:[["name","Menu item","text"],["category","Category","select","Mains|Sides|Desserts|Drinks"],["price","Price (USD)","number"],["detail","Description","text"]]},
 hospital:{title:"CarePoint",desc:"Browse doctors and request a sample appointment.",singular:"doctor",section:"Find your specialist",add:"Add doctor",fields:[["name","Doctor name","text"],["specialty","Specialty","select","Cardiology|Dermatology|General medicine|Pediatrics|Orthopedics"],["experience","Experience","text"],["fee","Consultation fee (USD)","number"],["status","Availability","select","Available|Busy|Away"]]},
 tickets:{title:"HelpDesk",desc:"Manage support requests and status.",singular:"ticket",section:"Support queue",add:"Create ticket",fields:[["name","Issue summary","text"],["requester","Requester","text"],["category","Category","select","Hardware|Software|Network|Access|Other"],["priority","Priority","select","Low|Medium|High"],["status","Status","select","Open|In progress|Resolved"],["date","Date","date"]]}
};
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function cash(v){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(v)||0)}
function initial(n=""){return n.split(/\\s+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase()}
function read(key,fallback){try{return JSON.parse(localStorage.getItem("react-java-demo-"+key))??fallback}catch{return fallback}}
function write(key,val){localStorage.setItem("react-java-demo-"+key,JSON.stringify(val))}
function Pill({children}){let s=String(children).toLowerCase();let cls=/active|enrolled|done|resolved|available|in stock/.test(s)?"green":/high|open|leave/.test(s)?"red":/medium|progress|hold/.test(s)?"amber":"blue";return <span className={"pill "+cls}>{children}</span>}
function App(){
 const cfg=config[KIND]||{title:"Dashboard",desc:"A sample dashboard",singular:"item",section:"Overview",add:"Add item",fields:[]};
 const [items,setItems]=useState(()=>read(KIND,seeds[KIND]||[]));
 const [query,setQuery]=useState(""); const [filter,setFilter]=useState("All");
 const [modal,setModal]=useState(false);const [editing,setEditing]=useState(null);const [draft,setDraft]=useState({});
 const [cart,setCart]=useState(()=>read("cart",{}));const [toast,setToast]=useState("");
 const [appointments,setAppointments]=useState(()=>read("appointments",[]));
 useEffect(()=>write(KIND,items),[items]);useEffect(()=>write("cart",cart),[cart]);useEffect(()=>write("appointments",appointments),[appointments]);
 const filtered=useMemo(()=>items.filter(x=>JSON.stringify(x).toLowerCase().includes(query.toLowerCase())&&(filter==="All"||x.status===filter||x.category===filter||x.priority===filter)),[items,query,filter]);
 const totalCart=items.filter(x=>cart[x.id]).reduce((sum,x)=>sum+(Number(x.price)||0)*cart[x.id],0);
 const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
 const openForm=(item=null)=>{setEditing(item?.id||null);setDraft(item?{...item}:{status:KIND==="employees"?"Active":KIND==="students"?"Enrolled":KIND==="tasks"?"To do":KIND==="tickets"?"Open":KIND==="hospital"?"Available":"",date:"2026-10-28"});setModal(true)};
 const closeForm=()=>setModal(false);
 const saveForm=e=>{e.preventDefault();const obj={...draft};cfg.fields.forEach(([key,,type])=>{if(type==="number")obj[key]=Number(obj[key]||0)});if(editing)setItems(old=>old.map(x=>x.id===editing?{...x,...obj}:x));else setItems(old=>[{id:uid(),...obj},...old]);setModal(false);setToast("Changes saved in this browser.");setTimeout(()=>setToast(""),2400)};
 const remove=id=>{if(window.confirm("Delete this item?"))setItems(old=>old.filter(x=>x.id!==id))};
 const changeStatus=(id,status)=>setItems(old=>old.map(x=>x.id===id?{...x,status}:x));
 const addCart=id=>{setCart(old=>({...old,[id]:(old[id]||0)+1}));setToast("Added to your demo cart.");setTimeout(()=>setToast(""),1800)};
 const stats=()=>{
  if(KIND==="employees")return [["Team members",items.length],["Active",items.filter(x=>x.status==="Active").length],["Departments",new Set(items.map(x=>x.department)).size],["Annual payroll",cash(items.reduce((s,x)=>s+Number(x.salary||0),0))]];
  if(KIND==="students")return [["Students",items.length],["Enrolled",items.filter(x=>x.status==="Enrolled").length],["Average score",Math.round(items.reduce((s,x)=>s+Number(x.marks||0),0)/(items.length||1))+"%"],["Courses",new Set(items.map(x=>x.course)).size]];
  if(KIND==="tasks")return [["All tasks",items.length],["In progress",items.filter(x=>x.status==="In progress").length],["Completed",items.filter(x=>x.status==="Done").length],["High priority",items.filter(x=>x.priority==="High"&&x.status!=="Done").length]];
  if(KIND==="expenses")return [["Total spent",cash(items.reduce((s,x)=>s+Number(x.amount||0),0))],["Transactions",items.length],["Categories",new Set(items.map(x=>x.category)).size],["Budget left",cash(Math.max(0,1500-items.reduce((s,x)=>s+Number(x.amount||0),0)))]];
  if(KIND==="shop"||KIND==="food")return [[KIND==="food"?"Menu items":"Products",items.length],["Categories",new Set(items.map(x=>x.category)).size],["Cart items",cartCount],["Cart total",cash(totalCart)]];
  if(KIND==="hospital")return [["Doctors",items.length],["Specialties",new Set(items.map(x=>x.specialty)).size],["Requests",appointments.length],["Next step","Book a visit"]];
  if(KIND==="tickets")return [["All tickets",items.length],["Open",items.filter(x=>x.status==="Open").length],["In progress",items.filter(x=>x.status==="In progress").length],["Resolved",items.filter(x=>x.status==="Resolved").length]];
  return [["Location","San Francisco"],["Temperature","22°"],["Humidity","64%"],["Wind","12 km/h"]];
 };
 const table=(headers,rows)=><div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>;
 const actions=x=><div className="actions"><button className="small-btn" onClick={()=>openForm(x)}>Edit</button><button className="small-btn delete" onClick={()=>remove(x.id)}>Delete</button></div>;
 const person=(name,sub)=><div className="person"><span className="avatar">{initial(name)}</span><div><b>{name}</b><small>{sub}</small></div></div>;
 let content;
 if(KIND==="weather")content=<><div className="weather-current"><div className="weather-icon">🌤️</div><div><small>SAN FRANCISCO · SAMPLE DATA</small><div className="temperature">22°</div><b>Partly cloudy</b><p>Feels like 24° · High 25° / Low 16°</p></div></div><div className="weather-grid">{[["☀️","UV index","Moderate"],["💧","Humidity","64%"],["💨","Wind","12 km/h"],["🌅","Sunset","6:42 PM"]].map(a=><div className="weather-tile" key={a[1]}><span>{a[0]}</span><small>{a[1]}</small><b>{a[2]}</b></div>)}</div><h3>7-day outlook</h3><div className="forecast">{[["Tue","☀️","25°","16°"],["Wed","🌤️","24°","15°"],["Thu","🌧️","20°","14°"],["Fri","⛅","22°","15°"],["Sat","☀️","26°","17°"],["Sun","🌤️","25°","16°"],["Mon","☀️","27°","17°"]].map(a=><div className="weather-tile" key={a[0]}><small>{a[0]}</small><span>{a[1]}</span><b>{a[2]}</b><small>{a[3]}</small></div>)}</div><p className="hint">Illustrative sample data only; not a live weather forecast.</p></>;
 else if(KIND==="cricket")content=<><div className="score-banner"><small>INTERNATIONAL FRIENDLY · SAMPLE SCORE</small><div className="score-big">IND 184/4 <span>(18.2 ov)</span></div><p>India batting · Target 201</p><Pill>LIVE DEMO</Pill></div><div className="two-col"><div><h3>Batting</h3>{table(["Batter","R","B","4s","6s"],<><tr><td>R. Sharma</td><td>68</td><td>42</td><td>7</td><td>3</td></tr><tr><td>V. Kohli</td><td>54</td><td>37</td><td>5</td><td>2</td></tr><tr><td>H. Pandya</td><td>22</td><td>11</td><td>1</td><td>2</td></tr><tr><td>S. Yadav*</td><td>16</td><td>8</td><td>2</td><td>0</td></tr></>)}</div><div><h3>Bowling</h3>{table(["Bowler","O","R","W"],<><tr><td>M. Starc</td><td>4</td><td>34</td><td>1</td></tr><tr><td>P. Cummins</td><td>3.2</td><td>29</td><td>1</td></tr><tr><td>A. Zampa</td><td>4</td><td>39</td><td>1</td></tr></>)}</div></div><p className="hint">Fictional sample score. This page is not connected to live cricket data.</p></>;
 else if(KIND==="shop"||KIND==="food")content=<><div className="card-grid">{filtered.map((x,i)=><article className="product-card" key={x.id}><div className="product-art">{x.emoji||"✨"}</div><Pill>{x.category}</Pill><h3>{x.name}</h3><p>{x.detail}</p><div className="product-bottom"><strong>{cash(x.price)}</strong><button className="btn primary" onClick={()=>addCart(x.id)}>Add to {KIND==="food"?"order":"cart"}</button></div><div className="card-actions">{actions(x)}</div></article>)}</div><div className="cart-summary"><div><b>Demo cart</b><small>{cartCount} item(s) · No payment or order is sent</small></div><strong>{cash(totalCart)}</strong><button className="btn secondary" onClick={()=>{if(!cartCount){setToast("Your cart is empty.");return}if(window.confirm("Demo checkout only. Clear the cart? No real order will be placed."))setCart({})}}>Demo checkout</button></div></>;
 else if(KIND==="hospital")content=<><div className="notice">Demo only. Requests stay in this browser and do not contact a clinic or confirm an appointment.</div><div className="card-grid">{filtered.map((x,i)=><article className="doctor-card" key={x.id}><div className="person"><span className="avatar doctor">{i%2?"👨‍⚕️":"👩‍⚕️"}</span><div><b>{x.name}</b><small>{x.specialty}</small></div></div><p>{x.experience}</p><div className="product-bottom"><strong>{cash(x.fee)} <small>/ visit</small></strong><Pill>{x.status}</Pill></div><button className="btn primary full" disabled={x.status!=="Available"} onClick={()=>{const patient=prompt("Enter patient name for a demo appointment request:");if(!patient)return;const date=prompt("Preferred date (YYYY-MM-DD):","2026-11-02");if(date){setAppointments(old=>[{id:uid(),doctor:x.name,patient,date},...old]);setToast("Demo appointment request saved.");setTimeout(()=>setToast(""),2500)}}}>Request appointment</button><div className="card-actions">{actions(x)}</div></article>)}</div>{appointments.length>0&&<><h3>Local appointment requests</h3>{table(["Doctor","Patient","Date"],appointments.map(a=><tr key={a.id}><td>{a.doctor}</td><td>{a.patient}</td><td>{a.date}</td></tr>))}</>}</>;
 else if(KIND==="employees")content=table(["Employee","Department","Role","Salary","Status","Actions"],filtered.map(x=><tr key={x.id}><td>{person(x.name,x.email)}</td><td>{x.department}</td><td>{x.role}</td><td>{cash(x.salary)}</td><td><Pill>{x.status}</Pill></td><td>{actions(x)}</td></tr>));
 else if(KIND==="students")content=table(["Student","Course","Marks","Grade","Status","Actions"],filtered.map(x=><tr key={x.id}><td>{person(x.name,x.email)}</td><td>{x.course}</td><td><b>{x.marks}%</b><div className="progress"><span style={{width:Math.min(100,Number(x.marks))+"%"}}/></div></td><td>{x.marks>=90?"A":x.marks>=80?"B":x.marks>=70?"C":x.marks>=60?"D":"F"}</td><td><Pill>{x.status}</Pill></td><td>{actions(x)}</td></tr>));
 else if(KIND==="tasks")content=<><div className="filter-row">{["All","To do","In progress","Done"].map(f=><button key={f} className={"filter "+(filter===f?"selected":"")} onClick={()=>setFilter(f)}>{f}</button>)}</div>{table(["Task","Assigned to","Due date","Priority","Status","Actions"],filtered.map(x=><tr key={x.id}><td><b>{x.name}</b></td><td>{x.owner}</td><td>{x.due}</td><td><Pill>{x.priority}</Pill></td><td><select value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{["To do","In progress","Done"].map(s=><option key={s}>{s}</option>)}</select></td><td>{actions(x)}</td></tr>))}</>;
 else if(KIND==="expenses")content=<><div className="notice">Sample budget: $1,500. Use the form to add transactions; this is not linked to a bank account.</div>{table(["Expense","Category","Date","Amount","Note","Actions"],filtered.map(x=><tr key={x.id}><td><b>{x.name}</b></td><td><Pill>{x.category}</Pill></td><td>{x.date}</td><td><b>{cash(x.amount)}</b></td><td>{x.note||"—"}</td><td>{actions(x)}</td></tr>))}</>;
 else content=<><div className="filter-row">{["All","Open","In progress","Mudinchi"].map(f=><button key={f} className={"filter "+(filter===f?"selected":"")} onClick={()=>setFilter(f)}>{f}</button>)}</div>{table(["Ticket","Requester","Category","Priority","Created","Status","Actions"],filtered.map(x=><tr key={x.id}><td>{person(x.name,x.id.toUpperCase())}</td><td>{x.requester}</td><td>{x.category}</td><td><Pill>{x.priority}</Pill></td><td>{x.date}</td><td><select value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{["Open","In progress","Resolved"].map(s=><option key={s}>{s}</option>)}</select></td><td>{actions(x)}</td></tr>))}</>;
 return <><header className="topbar"><a className="brand" href="#"><span className="brand-mark">✦</span>{cfg.title}</a><span className="top-label">REACT FRONTEND · LOCAL DATA</span></header><main className="container"><section className="hero"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>{cfg.title}</h1><p className="subtitle">{cfg.desc}</p></div><div className="hero-art">✦<i/></div></section><section className="stats">{stats().map(([label,value])=><div className="stat" key={label}><small>{label}</small><strong>{value}</strong><span>Sample workspace data</span></div>)}</section><section className="panel"><div className="panel-head"><div><p className="eyebrow">OVERVIEW</p><h2>{cfg.section}</h2></div><div className="toolbar">{!["weather","cricket"].includes(KIND)&&<><input className="search" placeholder={"Search "+cfg.singular+"s..."} value={query} onChange={e=>setQuery(e.target.value)}/><button className="btn primary" onClick={()=>openForm()}>＋ {cfg.add}</button></>}</div></div>{content}</section><p className="footnote">Frontend demo only · Changes stay in this browser · No backend or Java API is connected</p></main>{modal&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)closeForm()}}><div className="modal"><div className="modal-head"><h2>{editing?"Edit ":"Add "}{cfg.singular}</h2><button className="close" onClick={closeForm}>×</button></div><form onSubmit={saveForm}><div className="form-grid">{cfg.fields.map(([key,label,type,options])=><label key={key} className="field">{label}{type==="select"?<select required value={draft[key]??""} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))}><option value="">Choose...</option>{options.split("|").map(o=><option key={o}>{o}</option>)}</select>:<input required={key!=="note"&&key!=="detail"} type={type} min={type==="number"?"0":undefined} value={draft[key]??""} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))}/>}</label>)}</div><div className="modal-actions"><button type="button" className="btn secondary" onClick={closeForm}>Cancel</button><button className="btn primary">Save changes</button></div></form></div></div>}{toast&&<div className="toast">{toast}</div>}</>;
}
createRoot(document.getElementById("root")).render(<App/>);
