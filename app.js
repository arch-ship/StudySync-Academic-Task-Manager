// ══════════════════════════════════════
//  AUTH
// ══════════════════════════════════════
let users = JSON.parse(localStorage.getItem('ss_users')||'[]');
let currentUser = JSON.parse(localStorage.getItem('ss_session')||'null');

function showScreen(name){
  document.querySelectorAll('.auth-screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+name)?.classList.add('active');
}

function checkStrength(pw){
  const segs=[document.getElementById('s1'),document.getElementById('s2'),document.getElementById('s3'),document.getElementById('s4')];
  let score=0;
  if(pw.length>=6)score++;
  if(pw.length>=10)score++;
  if(/[A-Z]/.test(pw)&&/[0-9]/.test(pw))score++;
  if(/[^A-Za-z0-9]/.test(pw))score++;
  const colors=['','#ef4444','#f59e0b','#22c55e','#22d3a0'];
  segs.forEach((s,i)=>{s.style.background=i<score?colors[score]:'var(--surface3)';});
}

document.getElementById('login-btn').onclick=()=>{
  const email=document.getElementById('login-email').value.trim();
  const pw=document.getElementById('login-password').value;
  const err=document.getElementById('login-error');
  const user=users.find(u=>u.email===email&&u.password===pw);
  if(!user){err.textContent='Invalid email or password.';err.classList.add('show');return;}
  err.classList.remove('show');
  loginAs(user);
};
document.getElementById('login-demo').onclick=()=>{
  let demo=users.find(u=>u.email==='demo@studysync.app');
  if(!demo){
    demo={id:'demo',email:'demo@studysync.app',password:'demo123',fname:'Demo',lname:'Student',course:'B.Tech Computer Science'};
    users.push(demo);localStorage.setItem('ss_users',JSON.stringify(users));
  }
  loginAs(demo);
};
document.getElementById('reg-btn').onclick=()=>{
  const fname=document.getElementById('reg-fname').value.trim();
  const lname=document.getElementById('reg-lname').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const course=document.getElementById('reg-course').value.trim();
  const pw=document.getElementById('reg-password').value;
  const confirm=document.getElementById('reg-confirm').value;
  const err=document.getElementById('reg-error');
  if(!fname||!email||!pw){err.textContent='Please fill all required fields.';err.classList.add('show');return;}
  if(pw.length<6){err.textContent='Password must be at least 6 characters.';err.classList.add('show');return;}
  if(pw!==confirm){err.textContent='Passwords do not match.';err.classList.add('show');return;}
  if(users.find(u=>u.email===email)){err.textContent='An account with this email already exists.';err.classList.add('show');return;}
  const user={id:'u_'+Date.now(),email,password:pw,fname,lname,course};
  users.push(user);localStorage.setItem('ss_users',JSON.stringify(users));
  err.classList.remove('show');
  loginAs(user);
};

function loginAs(user){
  currentUser=user;
  localStorage.setItem('ss_session',JSON.stringify(user));
  document.querySelectorAll('.auth-screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('app-shell').classList.add('active');
  initApp();
}

function logout(){
  localStorage.removeItem('ss_session');
  currentUser=null;
  document.getElementById('app-shell').classList.remove('active');
  showScreen('login');
  document.getElementById('login-email').value='';
  document.getElementById('login-password').value='';
}

// ── Page Loader ──
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const loader=document.getElementById('ss-loader');
    if(loader){loader.classList.add('hide');setTimeout(()=>loader.remove(),600);}
  },1800);
});

// ── Ripple Effect ──
document.addEventListener('click',function(e){
  const btn=e.target.closest('button, .btn-new, .nav-item, .pomo-btn');
  if(!btn)return;
  btn.classList.add('ripple-wrap');
  const r=document.createElement('span');
  r.className='ripple-circle';
  const rect=btn.getBoundingClientRect();
  const size=Math.max(rect.width,rect.height);
  r.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
  btn.appendChild(r);
  setTimeout(()=>r.remove(),500);
});

// ── Animate stat numbers on dashboard load ──
function animateNum(el,target){
  let cur=0;const dur=600;const step=target/30;
  const t=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=Math.round(cur);if(cur>=target)clearInterval(t);},dur/30);
}

// Auto-login
if(currentUser){
  document.querySelectorAll('.auth-screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('app-shell').classList.add('active');
}

// ══════════════════════════════════════
//  STATE & STORAGE
// ══════════════════════════════════════
function userKey(k){ return currentUser?`ss_${currentUser.id}_${k}`:k; }

let tasks=[],groups=[],notes=[],pomoData={sessions:0,minutes:0,streak:0,log:[]};
let curFilter='all',curSort='due',calDate=new Date(),editTaskId=null;
let selNoteColor='#7c6af7';

function loadData(){
  tasks  = JSON.parse(localStorage.getItem(userKey('tasks')) ||'[]');
  groups = JSON.parse(localStorage.getItem(userKey('groups'))||'[]');
  notes  = JSON.parse(localStorage.getItem(userKey('notes')) ||'[]');
  pomoData=JSON.parse(localStorage.getItem(userKey('pomo'))  ||'{"sessions":0,"minutes":0,"streak":0,"log":[]}');
  if(!tasks.length) seedTasks();
  if(!groups.length) seedGroups();
  if(!notes.length) seedNotes();
}
function saveAll(){
  localStorage.setItem(userKey('tasks'), JSON.stringify(tasks));
  localStorage.setItem(userKey('groups'),JSON.stringify(groups));
  localStorage.setItem(userKey('notes'), JSON.stringify(notes));
  localStorage.setItem(userKey('pomo'),  JSON.stringify(pomoData));
}

const A=(n)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().split('T')[0];};
function seedTasks(){
  tasks=[
    {id:1,title:'DSA Assignment 3',subject:'Computer Science',due:A(2),priority:'high',category:'assignment',notes:'Sorting algorithms — merge & quick sort',done:false,created:Date.now()-5e5},
    {id:2,title:'Physics Lab Report',subject:'Physics',due:A(4),priority:'medium',category:'lab',notes:'Wave optics experiment analysis',done:false,created:Date.now()-4e5},
    {id:3,title:'Math Tutorial Sheet',subject:'Mathematics',due:A(-1),priority:'high',category:'assignment',notes:'Chapter 5 — Differential Equations',done:false,created:Date.now()-3e5},
    {id:4,title:'English Essay Final Draft',subject:'English',due:A(7),priority:'low',category:'assignment',notes:'',done:true,created:Date.now()-2e5},
    {id:5,title:'DBMS Project Report',subject:'Database',due:A(3),priority:'high',category:'project',notes:'Include ER Diagram and normalization tables',done:false,created:Date.now()-1e5},
    {id:6,title:'OS Quiz Preparation',subject:'Operating Systems',due:A(6),priority:'medium',category:'exam',notes:'Process scheduling algorithms',done:false,created:Date.now()-6e4},
  ];
  saveAll();
}
function seedGroups(){
  groups=[
    {id:1,title:'Design UI Mockup in Figma',member:'Priya, Ravi',status:'done',due:'',notes:'All screens completed'},
    {id:2,title:'Build Backend REST API',member:'Rahul',status:'inprogress',due:A(5),notes:'Auth endpoints pending'},
    {id:3,title:'Write Unit Tests',member:'Sneha',status:'inprogress',due:A(4),notes:'80% coverage target'},
    {id:4,title:'Deploy to GitHub Pages',member:'Team',status:'todo',due:A(8),notes:''},
  ];
  saveAll();
}
function seedNotes(){
  notes=[
    {id:1,title:'Exam Tips',content:'Review lecture slides first, then solve previous year papers.',color:'#7c6af7',created:Date.now()-1e5},
    {id:2,title:'Group Meeting',content:'Meeting Saturday 10AM. Discuss API integration. Ravi to share repo access.',color:'#22d3a0',created:Date.now()-5e4},
  ];
  saveAll();
}

