// const form = document.getElementById('learnerForm');
// const statusEl = document.getElementById('status');
// const submitBtn = document.getElementById('submitBtn');

// const prevSection = document.getElementById('preview');
// const prevFirstName = document.getElementById('prevFirstName');
// const prevLastName  = document.getElementById('prevLastName');
// const prevEmail     = document.getElementById('prevEmail');
// const prevState     = document.getElementById('prevState');
// const prevTime      = document.getElementById('prevTime');

// const validName = (s) => /^[A-Za-z][A-Za-z '\-]{0,49}$/.test((s || '').trim());
// const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((e || '').trim());

// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   statusEl.textContent = '';

//   // Native checks (required, pattern, type)
//   if (!form.checkValidity()) {
//     form.reportValidity();
//     return;
//   }

//   const firstName = document.getElementById('firstName').value.trim();
//   const lastName  = document.getElementById('lastName').value.trim();
//   const email     = document.getElementById('email').value.trim();
//   const state     = (document.getElementById('state').value || '').trim().toUpperCase();

//   // Extra guardrails
//   if (!validName(firstName) || !validName(lastName)) {
//     statusEl.textContent = 'Please enter valid names (letters, spaces, hyphen, apostrophe).';
//     return;
//   }
//   if (!validEmail(email)) {
//     statusEl.textContent = 'Please enter a valid email address.';
//     return;
//   }
//   if (!/^[A-Z]{2}$/.test(state)) {
//     statusEl.textContent = 'Please select a US state.';
//     return;
//   }

//   submitBtn.disabled = true;
//   // Since this is frontend-only, just show the preview:
//   renderPreview({ firstName, lastName, email, state });
//   statusEl.textContent = 'Preview shown below. (No data is sent yet.)';
  
//   // Clear the form fields after successful submission with a small delay
//   setTimeout(() => {
//     document.getElementById('firstName').value = '';
//     document.getElementById('lastName').value = '';
//     document.getElementById('email').value = '';
//     document.getElementById('state').value = '';
//     document.getElementById('firstName').focus(); // Focus on first field
//   }, 100);
  
//   submitBtn.disabled = false;
// });

// function renderPreview({ firstName, lastName, email, state }) {
//   // Use textContent to avoid any HTML injection
//   prevFirstName.textContent = firstName;
//   prevLastName.textContent  = lastName;
//   prevEmail.textContent     = email.toLowerCase();
//   prevState.textContent     = state;

//   const now = new Date();
//   prevTime.textContent = `Submitted at ${now.toLocaleString()}`;

//   prevSection.classList.remove('hidden');
// }



const form = document.getElementById('learnerForm');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

const prevSection = document.getElementById('preview');
const prevFirstName = document.getElementById('prevFirstName');
const prevLastName  = document.getElementById('prevLastName');
const prevEmail     = document.getElementById('prevEmail');
const prevState     = document.getElementById('prevState');
const prevTime      = document.getElementById('prevTime');

const validName = (s) => /^[A-Za-z][A-Za-z '\-]{0,49}$/.test((s || '').trim());
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((e || '').trim());

// calls our Vercel API route
async function submitToServer(payload) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const state     = (document.getElementById('state').value || '').trim().toUpperCase();

  if (!validName(firstName) || !validName(lastName)) {
    statusEl.textContent = 'Please enter valid names (letters, spaces, hyphen, apostrophe).';
    return;
  }
  if (!validEmail(email)) {
    statusEl.textContent = 'Please enter a valid email address.';
    return;
  }
  if (!/^[A-Z]{2}$/.test(state)) {
    statusEl.textContent = 'Please select a US state.';
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = 'Submitting...';

  try {
    // 1) Show preview immediately
    renderPreview({ firstName, lastName, email, state });

    // 2) Persist to Supabase via Vercel function
    await submitToServer({ firstName, lastName, email, state });

    statusEl.textContent = 'Saved! (See details below.)';
  } catch (err) {
    statusEl.textContent = err.message || 'Something went wrong.';
  } finally {
    // Always clear the form fields regardless of success or failure
    try {
      form.reset();
      document.getElementById('firstName').focus();
    } catch (_) {}
    submitBtn.disabled = false;
  }
});

function renderPreview({ firstName, lastName, email, state }) {
  prevFirstName.textContent = firstName;
  prevLastName.textContent  = lastName;
  prevEmail.textContent     = email.toLowerCase();
  prevState.textContent     = state;
  prevTime.textContent = `Submitted at ${new Date().toLocaleString()}`;
  prevSection.classList.remove('hidden');
}
