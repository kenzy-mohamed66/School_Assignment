// Load tasks from backend
let tasks = {};

async function loadTasksFromBackend() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks/');
        const data = await response.json();

        // Convert backend data into tasks object
        data.forEach(task => {
        tasks[task.task_title] = {
        priority:   task.priority,
        student:    task.teacher_name,
        desc:       task.description,
        status:     task.status,
        id:         task.id,
        // ✅ Store extra fields needed for PUT
        task_id:    task.task_id,
        due_date:   task.due_date,
        admin_name: task.admin_name,
        course:     task.course
    };
});

        // Rebuild cards dynamically
        buildTaskCards();
        loadStatuses();

    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function buildTaskCards() {
    // Build cards for task_details.html
    const grid = document.getElementById('cards-grid');
    if (grid) {
        grid.innerHTML = '';
        Object.entries(tasks).forEach(([title, task]) => {
            const priClass = task.priority.toLowerCase();
            const card = document.createElement('div');
            card.className = 'task-card';
            card.onclick = () => openModal(title);
            card.innerHTML = `
                <div class="card-top">
                    <div>
                        <div class="card-subject">${title}</div>
                        <div class="card-student">Assigned to: ${task.student}</div>
                    </div>
                    <span class="badge badge-${priClass}">${task.priority}</span>
                </div>
                <div class="card-desc">${task.desc}</div>
                <div class="card-footer">
                    <span class="badge badge-progress">${task.status || 'In Progress'}</span>
                    <button class="card-btn">View Details →</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Build table rows for teacher_dashboard.html
    const tbody = document.getElementById('task-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        Object.entries(tasks).forEach(([title, task]) => {
            const priClass = task.priority.toLowerCase();
            const row = document.createElement('tr');
            row.dataset.subject  = title;
            row.dataset.priority = task.priority;
            row.innerHTML = `
                <td class="subject-name">${title}</td>
                <td><span class="badge badge-${priClass}">${task.priority}</span></td>
                <td><span class="badge badge-progress">${task.status || 'In Progress'}</span></td>
                <td><button class="btn-details" onclick="openModal('${title}')">View Details</button></td>
            `;
            tbody.appendChild(row);
        });
    }
    // ✅ Fill subjects dropdown dynamically
const subjectSelect = document.getElementById('Subjects');
if (subjectSelect) {
    subjectSelect.innerHTML = '<option value="all">All</option>';
    Object.keys(tasks).forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        option.textContent = title;
        subjectSelect.appendChild(option);
    });
}
}

const statuses = {};

// ── Load statuses from backend ──────────────────────────────
async function loadStatuses() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/data/');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    data.forEach(task => {
      statuses[task.subject] = task.status;
    });
    updateAllCards();
  } catch (error) {
    console.error('Failed to load statuses:', error);
  }
}

// ── Update all card badges to match backend status ──────────
function updateAllCards() {
  document.querySelectorAll('.task-card').forEach(card => {
    const subject = card.querySelector('.card-subject')?.textContent?.trim();
    if (!subject) return;
    const status = statuses[subject] || 'In Progress';
    const badge = card.querySelector('.card-footer .badge');
    if (badge) {
      badge.textContent = status;
      badge.className = 'badge ' + (status === 'Completed' ? 'badge-completed' : 'badge-progress');
    }
  });

  // Also update table rows if on dashboard
  document.querySelectorAll('#taskTable tbody tr').forEach(row => {
    const subject = row.dataset.subject;
    if (!subject) return;
    const status = statuses[subject] || 'In Progress';
    const badge = row.querySelector('td:nth-child(3) .badge');
    if (badge) {
      badge.textContent = status;
      badge.className = 'badge ' + (status === 'Completed' ? 'badge-completed' : 'badge-progress');
    }
  });
}

// ── Modal helpers ───────────────────────────────────────────
function openModal(subject) {
  const t = tasks[subject];
  const status = statuses[subject] || 'In Progress';
  const priLow = t.priority.toLowerCase();

  document.getElementById('modal-title').textContent  = subject;
  document.getElementById('modal-priority').innerHTML = `<span class="badge badge-${priLow}">${t.priority}</span>`;
  document.getElementById('modal-status').innerHTML   =
    status === 'Completed'
      ? '<span class="badge badge-completed">Completed</span>'
      : '<span class="badge badge-progress">In Progress</span>';
  document.getElementById('modal-student').textContent = t.student;

  const descEl = document.getElementById('modal-desc');
  descEl.textContent = t.desc;
  descEl.dir = subject === 'Arabic' ? 'rtl' : 'ltr';

  document.getElementById('modal-complete').checked = (status === 'Completed');
  document.getElementById('modal').dataset.current  = subject;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

// ── Save status to backend ───────────────
async function saveStatus() {
    const subject   = document.getElementById('modal').dataset.current;
    const done      = document.getElementById('modal-complete').checked;
    const newStatus = done ? 'completed' : 'in_progress';  // ← lowercase to match DB

    statuses[subject] = newStatus;

    document.getElementById('modal-status').innerHTML =
        newStatus === 'completed'
            ? '<span class="badge badge-completed">Completed</span>'
            : '<span class="badge badge-progress">In Progress</span>';

    updateAllCards();

    // ✅ Save to backend using task ID
    const taskId = tasks[subject]?.id;
    if (taskId) {
        try {
            const t = tasks[subject];
            await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task_id:      t.task_id,
                    task_title:   subject,
                    teacher_name: t.student,
                    priority:     t.priority,
                    due_date:     t.due_date,
                    description:  t.desc,
                    admin_name:   t.admin_name,
                    status:       newStatus,
                    course:       t.course
                })
            });
            console.log('Status saved to DB ✅');
        } catch (err) {
            console.error('Failed to save status:', err);
        }
    }
    closeModal();
}

// ── Filter (dashboard only) ─────────────────────────────────
function filterTable() {
  const pri = document.getElementById('priority')?.value;
  const sub = document.getElementById('Subjects')?.value;
  if (!pri || !sub) return;

  document.querySelectorAll('#taskTable tbody tr').forEach(row => {
    const matchPri = pri === 'all' || row.dataset.priority === pri;
    const matchSub = sub === 'all' || row.dataset.subject  === sub;
    row.style.display = matchPri && matchSub ? '' : 'none';
  });
}

// ── Close on Escape ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Load from backend first, then statuses
document.addEventListener('DOMContentLoaded', loadTasksFromBackend);