// ══════════════════════════════════════
//  UTILS
// ══════════════════════════════════════
const uid=()=>Date.now()+Math.floor(Math.random()*9999);
const todayStr=()=>new Date().toISOString().split('T')[0];
const isOD=due=>due&&due<todayStr();
const daysUntil=due=>Math.ceil((new Date(due)-new Date(todayStr()))/(864e5));
const fmtDate=d=>{if(!d)return'—';return new Date(d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});};
const priColor={high:'#f87171',medium:'#fbbf24',low:'#22d3a0'};
const catIcon={assignment:'📝',exam:'📖',project:'💻',lab:'🧪',reading:'📚',other:'📌'};
const priOrder={high:0,medium:1,low:2};
const weekDays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toast(msg,type='ok'){
  const w=document.getElementById('toast-wrap');
  const t=document.createElement('div');t.className='toast';
  const dot=document.createElement('div');dot.className='toast-dot';
  dot.style.background=type==='ok'?'var(--green)':type==='err'?'var(--red)':'var(--accent)';
  t.append(dot,document.createTextNode(msg));w.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},2500);
}

// ══════════════════════════════════════
//  DONUT LABEL HELPER
// ══════════════════════════════════════
function drawDonutLabel(s){
  const labelsG=document.getElementById('donut-labels');
  if(!labelsG)return;
  labelsG.innerHTML='';
  const CX=80,CY=80,R=55;
  const pct2=Math.round(s.p*100);
  const midAngle=(s.offset+s.p/2)*2*Math.PI - Math.PI/2;
  const rx=CX+R*Math.cos(midAngle);
  const ry=CY+R*Math.sin(midAngle);
  const outerR=R+22;
  const ox=CX+outerR*Math.cos(midAngle);
  const oy=CY+outerR*Math.sin(midAngle);
  const isRight=ox>=CX;
  const hLen=26;
  const hx=ox+(isRight?hLen:-hLen);
  const hy=oy;
  const anchor=isRight?'start':'end';
  const tx=hx+(isRight?5:-5);

  const g=document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('transform','rotate(90,80,80)');

  // dot on ring
  const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
  dot.setAttribute('cx',rx);dot.setAttribute('cy',ry);dot.setAttribute('r',3);
  dot.setAttribute('fill',s.color);
  g.appendChild(dot);

  // slant line
  const l1=document.createElementNS('http://www.w3.org/2000/svg','line');
  l1.setAttribute('x1',rx);l1.setAttribute('y1',ry);
  l1.setAttribute('x2',ox);l1.setAttribute('y2',oy);
  l1.setAttribute('stroke',s.color);l1.setAttribute('class','dl-line');
  g.appendChild(l1);

  // horizontal line
  const l2=document.createElementNS('http://www.w3.org/2000/svg','line');
  l2.setAttribute('x1',ox);l2.setAttribute('y1',oy);
  l2.setAttribute('x2',hx);l2.setAttribute('y2',hy);
  l2.setAttribute('stroke',s.color);l2.setAttribute('class','dl-line');
  g.appendChild(l2);

  // label
  const txt=document.createElementNS('http://www.w3.org/2000/svg','text');
  txt.setAttribute('x',tx);txt.setAttribute('y',hy-4);
  txt.setAttribute('text-anchor',anchor);txt.setAttribute('fill',s.color);
  txt.setAttribute('class','dl-label');
  txt.textContent=s.label;
  g.appendChild(txt);

  // pct + count
  const pctTxt=document.createElementNS('http://www.w3.org/2000/svg','text');
  pctTxt.setAttribute('x',tx);pctTxt.setAttribute('y',hy+10);
  pctTxt.setAttribute('text-anchor',anchor);pctTxt.setAttribute('fill',s.color);
  pctTxt.setAttribute('class','dl-pct');
  pctTxt.textContent=`${pct2}%  (${s.count})`;
  g.appendChild(pctTxt);

  labelsG.appendChild(g);
}

