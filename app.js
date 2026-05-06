// ===========================
//   StudySync — App Logic
// ===========================

// ── State ──
let tasks = JSON.parse(localStorage.getItem('ss_tasks') || '[]');
let groupTasks = JSON.parse(localStorage.getItem('ss_group_tasks') || '[]');
let currentFilter = 'all';
let calDate = new Date();

// ── Seed data if empty ──
if (tasks.length === 0) {
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const add = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmt(d); };

  tasks = [
    { id: 1, title: 'DSA Assignment 3', subject: 'Computer Science', due: add(2),  priority: 'high',   done: false, notes: 'Sorting algorithms' },
    { id: 2, title: 'Physics Lab Report', subject: 'Physics',          due: add(5),  priority: 'medium', done: false, notes: '' },
    { id: 3, title: 'Math Tutorial Sheet', subject: 'Mathematics',     due: add(-1), priority: 'high',   done: false, notes: 'Chapter 5' },
    { id: 4, title: 'English Essay Draft', subject: 'English',         due: add(7),  priority: 'low',    done: true,  notes: '' },
    { id: 5, title: 'DBMS Project Report', subject: 'Database',        due: add(3),  priority: 'high',   done: false, notes: 'Include ER Diagram' },
  ];
  saveTasks();
}

if (groupTasks.length === 0) {
  groupTasks = [
    { id: 1, title: 'Design UI Mockup in Figma', member: 'Priya, Ravi', status: 'done',       due: '' },
    { id: 2, title: 'Backend API Integration',   member: 'Rahul',        status: 'inprogress', due: '' },
    { id: 3, title: 'Write Unit Tests',          member: 'Sneha',        status: 'todo',        due: '' },
    { id: 4, title: 'Deploy to GitHub Pages',    member: 'Team',         status: 'todo',        due: '' },
  ];
  saveGroupTasks();
}

function saveTasks()      { localStorage.setItem('ss_tasks',       JSON.stringify(tasks));      }
function saveGroupTasks() { localStorage.setItem('ss_group_tasks', JSON.stringify(groupTasks)); }

// ── Utilities ──
function isOverdue(due) {
  if (!due) return false;
  return new Date(due) < new Date(new Date().toDateString());
}
function daysUntil(due) {
  const diff = new Date(due) - new Date(new Date().toDateString());
  return Math.ceil(diff / 86400000);
}
function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function genId() { return Date.now() + Math.floor(Math.random() * 1000); }

// ── Stats ──
function renderStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => !t.done && isOverdue(t.due)).length;
  const pending = total - done;

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-done').textContent    = done;
  document.getElementById('stat-overdue').textContent = overdue;

  // Notification badge
  document.getElementById('notif-count').textContent = overdue;
}

// ── Task Card HTML ──
function taskCardHTML(task) {
  const over = !task.done && isOverdue(task.due);
  return `
    <div class="task-card" data-id="${task.id}">
      <div class="task-check ${task.done ? 'checked' : ''}" onclick="toggleDone(${task.id})"></div>
      <div class="task-body">
        <div class="task-title-text ${task.done ? 'strikethrough' : ''}">${task.title}</div>
        <div class="task-meta">
          <span>${task.subject || 'General'}</span>
          <span>Due: ${fmtDate(task.due)}</span>
          ${over ? '<span class="overdue-tag">⚠ Overdue</span>' : ''}
        </div>
      </div>
      <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      <button class="task-delete" onclick="deleteTask(${task.id})">✕</button>
    </div>`;
}

// ── Dashboard ──
function renderDashboard() {
  renderStats();
  const today = new Date();
  const week  = new Date(); week.setDate(week.getDate() + 7);
  const due   = tasks.filter(t => {
    const d = new Date(t.due);
    return !t.done && d <= week;
  }).sort((a, b) => new Date(a.due) - new Date(b.due));

  const el = document.getElementById('dashboard-tasks');
  el.innerHTML = due.length
    ? due.map(taskCardHTML).join('')
    : `<div class="empty-state"><div class="empty-icon">🎉</div>No tasks due this week!</div>`;
}

// ── Assignments View ──
function renderAssignments() {
  let filtered = [...tasks];
  if (currentFilter === 'pending')   filtered = tasks.filter(t => !t.done && !isOverdue(t.due));
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.done);
  if (currentFilter === 'overdue')   filtered = tasks.filter(t => !t.done && isOverdue(t.due));

  const el = document.getElementById('all-tasks');
  el.innerHTML = filtered.length
    ? filtered.map(taskCardHTML).join('')
    : `<div class="empty-state"><div class="empty-icon">✅</div>No tasks here.</div>`;
}

// ── Group View ──
function renderGroups() {
  ['todo', 'inprogress', 'done'].forEach(status => {
    const items = groupTasks.filter(t => t.status === status);
    document.getElementById('kanban-' + status).innerHTML = items.map(t => `
      <div class="kanban-card">
        <button class="kanban-card-delete" onclick="deleteGroupTask(${t.id})">✕</button>
        <div class="kanban-card-title">${t.title}</div>
        <div class="kanban-card-meta">👤 ${t.member || 'Unassigned'}</div>
        ${t.due ? `<div class="kanban-card-meta">📅 ${fmtDate(t.due)}</div>` : ''}
      </div>`).join('') || '<div style="color:var(--text-muted);font-size:13px">No tasks</div>';
  });
}

