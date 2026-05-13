document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// ── All tasks loaded from backend ─────────────────────────
let allTasks = [];

// ── On page load: populate the dropdown ──────────────────
window.onload = async function () {
    await loadDropdown();

    // If page was opened with ?id=X (e.g. from view_created_task), auto-select that task
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    if (taskId) {
        const select = document.getElementById('task-select');
        select.value = taskId;
        onTaskSelected();
    }
};

// ── Fetch all tasks and populate the dropdown ─────────────
async function loadDropdown() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks/');
        allTasks = await response.json();

        const select = document.getElementById('task-select');
        select.innerHTML = '<option value="">-- Select a Task --</option>';

        allTasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = `${task.task_title} (${task.course || 'No Course'})`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading tasks for dropdown:', error);
    }
}

// ── When a task is selected from dropdown, fill the form ──
function onTaskSelected() {
    const taskId = document.getElementById('task-select').value;
    if (!taskId) return;

    const task = allTasks.find(t => t.id == taskId);
    if (!task) return;

    document.getElementById('title').value        = task.task_title  || '';
    document.getElementById('teacher_name').value = task.teacher_name || '';
    document.getElementById('course').value       = task.course       || '';
    document.getElementById('description').value  = task.description  || '';
    document.getElementById('due_date').value     = task.due_date     || '';

    const prioritySelect = document.getElementById('priority');
    prioritySelect.value = (task.priority || '').toLowerCase();

    const statusSelect = document.getElementById('status');
    const rawStatus = (task.status || '').toLowerCase();
    statusSelect.value = rawStatus === 'completed' ? 'completed' : 'in_progress';
}

// ── Submit: PUT updated data to backend ───
async function updateTask(event) {
    event.preventDefault();

    const taskId = document.getElementById('task-select').value;
    if (!taskId) {
        alert('Please select a task to edit!');
        return;
    }

    const updatedData = {
        task_title:   document.getElementById('title').value,
        teacher_name: document.getElementById('teacher_name').value,
        course:       document.getElementById('course').value,
        priority:     document.getElementById('priority').value,
        description:  document.getElementById('description').value,
        due_date:     document.getElementById('due_date').value,
        status:       document.getElementById('status').value,
        // Keep existing fields that aren't in the edit form
        task_id:      allTasks.find(t => t.id == taskId)?.task_id   || '',
        admin_name:   allTasks.find(t => t.id == taskId)?.admin_name || '',
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('✅ Task updated successfully!');
            // Reload dropdown with fresh data so the table and other pages reflect changes
            await loadDropdown();
            // Reset form
            document.getElementById('task-select').value = '';
            document.getElementById('title').value       = '';
            document.getElementById('teacher_name').value = '';
            document.getElementById('course').value      = '';
            document.getElementById('description').value = '';
            document.getElementById('due_date').value    = '';
        } else {
            const error = await response.json();
            console.error('Update error:', error);
            alert('❌ Failed to update task. Please check the fields.');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please try again.');
    }
}

// ── Tasks table below the form ──
async function loadTasksTable() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks/');
        const data = await response.json();

        let tableBody = document.querySelector('table tbody');

        if (!tableBody) {
            const table = document.querySelector('table');
            if (table) {
                const tbody = document.createElement('tbody');
                table.appendChild(tbody);
                tableBody = tbody;
            }
        }

        if (tableBody) populateTable(tableBody, data);

    } catch (error) {
        console.error('Error loading tasks table:', error);
    }
}

function populateTable(tbody, tasks) {
    tbody.innerHTML = '';

    if (tasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">No tasks found. Create a new task!</td>
            </tr>`;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');

        if ((task.status || '').toLowerCase() === 'overdue') {
            row.style.background   = 'rgba(236, 72, 153, 0.12)';
            row.style.borderLeft   = '3px solid rgba(236, 72, 153, 0.6)';
        }

        row.innerHTML = `
            <td>${task.task_id}</td>
            <td>${task.task_title}</td>
            <td>${task.teacher_name}</td>
            <td>${task.course || 'No Course'}</td>
            <td>${task.priority}</td>
            <td>${task.description}</td>
            <td>${getStatusBadge(task.status)}</td>
            <td>${task.admin_name}</td>
            <td>
                <a href="edit-task.html?id=${task.id}" class="edit-btn">Edit</a>
                <a href="#" onclick="deleteTaskFromAPI(${task.id})" class="delete-btn">Delete</a>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// ── Clicking Edit in the table scrolls up and selects that task ──
function selectTaskInDropdown(taskId) {
    const select = document.getElementById('task-select');
    select.value = taskId;
    onTaskSelected();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStatusBadge(status) {
    switch ((status || '').toLowerCase()) {
        case 'completed':  return 'Completed';
        case 'in_progress':
        case 'pending':    return 'In Progress';
        case 'overdue':    return 'Overdue';
        default:           return status;
    }
}

// ── Delete ──
async function deleteTaskFromAPI(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Task deleted successfully!');
            await loadDropdown(); // refresh both dropdown and table
        } else {
            alert('Failed to delete task.');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Network error. Please try again.');
    }
}

// ── Legacy redirect (from view_created_task Edit button) ──
function editTask(taskId) {
    window.location.href = `edit-task.html?id=${taskId}`;
}

function clearform() {
    alert('Form cleared');
}

document.addEventListener("DOMContentLoaded", () => {
    // If on edit-task page, load the dropdown
    if (document.getElementById('task-select')) {
        loadDropdown();
    }
    // Always load the table (works on both edit-task.html and view_created_task.html)
    loadTasksTable();
});