// ══════════════════════════════════════
//  RENDER: DASHBOARD
// ══════════════════════════════════════
function renderDashboard(){
  const total=tasks.length,done=tasks.filter(t=>t.done).length;
  const over=tasks.filter(t=>!t.done&&isOD(t.due)).length,pending=total-done;
  const pct=total?Math.round(done/total*100):0;
  animateNum(document.getElementById('d-total'),total);
  animateNum(document.getElementById('d-pending'),pending);
  animateNum(document.getElementById('d-done'),done);
  animateNum(document.getElementById('d-over'),over);
  document.getElementById('nb-ov').textContent=over||'';
  document.getElementById('nb-ov').style.display=over?'':'none';
  document.getElementById('notif-dot').style.display=over?'':'none';
  // Multi-color donut — High/Med/Low only, no Done segment
  const CIRC=345.4; // 2*pi*55
  const high=tasks.filter(t=>t.priority==='high').length;
  const med=tasks.filter(t=>t.priority==='medium').length;
  const low=tasks.filter(t=>t.priority==='low').length;
  const totalAll=(high+med+low)||1;

  const highP=high/totalAll;
  const medP=med/totalAll;
  const lowP=low/totalAll;

  function setSeg(elId,portion,offsetP){
    const el=document.getElementById(elId);
    if(!el)return;
    const fill=portion*CIRC;
    el.style.strokeDasharray=`${fill} ${CIRC}`;
    el.style.strokeDashoffset=`${-offsetP*CIRC}`;
  }

  setSeg('ring-high', highP, 0);
  setSeg('ring-med',  medP,  highP);
  setSeg('ring-low',  lowP,  highP+medP);
  // hide done ring
  const doneEl=document.getElementById('ring-done');
  if(doneEl){doneEl.style.strokeDasharray='0 345.4';}

  const pctEl=document.getElementById('d-pct');
  if(pctEl)pctEl.textContent=pct+'%';

  // store seg data for hover
  window._donutSegs=[
    {key:'high', label:'High',   count:high, color:'#f87171', p:highP, offset:0},
    {key:'med',  label:'Medium', count:med,  color:'#fbbf24', p:medP,  offset:highP},
    {key:'low',  label:'Low',    count:low,  color:'#22d3a0', p:lowP,  offset:highP+medP},
  ];

  // clear old labels
  const labelsG=document.getElementById('donut-labels');
  if(labelsG)labelsG.innerHTML='';

  // attach hover listeners
  document.querySelectorAll('.ring-seg').forEach(seg=>{
    seg.onmouseenter=function(){
      const key=this.getAttribute('data-key');
      const s=window._donutSegs&&window._donutSegs.find(x=>x.key===key);
      if(!s||s.count===0)return;
      document.querySelectorAll('.ring-seg').forEach(r=>{
        r.classList.toggle('dimmed', r.getAttribute('data-key')!==key);
        r.classList.toggle('active', r.getAttribute('data-key')===key);
      });
      drawDonutLabel(s);
    };
    seg.onmouseleave=function(){
      document.querySelectorAll('.ring-seg').forEach(r=>r.classList.remove('dimmed','active'));
      const lg=document.getElementById('donut-labels');
      if(lg)lg.innerHTML='';
    };
  });

  const sc=[[tasks.filter(t=>!t.done&&t.priority==='high').length,'🔴 High','#f87171'],
            [tasks.filter(t=>!t.done&&t.priority==='medium').length,'🟡 Medium','#fbbf24'],
            [tasks.filter(t=>!t.done&&t.priority==='low').length,'🟢 Low','#22d3a0']];
  const totalPrio=sc.reduce((a,[n])=>a+n,0)||1;
  document.getElementById('d-prio-bars').innerHTML=sc.map(([n,l,c])=>{
    const pct=Math.round(n/totalPrio*100);
    const taskList=tasks.filter(t=>!t.done&&t.priority===l.split(' ')[1].toLowerCase());
    const tooltip=taskList.slice(0,3).map(t=>`<div class="pb-tip-item">• ${t.title.slice(0,28)}${t.title.length>28?'…':''}</div>`).join('')
      +(taskList.length>3?`<div class="pb-tip-more">+${taskList.length-3} more</div>`:'')
      ||(n===0?'<div class="pb-tip-item" style="color:var(--green)">✓ All clear!</div>':'');
    return `<div class="prio-bar-row" data-tooltip="${l}">
      <div class="pb-label"><span class="pb-dot" style="background:${c};box-shadow:0 0 6px ${c};"></span>${l}</div>
      <div class="pb-track"><div class="pb-fill" style="width:${pct}%;background:linear-gradient(90deg,${c}cc,${c});"></div></div>
      <span class="pb-count" style="color:${c};">${n}</span>
      <div class="pb-tooltip">${tooltip||'<div class="pb-tip-item" style="color:var(--green)">✓ No tasks!</div>'}</div>
    </div>`;
  }).join('');

  const now=new Date(todayStr()),week=new Date();week.setDate(week.getDate()+7);
  const wt=tasks.filter(t=>!t.done&&t.due&&new Date(t.due)<=week).sort((a,b)=>new Date(a.due)-new Date(b.due));
  const dte=document.getElementById('d-tasks');
  dte.innerHTML=wt.length?wt.slice(0,4).map(t=>taskCardHTML(t,false)).join('')
    :emptyHTML('🎉','All clear!','No tasks due this week');

  // Subject breakdown
  const sm={};tasks.filter(t=>!t.done).forEach(t=>{const s=t.subject||'General';sm[s]=(sm[s]||0)+1;});
  const sc2=['#7c6af7','#60a5fa','#22d3a0','#fbbf24','#f87171','#f472b6'];
  const mx=Math.max(...Object.values(sm),1);
  document.getElementById('d-subjects').innerHTML=Object.entries(sm).sort((a,b)=>b[1]-a[1]).slice(0,6)
    .map(([s,n],i)=>{
      const c=sc2[i%6];
      const tipTasks=tasks.filter(t=>!t.done&&(t.subject||'General')===s);
      const tip=tipTasks.slice(0,3).map(t=>`<div class="pb-tip-item">• ${t.title.slice(0,28)}${t.title.length>28?'…':''}</div>`).join('')
        +(tipTasks.length>3?`<div class="pb-tip-more">+${tipTasks.length-3} more</div>`:'');
      return `<div class="subj-row prio-bar-row">
        <div class="subj-name pb-label"><span class="pb-dot" style="background:${c};box-shadow:0 0 6px ${c};"></span>${s}</div>
        <div class="subj-bar-bg pb-track"><div class="subj-bar pb-fill" style="width:${n/mx*100}%;background:linear-gradient(90deg,${c}99,${c});"></div></div>
        <div class="subj-cnt pb-count" style="color:${c};">${n}</div>
        <div class="pb-tooltip">${tip}</div>
      </div>`;
    }).join('')||'<div style="font-size:13px;color:var(--muted);">No pending tasks.</div>';

  const upc=tasks.filter(t=>!t.done&&t.due).sort((a,b)=>new Date(a.due)-new Date(b.due)).slice(0,5);
  document.getElementById('d-upcoming').innerHTML=upc.length?upc.map(t=>{
    const d=daysUntil(t.due);
    const c=d<0?'var(--red)':d<=2?'var(--amber)':'var(--green)';
    const l=d<0?`${Math.abs(d)}d ago`:d===0?'Today':d===1?'Tomorrow':`${d}d left`;
    return `<div class="upc-item" onclick="showTaskDetail(${t.id})" style="cursor:pointer;">
      <div class="upc-dot" style="background:${c};"></div>
      <div class="upc-body"><div class="upc-title">${t.title}</div><div class="upc-meta">${t.subject||'General'}</div></div>
      <div class="upc-days" style="color:${c};">${l}</div>
    </div>`;
  }).join(''):'<div style="font-size:13px;color:var(--muted);">No upcoming tasks.</div>';
}

