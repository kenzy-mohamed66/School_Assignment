const tasks = {
  Math: {
    priority: 'High',
    student:  'Kenzy',
    desc:     'This task involves solving complex mathematical problems and equations to enhance students\u2019 understanding of mathematical concepts.'
  },
  Physics: {
    priority: 'High',
    student:  'Sondos',
    desc:     'Prepare the lab report for the Optics experiment and verify the focal length measurements.'
  },
  Chemistry: {
    priority: 'High',
    student:  'Mariam',
    desc:     'Complete the Periodic Table project and write a summary about Noble Gases.'
  },
  Biology: {
    priority: 'High',
    student:  'Jana',
    desc:     'Draw a detailed diagram of the human cell and label all organelles correctly.'
  },
  French: {
    priority: 'Medium',
    student:  'John Pierre',
    desc:     "Write a 200-word essay about your last summer vacation using the 'Pass\u00e9 Compos\u00e9' tense."
  },
  German: {
    priority: 'High',
    student:  'Adele',
    desc:     'Memorize the list of irregular verbs and complete the workbook exercises on page 45.'
  },
  Italian: {
    priority: 'High',
    student:  'Emma',
    desc:     'Describe the main points of the audio clip and answer the comprehension questions in the handout.'
  },
  Arabic: {
    priority: 'High',
    student:  'Ahmed',
    desc:     "\u0634\u0631\u062d \u0623\u0628\u064a\u0627\u062a \u0627\u0644\u0634\u0639\u0631 \u0641\u064a \u0642\u0635\u064a\u062f\u0629 '\u0627\u0644\u0645\u062a\u0646\u0628\u064a' \u0648\u0627\u0633\u062a\u062e\u0631\u0627\u062c \u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u0628\u0644\u0627\u063a\u064a\u0629 \u0648\u0627\u0644\u0645\u062d\u0633\u0646\u0627\u062a \u0627\u0644\u0628\u062f\u064a\u0639\u064a\u0629"
  },
  English: {
    priority: 'High',
    student:  'Retal',
    desc:     "Read the first three chapters of 'Great Expectations' and prepare for the class discussion."
  }
};

// Tracks completion status in memory
const statuses = {};

// ── Modal helpers ───────────────────────────────────────────
function openModal(subject) {
  const t      = tasks[subject];
  const status = statuses[subject] || 'In Progress';
  const priLow = t.priority.toLowerCase();

  document.getElementById('modal-title').textContent    = subject;
  document.getElementById('modal-priority').innerHTML   = `<span class="badge badge-${priLow}">${t.priority}</span>`;
  document.getElementById('modal-status').innerHTML     =
    status === 'Completed'
      ? '<span class="badge badge-completed">Completed</span>'
      : '<span class="badge badge-progress">In Progress</span>';
  document.getElementById('modal-student').textContent  = t.student;

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

function saveStatus() {
  const subject = document.getElementById('modal').dataset.current;
  const done    = document.getElementById('modal-complete').checked;
  statuses[subject] = done ? 'Completed' : 'In Progress';
  closeModal();
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

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

  
   
  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

