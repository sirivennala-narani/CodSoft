/* Pro To-Do App JS
   - Intro/onboarding (shown once)
   - Notification bell + dropdown (today's tasks)
   - Simulated reminders: toast notifications for tasks due soon
   - Modal add/edit, filters, sorting, localStorage, theme persistence
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const intro = document.getElementById('intro');
  const introStart = document.getElementById('introStart');
  const introSkip = document.getElementById('introSkip');
  const greetingEl = document.getElementById('greeting');
  const todaySummary = document.getElementById('todaySummary');
  const taskListEl = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const addBtn = document.getElementById('addBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const taskForm = document.getElementById('taskForm');
  const inputTitle = document.getElementById('inputTitle');
  const inputDesc = document.getElementById('inputDesc');
  const inputDue = document.getElementById('inputDue');
  const inputPriority = document.getElementById('inputPriority');
  const filterButtons = document.querySelectorAll('.tab-btn');
  const sortSelect = document.getElementById('sortSelect');
  const themeToggle = document.getElementById('themeToggle');
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const notifBadge = document.getElementById('notifBadge');
  const toastArea = document.getElementById('toastArea');

  // State
  let tasks = JSON.parse(localStorage.getItem('pro_tasks') || '[]');
  let editingId = null;
  let activeFilter = 'all';
  let activeSort = 'due-asc';
  let reminded = new Set(); // track tasks already toasted this session

  // --- Intro / Onboarding ---
  const introSeen = localStorage.getItem('pro_intro_seen');
  if (!introSeen) {
    intro.classList.add('show');
    intro.setAttribute('aria-hidden','false');
  }

  introStart.addEventListener('click', () => {
    localStorage.setItem('pro_intro_seen', '1');
    intro.classList.remove('show');
    intro.setAttribute('aria-hidden','true');
  });
  introSkip.addEventListener('click', () => {
    localStorage.setItem('pro_intro_seen', '1');
    intro.classList.remove('show');
    intro.setAttribute('aria-hidden','true');
  });

  // --- Greeting based on time ---
  function updateGreeting() {
    const h = new Date().getHours();
    let g = 'Hello';
    if (h < 12) g = 'Good Morning';
    else if (h < 18) g = 'Good Afternoon';
    else g = 'Good Evening';
    greetingEl.textContent = `${g} — Manage your day`;
  }
  updateGreeting();

  // --- Theme init ---
  const savedTheme = localStorage.getItem('pro_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
  }
  themeToggle.addEventListener('change', (e) => {
    const dark = e.target.checked;
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('pro_theme', dark ? 'dark' : 'light');
  });

  // --- modal open/close ---
  addBtn.addEventListener('click', () => openModal());
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function openModal(task = null) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    if (task) {
      editingId = task.id;
      document.getElementById('modalTitle').textContent = 'Edit Task';
      inputTitle.value = task.title;
      inputDesc.value = task.desc || '';
      inputDue.value = task.due || '';
      inputPriority.value = task.priority || 'low';
    } else {
      editingId = null;
      document.getElementById('modalTitle').textContent = 'Add Task';
      taskForm.reset();
      inputDue.value = '';
      inputPriority.value = 'low';
      inputTitle.focus();
    }
  }
  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    editingId = null;
    taskForm.reset();
  }

  // --- storage helpers ---
  function saveTasks() {
    localStorage.setItem('pro_tasks', JSON.stringify(tasks));
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

  // --- form submit (save task) ---
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = inputTitle.value.trim();
    if (!title) { inputTitle.focus(); return; }
    const desc = inputDesc.value.trim();
    const due = inputDue.value || '';
    const priority = inputPriority.value || 'low';

    if (editingId) {
      const idx = tasks.findIndex(t => t.id === editingId);
      if (idx >= 0) tasks[idx] = { ...tasks[idx], title, desc, due, priority };
    } else {
      tasks.push({ id: uid(), title, desc, due, priority, completed: false, created: new Date().toISOString() });
    }
    saveTasks(); render(); closeModal();
  });

  // --- filters & sort ---
  filterButtons.forEach(btn => btn.addEventListener('click', (e) => {
    filterButtons.forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    activeFilter = e.currentTarget.dataset.filter;
    render();
  }));
  sortSelect.addEventListener('change', (e) => { activeSort = e.target.value; render(); });

  // --- notifications dropdown toggle ---
  notifBtn.addEventListener('click', (e) => {
    const open = notifDropdown.classList.toggle('show');
    notifBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) populateNotifDropdown();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notify-wrap')) {
      notifDropdown.classList.remove('show');
      notifBtn.setAttribute('aria-expanded','false');
    }
  });

  // --- task actions ---
  function toggleComplete(id) {
    const t = tasks.find(x => x.id === id);
    if (t) { t.completed = !t.completed; saveTasks(); render(); }
  }
  function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(); render();
  }
  function editTask(id) {
    const t = tasks.find(x => x.id === id);
    if (t) openModal(t);
  }

  // --- filter & sort helper ---
  function applyFilterAndSort(list) {
    let out = list.slice();
    if (activeFilter === 'active') out = out.filter(t => !t.completed);
    else if (activeFilter === 'completed') out = out.filter(t => t.completed);

    if (activeSort === 'due-asc') {
      out.sort((a,b) => {
        if (!a.due && !b.due) return 0;
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
      });
    } else if (activeSort === 'priority-desc') {
      const rank = { high: 3, medium: 2, low: 1 };
      out.sort((a,b) => (rank[b.priority] || 0) - (rank[a.priority] || 0));
    }
    return out;
  }

  // --- render tasks list ---
  function render() {
    // summary
    const pending = tasks.filter(t => !t.completed).length;
    todaySummary.textContent = `You have ${pending} pending task${pending !== 1 ? 's' : ''}`;

    // visible list
    const visible = applyFilterAndSort(tasks);
    taskListEl.innerHTML = '';
    if (visible.length === 0) {
      emptyState.hidden = false;
      notifBadge.hidden = true;
      notifList.innerHTML = '';
      return;
    } else {
      emptyState.hidden = true;
    }

    // build DOM
    visible.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.setAttribute('role','listitem');
      li.style.opacity = task.completed ? 0.6 : 1;

      const chk = document.createElement('button');
      chk.className = 'check' + (task.completed ? ' completed' : '');
      chk.title = task.completed ? 'Mark active' : 'Mark complete';
      chk.innerHTML = task.completed ? '✓' : '';
      chk.addEventListener('click', () => toggleComplete(task.id));

      const content = document.createElement('div');
      content.className = 'task-content';
      const title = document.createElement('p');
      title.className = 'task-title';
      title.textContent = task.title;
      if (task.completed) title.style.textDecoration = 'line-through';

      const desc = document.createElement('p');
      desc.className = 'task-desc';
      desc.textContent = task.desc || '';

      const meta = document.createElement('div');
      meta.className = 'task-meta';
      const due = document.createElement('span');
      due.className = 'meta-date';
      due.textContent = task.due ? (new Date(task.due)).toLocaleDateString() : 'No due date';
      const badge = document.createElement('span');
      badge.className = 'badge ' + (task.priority || 'low');
      badge.textContent = (task.priority || 'low').toUpperCase();
      meta.appendChild(due); meta.appendChild(badge);

      content.appendChild(title);
      if (task.desc) content.appendChild(desc);
      content.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'actions';
      const btnEdit = document.createElement('button');
      btnEdit.className = 'icon-btn small';
      btnEdit.title = 'Edit task';
      btnEdit.innerHTML = '✎';
      btnEdit.addEventListener('click', () => editTask(task.id));
      const btnDelete = document.createElement('button');
      btnDelete.className = 'icon-btn small danger';
      btnDelete.title = 'Delete task';
      btnDelete.innerHTML = '🗑';
      btnDelete.addEventListener('click', () => deleteTask(task.id));
      actions.appendChild(btnEdit); actions.appendChild(btnDelete);

      li.appendChild(chk); li.appendChild(content); li.appendChild(actions);
      taskListEl.appendChild(li);
    });

    // update notification badge if any tasks due today
    const todayDue = tasks.filter(t => t.due && isToday(new Date(t.due)) && !t.completed);
    if (todayDue.length > 0) {
      notifBadge.hidden = false;
      notifList.innerHTML = '';
      todayDue.forEach(t => {
        const ni = document.createElement('li');
        ni.className = 'notif-item';
        ni.textContent = `${t.title} • ${t.due}`;
        notifList.appendChild(ni);
      });
    } else {
      notifBadge.hidden = true;
      notifList.innerHTML = '<li class="muted small">No tasks due today</li>';
    }
  }

  // --- notification population ---
  function populateNotifDropdown() {
    const todayDue = tasks.filter(t => t.due && isToday(new Date(t.due)));
    notifList.innerHTML = '';
    if (todayDue.length === 0) {
      notifList.innerHTML = '<li class="muted small">No tasks due today</li>';
      return;
    }
    todayDue.forEach(t => {
      const ni = document.createElement('li');
      ni.className = 'notif-item';
      ni.textContent = `${t.title} • ${t.due}`;
      ni.addEventListener('click', () => { editTask(t.id); notifDropdown.classList.remove('show'); });
      notifList.appendChild(ni);
    });
  }

  // --- utility date helpers ---
  function isToday(d) {
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth() === now.getMonth() &&
           d.getDate() === now.getDate();
  }
  function minutesUntil(d) {
    return Math.round((d - new Date()) / 60000);
  }

  // --- simulated reminders (toasts) ---
  // Behavior:
  // - Check every minute for tasks due within next N minutes (configurable)
  // - Show toast for each task once per session (tracked in 'reminded' set)
  const REMIND_WINDOW_MIN = 60; // show reminders for tasks due within next 60 minutes
  const CHECK_INTERVAL_MS = 60 * 1000; // check every 60s
  function checkReminders() {
    const now = new Date();
    tasks.forEach(t => {
      if (!t.due || t.completed || reminded.has(t.id)) return;
      const dueDate = new Date(t.due + 'T23:59:59'); // treat due date as end of day if only date provided
      // If due date includes time, user could set it; here we use date only — show reminders for tasks due today within REMIND_WINDOW_MIN
      if (isToday(dueDate)) {
        // show reminder if within REMIND_WINDOW_MIN minutes of now (we consider all-day tasks, so just notify once early in the day)
        const mins = minutesUntil(dueDate);
        // For simplicity: if the task is due today and not yet reminded, show a morning reminder
        // or if the dueDate time is near (if user had provided time handling). We'll show one reminder per task.
        if (mins <= REMIND_WINDOW_MIN) {
          showToast(`Reminder: "${t.title}" is due today.`);
          reminded.add(t.id);
        }
      }
    });
    // update badge state too
    const todayDue = tasks.filter(t => t.due && isToday(new Date(t.due)) && !t.completed);
    notifBadge.hidden = todayDue.length === 0;
  }
  // initial check shortly after load
  setTimeout(checkReminders, 1500);
  // periodic check
  setInterval(checkReminders, CHECK_INTERVAL_MS);

  // --- toast UI ---
  function showToast(message, opts = {}) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div>${message}</div><button class="icon-btn" title="Dismiss">✕</button>`;
    const btn = toast.querySelector('button');
    btn.addEventListener('click', () => { toast.remove(); });
    toastArea.appendChild(toast);
    // auto-dismiss (default 6s)
    const ttl = opts.ttl || 6000;
    setTimeout(() => { toast.remove(); }, ttl);
  }

  // --- initial render & helpers ---
  function renderInit() {
    // ensure saved tasks loaded
    tasks = JSON.parse(localStorage.getItem('pro_tasks') || '[]');
    render();
  }
  renderInit();

  // Save when window unloads (redundant but safe)
  window.addEventListener('beforeunload', () => saveTasks());

  // Make functions accessible for modal edit callback
  // expose minimal API (not global polluting)
  window.proTodo = {
    openEdit: (id) => editTask(id)
  };

});
// ✅ Notification System
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Force reflow so animation triggers
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  // Optional: play soft notification sound
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  audio.volume = 0.3;
  audio.play().catch(() => {}); // prevent auto-play errors

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// Example: Simulate notifications every few minutes
setInterval(() => {
  const now = new Date();
  const soonTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const diff = (due - now) / (1000 * 60);
    return diff > 0 && diff < 15; // due within 15 min
  });
  if (soonTasks.length > 0) {
    showNotification(`⏰ ${soonTasks[0].title} is due soon!`);
  }
}, 60000); // check every minute