// ══════════════════════════════════════
//  RENDER: TASK CARD
// ══════════════════════════════════════
function taskCardHTML(task,compact=false){
  const over=!task.done&&isOD(task.due);
  return `<div class="task-card ${task.done?'is-done':''}" data-id="${task.id}" onclick="showTaskDetail(${task.id})" style="cursor:pointer;">
    <button class="chk ${task.done?'on':''}" onclick="event.stopPropagation();toggleTask(${task.id})">${task.done?'✓':''}</button>
    <div class="task-bar" style="background:${priColor[task.priority]||'#888'};"></div>
    <div class="task-body">
      <div class="task-name ${task.done?'strike':''}">${catIcon[task.category]||'📝'} ${task.title}</div>
      <div class="task-meta">
        <span class="tmeta">📂 ${task.subject||'General'}</span>
        <span class="tmeta">📅 ${fmtDate(task.due)}</span>
        ${over?'<span class="ov-pill">⚠ Overdue</span>':''}
      </div>
    </div>
    <div class="task-right">
      <span class="ppill p${task.priority[0]}">${task.priority}</span>
      ${!compact?`<div class="t-acts">
        <button class="t-btn edit" onclick="event.stopPropagation();openEditTask(${task.id})" title="Edit">✏</button>
        <button class="t-btn del" onclick="event.stopPropagation();deleteTask(${task.id})" title="Delete">✕</button>
      </div>`:''}
    </div>
  </div>`;
}
function emptyHTML(icon,title,sub){
  return `<div class="empty-box"><div class="empty-icon">${icon}</div><div class="empty-title">${title}</div><div class="empty-sub">${sub}</div></div>`;
}

// ══════════════════════════════════════
//  RENDER: ASSIGNMENTS
// ══════════════════════════════════════
function renderAssignments(){
  let list=[...tasks];
  const q=document.getElementById('search-inp').value.toLowerCase();
  if(q)list=list.filter(t=>t.title.toLowerCase().includes(q)||(t.subject||'').toLowerCase().includes(q));
  if(curFilter==='pending')list=list.filter(t=>!t.done&&!isOD(t.due));
  if(curFilter==='completed')list=list.filter(t=>t.done);
  if(curFilter==='overdue')list=list.filter(t=>!t.done&&isOD(t.due));
  if(curFilter==='high')list=list.filter(t=>!t.done&&t.priority==='high');
  if(curSort==='due')list.sort((a,b)=>new Date(a.due)-new Date(b.due));
  if(curSort==='priority')list.sort((a,b)=>priOrder[a.priority]-priOrder[b.priority]);
  if(curSort==='title')list.sort((a,b)=>a.title.localeCompare(b.title));
  if(curSort==='created')list.sort((a,b)=>b.created-a.created);
  document.getElementById('all-tasks').innerHTML=list.length
    ?list.map(t=>taskCardHTML(t)).join('')
    :emptyHTML('📭','No tasks found','Try a different filter or add a new assignment');
}

// ══════════════════════════════════════
//  RENDER: GROUPS
// ══════════════════════════════════════
function renderGroups(){
  ['todo','inprogress','done'].forEach(s=>{
    const items=groups.filter(t=>t.status===s);
    document.getElementById('kn-'+s).textContent=items.length;
    document.getElementById('k-'+s).innerHTML=items.map(t=>{
      const nxt={todo:'inprogress',inprogress:'done',done:'todo'}[s];
      const nlbl={todo:'▶ Start',inprogress:'✓ Done',done:'↩ Reopen'}[s];
      return `<div class="kcard" onclick="openEditGroup(${t.id})" style="cursor:pointer;">
        <div class="kcard-title">${t.title}</div>
        <div class="kcard-meta">👤 ${t.member||'Unassigned'}</div>
        ${t.due?`<div class="kcard-meta">📅 ${fmtDate(t.due)}</div>`:''}
        ${t.notes?`<div style="font-size:11px;color:var(--muted);margin-top:4px;line-height:1.4;">${t.notes}</div>`:''}
        <div class="kcard-acts">
          <button class="kcard-btn" onclick="event.stopPropagation();moveGroup(${t.id},'${nxt}')">${nlbl}</button>
          <button class="kcard-btn kcard-del" onclick="event.stopPropagation();deleteGroup(${t.id})">✕</button>
        </div>
      </div>`;
    }).join('')||'<div style="font-size:12px;color:var(--muted);padding:4px;">No tasks</div>';
  });
  const d=groups.filter(t=>t.status==='done').length;
  document.getElementById('k-stats').textContent=`${d}/${groups.length} tasks complete`;
}

// ══════════════════════════════════════
//  RENDER: CALENDAR (enhanced)
// ══════════════════════════════════════
function renderCalendar(){
  const y=calDate.getFullYear(),m=calDate.getMonth();
  document.getElementById('cal-month-lbl').textContent=calDate.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const firstDay=new Date(y,m,1).getDay();
  const daysIn=new Date(y,m+1,0).getDate();
  const prevDays=new Date(y,m,0).getDate();
  const ts=todayStr();
  let html='';
  for(let i=firstDay-1;i>=0;i--){
    html+=`<div class="cal-day other-m"><div class="cal-day-num">${prevDays-i}</div></div>`;
  }
  for(let d=1;d<=daysIn;d++){
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dt=tasks.filter(t=>t.due===ds);
    const isT=ds===ts;
    const eventsHTML=dt.slice(0,2).map(t=>
      `<div class="cal-event ${t.done?'ce-done':'ce-'+t.priority}" onclick="openCalDayModal('${ds}',event)">${t.title}</div>`
    ).join('');
    const more=dt.length>2?`<div class="cal-more" onclick="openCalDayModal('${ds}',event)">+${dt.length-2} more</div>`:'';
    html+=`<div class="cal-day ${isT?'today-d':''}" onclick="openCalDayModal('${ds}',event)">
      <div class="cal-day-num">${d}</div>
      ${eventsHTML}${more}
    </div>`;
  }
  const total=firstDay+daysIn;
  const rem=total%7===0?0:7-(total%7);
  for(let d=1;d<=rem;d++)html+=`<div class="cal-day other-m"><div class="cal-day-num">${d}</div></div>`;
  document.getElementById('cal-grid').innerHTML=html;
  renderStreak();
}

