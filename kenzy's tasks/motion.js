const tasks = {
  Math: { priority: 'High', student: 'Kenzy', desc: "This task involves solving complex mathematical problems and equations to enhance students' understanding of mathematical concepts." },
  Physics: { priority: 'High', student: 'Sondos', desc: 'Prepare the lab report for the Optics experiment and verify the focal length measurements.' },
  Chemistry: { priority: 'High', student: 'Mariam', desc: 'Complete the Periodic Table project and write a summary about Noble Gases.' },
  Biology: { priority: 'High', student: 'Jana', desc: 'Draw a detailed diagram of the human cell and label all organelles correctly.' },
  French: { priority: 'Medium', student: 'John Pierre', desc: "Write a 200-word essay about your last summer vacation using the 'Passé Composé' tense." },
  German: { priority: 'High', student: 'Adele', desc: 'Memorize the list of irregular verbs and complete the workbook exercises on page 45.' },
  Italian: { priority: 'High', student: 'Emma', desc: 'Describe the main points of the audio clip and answer the comprehension questions in the handout.' },
  Arabic: { priority: 'High', student: 'Ahmed', desc: "شرح أبيات الشعر في قصيدة 'المتنبي' واستخراج الصور البلاغية والمحسنات البديعية" },
  English: { priority: 'High', student: 'Retal', desc: "Read the first three chapters of 'Great Expectations' and prepare for the class discussion." }
};

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

// ── Save status to backend ──────────────────────────────────
async function saveStatus() {
  const subject   = document.getElementById('modal').dataset.current;
  const done      = document.getElementById('modal-complete').checked;
  const newStatus = done ? 'Completed' : 'In Progress';

  statuses[subject] = newStatus;

  // Update modal badge immediately
  document.getElementById('modal-status').innerHTML =
    newStatus === 'Completed'
      ? '<span class="badge badge-completed">Completed</span>'
      : '<span class="badge badge-progress">In Progress</span>';

  // Update card/table badge immediately
  updateAllCards();

  // Save to backend
  try {
    await fetch(`http://127.0.0.1:8000/api/data/${subject}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (err) {
    console.error('Failed to save:', err);
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

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadStatuses);