// ── Calendar View ──
function renderCalendar() {
  const year  = calDate.getFullYear();
  const month = calDate.getMonth();
  const label = calDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  document.getElementById('cal-month-label').textContent = label;

  const firstDay = new Date(year, month, 1).getDay();
  const daysIn   = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  let html = '';
  // Prev month days
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${prevDays - i}</div></div>`;
  }
  // Current month days
  for (let d = 1; d <= daysIn; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = dateStr === todayStr;
    const dayTasks = tasks.filter(t => t.due === dateStr);
    html += `<div class="cal-day ${isToday ? 'today' : ''}">
      <div class="cal-day-num">${d}</div>
      ${dayTasks.map(t => `<div class="cal-event">${t.title}</div>`).join('')}
    </div>`;
  }
  // Next month days
  const total = firstDay + daysIn;
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= remaining; d++) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${d}</div></div>`;
  }

  document.getElementById('cal-grid').innerHTML = html;
}

// ── Reminders View ──
function renderReminders() {
  const upcoming = tasks
    .filter(t => !t.done && t.due)
    .sort((a, b) => new Date(a.due) - new Date(b.due));

  const el = document.getElementById('reminder-list');
  el.innerHTML = upcoming.length ? upcoming.map(t => {
    const days = daysUntil(t.due);
    const cls  = days <= 1 ? 'urgent' : days <= 3 ? 'soon' : '';
    const dayCls = days <= 1 ? 'red' : days <= 3 ? 'yellow' : '';
    const label  = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today!' : `${days} day${days>1?'s':''} left`;
    return `
      <div class="reminder-card ${cls}">
        <div>
          <div class="reminder-title">${t.title}</div>
          <div class="reminder-meta">${t.subject || 'General'} · Due ${fmtDate(t.due)}</div>
        </div>
        <div class="reminder-days ${dayCls}">${label}</div>
      </div>`;
  }).join('') : `<div class="empty-state"><div class="empty-icon">🔔</div>No upcoming deadlines.</div>`;
}

// ── Render All ──
function renderAll() {
  renderDashboard();
  renderAssignments();
  renderGroups();
  renderCalendar();
  renderReminders();
}

// ── Toggle Done ──
function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; saveTasks(); renderAll(); }
}

// ── Delete Task ──
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); renderAll();
}

// ── Delete Group Task ──
function deleteGroupTask(id) {
  groupTasks = groupTasks.filter(t => t.id !== id);
  saveGroupTasks(); renderGroups();
}

// ── Navigation ──
function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelector(`[data-view="${view}"]`).classList.add('active');
  document.getElementById('page-title').textContent =
    { dashboard: 'Dashboard', assignments: 'Assignments', groups: 'Group Tasks', calendar: 'Calendar', reminders: 'Reminders' }[view];
  // Refresh on switch
  if (view === 'calendar') renderCalendar();
  if (view === 'reminders') renderReminders();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    switchView(item.dataset.view);
    document.getElementById('sidebar').classList.remove('open');
  });
});

// ── Filter Buttons ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderAssignments();
  });
});

// ── Modal: Add Assignment ──
const modal        = document.getElementById('modal-overlay');
const openModal    = document.getElementById('open-modal');
const closeModal   = document.getElementById('modal-close');
const cancelModal  = document.getElementById('modal-cancel');
const saveModal    = document.getElementById('modal-save');

openModal.addEventListener('click', () => modal.classList.add('active'));
closeModal.addEventListener('click', () => modal.classList.remove('active'));
cancelModal.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

saveModal.addEventListener('click', () => {
  const title = document.getElementById('task-title').value.trim();
  const due   = document.getElementById('task-due').value;
  if (!title || !due) { alert('Please fill in Title and Due Date.'); return; }

  tasks.push({
    id:       genId(),
    title,
    subject:  document.getElementById('task-subject').value.trim(),
    due,
    priority: document.getElementById('task-priority').value,
    notes:    document.getElementById('task-notes').value.trim(),
    done:     false,
  });
  saveTasks();
  renderAll();
  modal.classList.remove('active');
  // Reset
  ['task-title','task-subject','task-due','task-notes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('task-priority').value = 'medium';
});

// ── Modal: Add Group Task ──
const gModal       = document.getElementById('group-modal-overlay');
const openGModal   = document.getElementById('open-group-modal');
const closeGModal  = document.getElementById('group-modal-close');
const cancelGModal = document.getElementById('group-modal-cancel');
const saveGModal   = document.getElementById('group-modal-save');

openGModal.addEventListener('click', () => gModal.classList.add('active'));
closeGModal.addEventListener('click', () => gModal.classList.remove('active'));
cancelGModal.addEventListener('click', () => gModal.classList.remove('active'));
gModal.addEventListener('click', e => { if (e.target === gModal) gModal.classList.remove('active'); });

saveGModal.addEventListener('click', () => {
  const title = document.getElementById('group-task-title').value.trim();
  if (!title) { alert('Please enter a task title.'); return; }

  groupTasks.push({
    id:     genId(),
    title,
    member: document.getElementById('group-task-member').value.trim(),
    status: document.getElementById('group-task-status').value,
    due:    document.getElementById('group-task-due').value,
  });
  saveGroupTasks();
  renderGroups();
  gModal.classList.remove('active');
  ['group-task-title','group-task-member','group-task-due'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('group-task-status').value = 'todo';
});

// ── Calendar Nav ──
document.getElementById('cal-prev').addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() - 1); renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() + 1); renderCalendar();
});

// ── Hamburger ──
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── Init ──
renderAll();