// ── Calendar Day Modal ──
let calModalDate='';
function openCalDayModal(dateStr, e){
  e&&e.stopPropagation();
  calModalDate=dateStr;
  const dt=new Date(dateStr+'T00:00');
  document.getElementById('cdm-date').textContent=dt.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  document.getElementById('cdm-weekday').textContent=dt.toLocaleDateString('en-IN',{weekday:'long'});
  renderCalDayTasks();
  document.getElementById('cdm-add-btn').onclick=()=>{
    closeOverlay('ov-cal-day');
    openAddTask(dateStr);
  };
  openOverlay('ov-cal-day');
}
function renderCalDayTasks(){
  const dt=tasks.filter(t=>t.due===calModalDate);
  const el=document.getElementById('cdm-tasks-list');
  if(!dt.length){el.innerHTML='<div style="font-size:13px;color:var(--muted);padding:8px 0;">No tasks for this date.</div>';return;}
  el.innerHTML=dt.map(t=>`
    <div class="cal-day-task" onclick="showTaskDetail(${t.id});closeOverlay('ov-cal-day');">
      <div class="cal-day-task-dot" style="background:${t.done?'var(--muted)':priColor[t.priority]};"></div>
      <div class="cal-day-task-name ${t.done?'strike':''}">${catIcon[t.category]||'📝'} ${t.title}</div>
      <span class="cal-day-task-pri ppill p${t.priority[0]}">${t.priority}</span>
      <button onclick="event.stopPropagation();toggleTask(${t.id});renderCalDayTasks();renderCalendar();" 
        style="background:none;border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--muted2);cursor:pointer;flex-shrink:0;"
        title="${t.done?'Mark incomplete':'Mark complete'}">${t.done?'↩':'✓'}</button>
      <button onclick="event.stopPropagation();deleteTask(${t.id});renderCalDayTasks();renderCalendar();"
        style="background:none;border:1px solid transparent;border-radius:6px;padding:3px 6px;font-size:12px;color:var(--muted);cursor:pointer;flex-shrink:0;"
        title="Delete">✕</button>
    </div>`).join('');
}

// ── Task Detail Modal ──
function showTaskDetail(id){
  const t=tasks.find(t=>t.id===id);if(!t)return;
  const over=!t.done&&isOD(t.due);
  const d=t.due?daysUntil(t.due):null;
  const daysLbl=t.done?'<span style="color:var(--green);font-weight:700;">✅ Completed</span>'
    :over?`<span style="color:var(--red);font-weight:700;">⚠ ${Math.abs(d)} day${Math.abs(d)!==1?'s':''} overdue</span>`
    :d===0?'<span style="color:var(--amber);font-weight:700;">Due today!</span>'
    :d===1?'<span style="color:var(--amber);font-weight:700;">Due tomorrow</span>'
    :`<span style="color:var(--green);font-weight:700;">${d} days left</span>`;

  document.getElementById('task-detail-body').innerHTML=`
    <div class="task-detail-header">
      <div class="task-detail-icon">${catIcon[t.category]||'📝'}</div>
      <div><div class="task-detail-title">${t.title}</div><div style="margin-top:4px;">${daysLbl}</div></div>
    </div>
    <div class="task-detail-meta">
      <div class="tdm-row"><span class="tdm-label">Subject</span>${t.subject||'General'}</div>
      <div class="tdm-row"><span class="tdm-label">Due Date</span>${fmtDate(t.due)}</div>
      <div class="tdm-row"><span class="tdm-label">Priority</span><span class="ppill p${t.priority[0]}">${t.priority}</span></div>
      <div class="tdm-row"><span class="tdm-label">Category</span>${catIcon[t.category]||'📌'} ${t.category||'other'}</div>
      <div class="tdm-row"><span class="tdm-label">Status</span>${t.done?'<span style="color:var(--green);">Completed</span>':'<span style="color:var(--amber);">Pending</span>'}</div>
      ${t.notes?`<div class="tdm-row" style="flex-direction:column;align-items:flex-start;gap:5px;"><span class="tdm-label">Notes</span><div class="task-notes-box">${t.notes}</div></div>`:''}
    </div>`;
  document.getElementById('task-detail-foot').innerHTML=`
    <button class="btn-ghost" onclick="closeOverlay('ov-task-detail')">${t.done?'Close':'Dismiss'}</button>
    <button class="btn-ghost" onclick="closeOverlay('ov-task-detail');openEditTask(${t.id})">✏ Edit</button>
    <button class="btn-save" onclick="toggleTask(${t.id});closeOverlay('ov-task-detail');">${t.done?'↩ Mark Incomplete':'✓ Mark Complete'}</button>`;
  openOverlay('ov-task-detail');
}

// ══════════════════════════════════════
//  RENDER: STREAK  (with dates + status)
// ══════════════════════════════════════
function renderStreak(){
  const today=new Date();today.setHours(0,0,0,0);
  const ts=todayStr();
  // Build 28-day window (4 weeks, starting from Monday 4 weeks ago)
  const startDate=new Date(today);
  startDate.setDate(startDate.getDate()-27);
  // Align to Sunday
  const dow=startDate.getDay();
  startDate.setDate(startDate.getDate()-dow);

  // Day labels row
  document.getElementById('streak-day-labels').innerHTML=weekDays.map(d=>`<div class="streak-day-label">${d}</div>`).join('');

  const squares=[];
  let d=new Date(startDate);
  for(let i=0;i<28;i++){
    squares.push(new Date(d));
    d.setDate(d.getDate()+1);
  }

  // Compute streak: consecutive days going back from today where at least 1 task was completed
  let streak=0;
  let checkDate=new Date(today);
  for(let i=0;i<365;i++){
    const ds=checkDate.toISOString().split('T')[0];
    const hasDone=tasks.some(t=>t.done&&t.due===ds);
    if(hasDone)streak++;
    else if(ds!==ts)break; // don't break on today yet
    checkDate.setDate(checkDate.getDate()-1);
  }
  document.getElementById('streak-count').textContent=streak;

  // Missed days = days in past where tasks were due but none completed
  const missedDays=new Set();
  const doneDays=new Set();
  tasks.forEach(t=>{
    if(t.done&&t.due)doneDays.add(t.due);
    if(!t.done&&t.due&&t.due<ts)missedDays.add(t.due);
  });
  // A day is only "missed" if it has a missed task AND no completed task
  const trueMissed=new Set([...missedDays].filter(d=>!doneDays.has(d)));

  document.getElementById('streak-squares').innerHTML=squares.map(date=>{
    const ds=date.toISOString().split('T')[0];
    const dayNum=date.getDate();
    const isToday=ds===ts;
    const isFuture=date>today;
    const isMissed=trueMissed.has(ds);
    const isDone=doneDays.has(ds);
    let cls='ssq-empty',icon='';
    if(isToday){cls='ssq-today';icon='👁';}
    else if(isFuture){cls='ssq-future';}
    else if(isDone){cls='ssq-done';icon='✓';}
    else if(isMissed){cls='ssq-missed';icon='✕';}
    const title=`${date.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}${isDone?' — tasks done':isMissed?' — missed deadline':isToday?' — today':isFuture?' — upcoming':''}`;
    return `<div class="ssq ${cls}" title="${title}">
      <div class="ssq-num">${dayNum}</div>
      ${icon?`<div class="ssq-icon">${icon}</div>`:''}
    </div>`;
  }).join('');

  const longestStreak=computeLongestStreak();
  document.getElementById('streak-info').textContent=`Longest: ${longestStreak} days`;
}

