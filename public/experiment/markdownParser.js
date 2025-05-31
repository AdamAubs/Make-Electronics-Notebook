// Render markdown safely for observation
document.querySelectorAll('.observation-rendered').forEach(el => {
  const raw = el.getAttribute('data-md');
  const parsed = marked.parse(raw);
  const clean = DOMPurify.sanitize(parsed);
  el.innerHTML = clean;
});

// Render markdown safely for instruction
document.querySelectorAll('.instruction-rendered').forEach(el => {
  const raw = el.getAttribute('data-md');
  const parsed = marked.parse(raw);
  const clean = DOMPurify.sanitize(parsed);
  el.innerHTML = clean;
});

// Observation Edit/Cancel functionality
const obsEditBtn = document.getElementById('edit-button');
const obsPreview = document.getElementById('observation-preview');
const obsForm = document.getElementById('edit-form');
const obsCancelBtn = document.getElementById('cancel-edit');

if (obsEditBtn && obsForm && obsPreview && obsCancelBtn) {
  obsEditBtn.addEventListener('click', () => {
    obsPreview.style.display = 'none';
    obsForm.style.display = 'block';
    obsEditBtn.style.display = 'none';
  });

  obsCancelBtn.addEventListener('click', () => {
    obsForm.style.display = 'none';
    obsPreview.style.display = 'block';
    obsEditBtn.style.display = 'inline';
  });
}

// Instruction Edit/Cancel functionality
const instEditBtn = document.getElementById('edit-instruction-button');
const instPreview = document.getElementById('instruction-preview');
const instForm = document.getElementById('edit-instruction-form');
const instCancelBtn = document.getElementById('cancel-instruction-edit');

if (instEditBtn && instForm && instPreview && instCancelBtn) {
  instEditBtn.addEventListener('click', () => {
    instPreview.style.display = 'none';
    instForm.style.display = 'block';
    instEditBtn.style.display = 'none';
  });

  instCancelBtn.addEventListener('click', () => {
    instForm.style.display = 'none';
    instPreview.style.display = 'block';
    instEditBtn.style.display = 'inline';
  });
}
