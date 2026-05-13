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
                task_id:    task.task_id,
                due_date:   task.due_date,
                admin_name: task.admin_name,
                course:     task.course
            };
        });

        // Rebuild cards dynamically
        buildTaskCards();
        // Removed loadStatuses() entirely as requested
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
            const isCompleted = task.status?.toLowerCase() === 'in_progress' ? false : task.status?.toLowerCase() === 'completed';
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
                    <span class="badge ${isCompleted ? 'badge-completed' : 'badge-progress'}">${isCompleted ? 'Completed' : 'In Progress'}</span>
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
            const isCompleted = task.status?.toLowerCase() === 'completed';
            const row = document.createElement('tr');
            row.dataset.subject  = title;
            row.dataset.priority = task.priority;
            row.innerHTML = `
                <td class="subject-name">${title}</td>
                <td><span class="badge badge-${priClass}">${task.priority}</span></td>
                <td><span class="badge ${isCompleted ? 'badge-completed' : 'badge-progress'}">${isCompleted ? 'Completed' : 'In Progress'}</span></td>
                <td><button class="btn-details" onclick="openModal('${title}')">View Details</button></td>
            `;
            tbody.appendChild(row);
        });
    }

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

// ── Modal helpers ───────────────────────────────────────────
function openModal(subject) {
    const t = tasks[subject];
    const priLow = t.priority.toLowerCase();
    const isCompleted = t.status?.toLowerCase() === 'completed';

    document.getElementById('modal-title').textContent  = subject;
    document.getElementById('modal-priority').innerHTML = `<span class="badge badge-${priLow}">${t.priority}</span>`;
    
    document.getElementById('modal-status').innerHTML =
        isCompleted
            ? '<span class="badge badge-completed">Completed</span>'
            : '<span class="badge badge-progress">In Progress</span>';
            
    document.getElementById('modal-student').textContent = t.student;

    const descEl = document.getElementById('modal-desc');
    descEl.textContent = t.desc;
    descEl.dir = subject === 'Arabic' ? 'rtl' : 'ltr';

    document.getElementById('modal-complete').checked = isCompleted;
    document.getElementById('modal').dataset.current  = subject;
    document.getElementById('modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
}

// Filter function
function filterTable() {
    const priValue = document.getElementById('priority')?.value?.toLowerCase();
    const subValue = document.getElementById('Subjects')?.value?.toLowerCase();

    document.querySelectorAll('#task-tbody tr').forEach(row => {
        const rowPriority = row.dataset.priority?.toLowerCase();
        const rowSubject  = row.dataset.subject?.toLowerCase();

        const matchPri = !priValue || priValue === 'all' || rowPriority === priValue;
        const matchSub = !subValue || subValue === 'all' || rowSubject  === subValue;

        row.style.display = matchPri && matchSub ? '' : 'none';
    });
}

// ── Save status to backend ───────────────
async function saveStatus() {
    const subject   = document.getElementById('modal').dataset.current;
    const done      = document.getElementById('modal-complete').checked;
    const newStatus = done ? 'completed' : 'in_progress';

    // Update local state
    tasks[subject].status = newStatus;

    // Update UI immediately
    buildTaskCards(); 

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

document.addEventListener('DOMContentLoaded', loadTasksFromBackend);