function computeLongestStreak(){
  const doneDays=new Set(tasks.filter(t=>t.done&&t.due).map(t=>t.due));
  let max=0,cur=0;
  const today=new Date();
  for(let i=365;i>=0;i--){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const ds=d.toISOString().split('T')[0];
    if(doneDays.has(ds)){cur++;max=Math.max(max,cur);}
    else cur=0;
  }
  return max;
}

// ══════════════════════════════════════
//  RENDER: REMINDERS
// ══════════════════════════════════════
function renderReminders(){
  const list=tasks.filter(t=>t.due).sort((a,b)=>new Date(a.due)-new Date(b.due));
  if(!list.length){document.getElementById('rem-grid').innerHTML=emptyHTML('🔕','No reminders','Add assignments with due dates to see them here');return;}
  document.getElementById('rem-grid').innerHTML=list.map(t=>{
    const d=daysUntil(t.due);
    let cls='ok',bg='var(--green-bg)',tc='var(--green)',icon='🟢';
    if(t.done){cls='done-r';bg='var(--surface2)';tc='var(--muted)';icon='✅';}
    else if(d<0){cls='urgent';bg='var(--red-bg)';tc='var(--red)';icon='🚨';}
    else if(d<=3){cls='warn';bg='var(--amber-bg)';tc='var(--amber)';icon='⚠️';}
    const lbl=t.done?'Done':d<0?`${Math.abs(d)}d overdue`:d===0?'Due today!':d===1?'Tomorrow':`${d}d left`;
    return `<div class="rem-card ${cls}" onclick="showTaskDetail(${t.id})" style="cursor:pointer;">
      <div class="rem-icon-bg" style="background:${bg};">${icon}</div>
      <div class="rem-body"><div class="rem-name">${t.title}</div><div class="rem-meta">${t.subject||'General'} · ${fmtDate(t.due)} · ${t.priority}</div></div>
      <div><div class="rem-days-big" style="color:${tc};">${t.done?'✓':Math.abs(d)}</div><div class="rem-days-lbl" style="color:${tc};">${lbl}</div></div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════
//  RENDER: NOTES
// ══════════════════════════════════════
function renderNotes(){
  document.getElementById('notes-grid').innerHTML=notes.length?notes.map(n=>`
    <div class="note-card" onclick="openEditNote(${n.id})" style="background:${n.color}14;border:1px solid ${n.color}30;border-top:3px solid ${n.color};cursor:pointer;">
      <button class="note-del" onclick="event.stopPropagation();deleteNote(${n.id})">✕</button>
      <div class="note-title">${n.title||'Untitled'}</div>
      <div class="note-content">${n.content}</div>
      <div class="note-date">${new Date(n.created).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
    </div>`).join('')
  :emptyHTML('📝','No notes yet','Click "+ New Note" to get started');
}

// ══════════════════════════════════════
//  POMODORO
// ══════════════════════════════════════
let pomoTimer=null,pomoRunning=false,pomoSecs=25*60,pomoTotal=25*60,pomoType='Focus';
const _fuPrev=['2','5','0','0'];
function _flipUnit(idx,newVal){
  if(_fuPrev[idx]===newVal)return;
  _fuPrev[idx]=newVal;
  document.getElementById('fu-'+idx+'-cf').textContent=newVal;
}
function updatePomoDisplay(){
  const m=Math.floor(pomoSecs/60),s=pomoSecs%60;
  const ms=String(m).padStart(2,'0'),ss=String(s).padStart(2,'0');
  _flipUnit(0,ms[0]);_flipUnit(1,ms[1]);
  _flipUnit(2,ss[0]);_flipUnit(3,ss[1]);
}
function renderPomoStats(){
  document.getElementById('ps-sess').textContent=pomoData.sessions;
  document.getElementById('ps-mins').textContent=pomoData.minutes;
  document.getElementById('ps-streak').textContent=pomoData.streak;
  document.getElementById('pomo-log-list').innerHTML=pomoData.log.slice(-5).reverse()
    .map(l=>`<div class="pomo-log-item">
      <div class="pomo-log-dot" style="background:${l.type==='Focus'?'var(--accent)':l.type==='Short Break'?'var(--green)':'var(--blue)'};"></div>
      <span>${l.type} · ${l.mins} min</span>
      <span style="margin-left:auto;color:var(--muted);font-size:11px;">${l.time}</span>
    </div>`).join('')||'<div style="font-size:13px;color:var(--muted);">No sessions yet.</div>';
}
document.getElementById('pomo-start').onclick=()=>{
  if(pomoRunning){
    clearInterval(pomoTimer);pomoRunning=false;
    document.getElementById('pomo-start').textContent='▶ Resume';
    document.getElementById('pomo-dot1').classList.remove('blink');
    document.getElementById('pomo-dot2').classList.remove('blink');
  } else {
    pomoRunning=true;document.getElementById('pomo-start').textContent='⏸ Pause';
    document.getElementById('pomo-dot1').classList.add('blink');
    document.getElementById('pomo-dot2').classList.add('blink');
    pomoTimer=setInterval(()=>{
      if(pomoSecs<=0){clearInterval(pomoTimer);pomoRunning=false;
        document.getElementById('pomo-dot1').classList.remove('blink');
        document.getElementById('pomo-dot2').classList.remove('blink');
        const mins=Math.round(pomoTotal/60);
        if(pomoType==='Focus'){pomoData.sessions++;pomoData.minutes+=mins;pomoData.streak++;}
        pomoData.log.push({type:pomoType,mins,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
        saveAll();renderPomoStats();document.getElementById('pomo-start').textContent='▶ Start';
        toast(`${pomoType} session complete! 🎉`,'info');return;
      }
      pomoSecs--;updatePomoDisplay();
    },1000);
  }
};
document.getElementById('pomo-reset').onclick=()=>{clearInterval(pomoTimer);pomoRunning=false;pomoSecs=pomoTotal;updatePomoDisplay();document.getElementById('pomo-start').textContent='▶ Start';document.getElementById('pomo-dot1').classList.remove('blink');document.getElementById('pomo-dot2').classList.remove('blink');};
document.querySelectorAll('.pomo-mode').forEach(b=>b.addEventListener('click',()=>{
  clearInterval(pomoTimer);pomoRunning=false;
  document.querySelectorAll('.pomo-mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  pomoType=b.dataset.type;pomoTotal=parseInt(b.dataset.mins)*60;pomoSecs=pomoTotal;
  document.getElementById('pomo-type').textContent=pomoType.toUpperCase()+' SESSION';
  document.getElementById('pomo-start').textContent='▶ Start';
  // Reset flip state so digits animate on first tick
  const _m=String(Math.floor(pomoSecs/60)).padStart(2,'0'),_s=String(pomoSecs%60).padStart(2,'0');
  ['0','1','2','3'].forEach((i,idx)=>{
    const v=idx<2?_m[idx]:_s[idx-2];
    _fuPrev[idx]=v;
    ['cf','ft','fb'].forEach(p=>document.getElementById('fu-'+i+'-'+p).textContent=v);
  });
  document.getElementById('pomo-dot1').classList.remove('blink');
  document.getElementById('pomo-dot2').classList.remove('blink');
}));

// ══════════════════════════════════════
//  TASK CRUD
// ══════════════════════════════════════
function toggleTask(id){
  const t=tasks.find(t=>t.id===id);if(!t)return;
  t.done=!t.done;saveAll();renderAll();
  toast(t.done?'Task completed! ✅':'Marked as incomplete','ok');
}
function deleteTask(id){
  if(!confirm('Delete this assignment?'))return;
  tasks=tasks.filter(t=>t.id!==id);saveAll();renderAll();toast('Assignment deleted','err');
}
function openAddTask(prefillDate=''){
  editTaskId=null;
  document.getElementById('task-modal-ttl').textContent='New Assignment';
  document.getElementById('task-save-btn').textContent='Save Assignment';
  document.getElementById('edit-task-id').value='';
  ['t-title','t-subject','t-notes'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('t-due').value=prefillDate;
  document.getElementById('t-priority').value='medium';
  document.getElementById('t-category').value='assignment';
  document.getElementById('t-ttl-c').textContent='0';
  openOverlay('ov-task');
}
function openEditTask(id){
  const t=tasks.find(t=>t.id===id);if(!t)return;
  editTaskId=id;
  document.getElementById('task-modal-ttl').textContent='Edit Assignment';
  document.getElementById('task-save-btn').textContent='Update Assignment';
  document.getElementById('edit-task-id').value=id;
  document.getElementById('t-title').value=t.title;
  document.getElementById('t-subject').value=t.subject||'';
  document.getElementById('t-due').value=t.due;
  document.getElementById('t-priority').value=t.priority;
  document.getElementById('t-category').value=t.category||'assignment';
  document.getElementById('t-notes').value=t.notes||'';
  document.getElementById('t-ttl-c').textContent=t.title.length;
  openOverlay('ov-task');
}
document.getElementById('task-save-btn').onclick=()=>{
  const title=document.getElementById('t-title').value.trim();
  const due=document.getElementById('t-due').value;
  if(!title||!due){toast('Please fill Title and Due Date','err');return;}
  if(editTaskId){
    const t=tasks.find(t=>t.id===editTaskId);
    if(t){t.title=title;t.subject=document.getElementById('t-subject').value.trim();t.due=due;
      t.priority=document.getElementById('t-priority').value;t.category=document.getElementById('t-category').value;
      t.notes=document.getElementById('t-notes').value.trim();}
    toast('Assignment updated! ✏️','ok');
  }else{
    tasks.push({id:uid(),title,subject:document.getElementById('t-subject').value.trim(),
      due,priority:document.getElementById('t-priority').value,category:document.getElementById('t-category').value,
      notes:document.getElementById('t-notes').value.trim(),done:false,created:Date.now()});
    toast('Assignment added! 📝','ok');
  }
  saveAll();renderAll();closeOverlay('ov-task');
};

// ══════════════════════════════════════
//  GROUP CRUD
// ══════════════════════════════════════
function openGModal(status='todo'){
  document.getElementById('g-title').value='';document.getElementById('g-member').value='';
  document.getElementById('g-due').value='';document.getElementById('g-notes').value='';
  document.getElementById('g-status').value=status;
  openOverlay('ov-group');
}
function moveGroup(id,status){const t=groups.find(t=>t.id===id);if(t){t.status=status;saveAll();renderGroups();toast('Task moved','ok');}}
function deleteGroup(id){if(!confirm('Delete this group task?'))return;groups=groups.filter(t=>t.id!==id);saveAll();renderGroups();toast('Group task deleted','err');}
document.getElementById('g-save-btn').onclick=()=>{
  const title=document.getElementById('g-title').value.trim();
  if(!title){toast('Please enter a task title','err');return;}
  groups.push({id:uid(),title,member:document.getElementById('g-member').value.trim(),
    status:document.getElementById('g-status').value,due:document.getElementById('g-due').value,
    notes:document.getElementById('g-notes').value.trim()});
  saveAll();renderGroups();closeOverlay('ov-group');toast('Group task added! 👥','ok');
}
function openEditGroup(id){
  const t=groups.find(x=>x.id===id);if(!t)return;
  document.getElementById('g-title').value=t.title||'';
  document.getElementById('g-member').value=t.member||'';
  document.getElementById('g-due').value=t.due||'';
  document.getElementById('g-notes').value=t.notes||'';
  document.getElementById('ov-group').dataset.editId=id;
  openOverlay('ov-group');
};
document.getElementById('btn-add-group').onclick=()=>openGModal();

// ══════════════════════════════════════
//  NOTES CRUD
// ══════════════════════════════════════
function pickNoteColor(el){
  document.querySelectorAll('.cpick').forEach(e=>e.classList.remove('sel'));
  el.classList.add('sel');selNoteColor=el.dataset.c;document.getElementById('n-color').value=el.dataset.c;
}
function deleteNote(id){if(!confirm('Delete this note?'))return;notes=notes.filter(n=>n.id!==id);saveAll();renderNotes();toast('Note deleted','err');}
document.getElementById('note-save-btn').onclick=()=>{
  const content=document.getElementById('n-content').value.trim();
  if(!content){toast('Please write something','err');return;}
  notes.push({id:uid(),title:document.getElementById('n-title').value.trim(),content,
    color:document.getElementById('n-color').value,created:Date.now()});
  saveAll();renderNotes();closeOverlay('ov-note');toast('Note saved! 📝','ok');
}
function openEditNote(id){
  const n=notes.find(x=>x.id===id);if(!n)return;
  document.getElementById('note-title-inp').value=n.title||'';
  document.getElementById('note-content-inp').value=n.content||'';
  document.getElementById('ov-note').dataset.editId=id;
  openOverlay('ov-note');
};
document.getElementById('btn-add-note').onclick=()=>{
  document.getElementById('n-title').value='';document.getElementById('n-content').value='';
  document.getElementById('n-color').value='#7c6af7';
  document.querySelectorAll('.cpick').forEach((e,i)=>{e.classList.toggle('sel',i===0);});
  openOverlay('ov-note');
};

// ══════════════════════════════════════
//  MODAL HELPERS
// ══════════════════════════════════════
function openOverlay(id){document.getElementById(id).classList.add('open');}
function closeOverlay(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.overlay').forEach(ov=>{
  ov.addEventListener('click',e=>{if(e.target===ov||e.target.classList.contains('backdrop-blur'))closeOverlay(ov.id);});
});

// ══════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════
const viewMeta={
  dashboard:  ['Dashboard',   ()=>getGreeting()],
  assignments:['Assignments', ()=>'Track and manage your tasks'],
  groups:     ['Group Tasks', ()=>'Collaborate with your team'],
  calendar:   ['Calendar',    ()=>'Visualise your schedule'],
  reminders:  ['Reminders',   ()=>'Never miss a deadline'],
  pomodoro:   ['Pomodoro',    ()=>'Stay focused and productive'],
  notes:      ['Notes',       ()=>'Capture ideas and study notes'],
};
function getGreeting(){
  const h=new Date().getHours();
  const name=currentUser?currentUser.fname:'there';
  if(h<12)return`Good morning, ${name}! ☀️`;
  if(h<17)return`Good afternoon, ${name}! 🌤`;
  return`Good evening, ${name}! 🌙`;
}
function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelector(`[data-view="${name}"]`).classList.add('active');
  const [title,subFn]=viewMeta[name]||['',''];
  document.getElementById('pg-title').textContent=title;
  document.getElementById('pg-sub').textContent=subFn();
  if(name==='calendar'){renderCalendar();}
  if(name==='reminders'){renderReminders();}
  if(name==='notes'){renderNotes();}
  if(name==='pomodoro'){updatePomoDisplay();renderPomoStats();}
  document.getElementById('sidebar').classList.remove('open');
}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));

// ── Theme Toggle ──
(function(){
  const btn=document.getElementById('theme-toggle');
  const html=document.documentElement;
  const saved=localStorage.getItem('ss-theme')||'dark';
  if(saved==='light'){html.setAttribute('data-theme','light');btn.textContent='☀️';}
  btn.addEventListener('click',()=>{
    const isLight=html.getAttribute('data-theme')==='light';
    if(isLight){html.removeAttribute('data-theme');btn.textContent='🌙';localStorage.setItem('ss-theme','dark');}
    else{html.setAttribute('data-theme','light');btn.textContent='☀️';localStorage.setItem('ss-theme','light');}
  });
})();
document.getElementById('btn-add-task').onclick=()=>openAddTask();
let currentStatFilter='all';

function showStatModal(type){
  currentStatFilter=type;
  const map={
    all:    {title:'📚 All Tasks',     icon:'📚', empty:'No tasks yet!'},
    pending:{title:'⏳ Pending Tasks',  icon:'⏳', empty:'No pending tasks! 🎉'},
    done:   {title:'✅ Completed Tasks',icon:'✅', empty:'No completed tasks yet.'},
    overdue:{title:'⚠️ Overdue Tasks',  icon:'⚠️', empty:'No overdue tasks! 🎉'},
  };
  const cfg=map[type]||map.all;
  document.getElementById('stat-modal-title').textContent=cfg.title;

  // Filter tasks
  let list=tasks;
  if(type==='pending') list=tasks.filter(t=>!t.done);
  else if(type==='done') list=tasks.filter(t=>t.done);
  else if(type==='overdue') list=tasks.filter(t=>!t.done&&isOD(t.due));

  const body=document.getElementById('stat-modal-body');
  if(!list.length){
    body.innerHTML=`<div class="stat-empty"><div class="stat-empty-icon">${cfg.icon}</div>${cfg.empty}</div>`;
  } else {
    body.innerHTML=list.map(t=>taskCardHTML(t,false)).join('');
  }
  openOverlay('ov-stat-modal');
}

function closeStatModal(e){
  if(e.target.id==='ov-stat-modal') closeOverlay('ov-stat-modal');
}

function filterTasks(type){
  // map stat card types to fchip data-f values
  const map={all:'all',pending:'pending',done:'completed',overdue:'overdue'};
  const f=map[type]||'all';
  document.querySelectorAll('.fchip').forEach(x=>x.classList.remove('active'));
  const target=document.querySelector(`.fchip[data-f="${f}"]`);
  if(target)target.classList.add('active');
  curFilter=f;
  renderAssignments();
  // scroll to top of task list
  setTimeout(()=>document.getElementById('all-tasks')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
}

document.querySelectorAll('.fchip').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.fchip').forEach(x=>x.classList.remove('active'));b.classList.add('active');curFilter=b.dataset.f;renderAssignments();
}));
document.getElementById('sort-sel').addEventListener('change',function(){curSort=this.value;renderAssignments();});
document.getElementById('search-inp').addEventListener('input',renderAssignments);
document.getElementById('cal-prev').onclick=()=>{calDate.setMonth(calDate.getMonth()-1);renderCalendar();};
document.getElementById('cal-next').onclick=()=>{calDate.setMonth(calDate.getMonth()+1);renderCalendar();};
document.getElementById('hamburger').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
document.getElementById('notif-icon').onclick=()=>switchView('reminders');
document.addEventListener('click',e=>{
  const sb=document.getElementById('sidebar');
  if(window.innerWidth<=900&&sb.classList.contains('open')&&!sb.contains(e.target)&&e.target.id!=='hamburger')sb.classList.remove('open');
});

// ══════════════════════════════════════
//  RENDER ALL
// ══════════════════════════════════════
function renderAll(){
  renderDashboard();
  renderAssignments();
  renderGroups();
}

// ══════════════════════════════════════
//  INIT APP
// ══════════════════════════════════════
function initApp(){
  loadData();
  if(currentUser){
    const initials=(currentUser.fname[0]+(currentUser.lname?currentUser.lname[0]:'')).toUpperCase();
    document.getElementById('sb-av').textContent=initials;
    document.getElementById('sb-name').textContent=currentUser.fname+(currentUser.lname?' '+currentUser.lname[0]+'.':'');
    document.getElementById('sb-sub').textContent=currentUser.course||'Student';
    document.getElementById('pg-sub').textContent=getGreeting();
  }
  renderAll();
  updatePomoDisplay();
}

// Auto-start if already logged in
if(currentUser) initApp();