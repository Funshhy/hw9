// hw9/js/event-handler.js

/**
 * Generic input checker called by event listeners.
 * evt: the event
 * options:
 *   - validate(value) -> { ok:boolean, message:string }
 *   - groupEl: .form-group container to toggle classes
 *   - helpEl:  .help-block to show feedback text
 *   - successMsg: optional success message
 */
function checkInput(evt, { validate, groupEl, helpEl, successMsg = 'Looks good!' }) {
  const value = evt.target.value.trim();
  const result = validate(value);

  // reset
  groupEl.classList.remove('has-default', 'has-error', 'has-success');

  if (value === '') {
    groupEl.classList.add('has-default');
    helpEl.textContent = result.message; // guidance text
    return;
  }

  if (result.ok) {
    groupEl.classList.add('has-success');
    helpEl.textContent = successMsg;
  } else {
    groupEl.classList.add('has-error');
    helpEl.textContent = result.message;
  }
}

// Pure validators
const validators = {
  name: (val) => {
    if (val.length === 0) return { ok: false, message: 'Please enter at least 2 characters.' };
    if (val.length < 2)  return { ok: false, message: 'Name must be at least 2 characters.' };
    return { ok: true, message: 'OK' };
  },
  email: (val) => {
    if (val.length === 0) return { ok: false, message: 'Email is required.' };
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) return { ok: false, message: 'Please enter a valid email address.' };
    return { ok: true, message: 'OK' };
  },
  age: (val) => {
    if (val.length === 0) return { ok: false, message: 'Age is required.' };
    const n = Number(val);
    if (!Number.isInteger(n) || n < 1 || n > 120) {
      return { ok: false, message: 'Age must be an integer between 1 and 120.' };
    }
    return { ok: true, message: 'OK' };
  }
};

// Wire up listeners WITH PARAMETERS (required)
window.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const nameGroup = document.getElementById('group-name');
  const nameHelp  = document.getElementById('help-name');

  const emailInput = document.getElementById('email');
  const emailGroup = document.getElementById('group-email');
  const emailHelp  = document.getElementById('help-email');

  const ageInput = document.getElementById('age');
  const ageGroup = document.getElementById('group-age');
  const ageHelp  = document.getElementById('help-age');

  // wrappers pass parameters into generic checker
  const onName  = (evt) => checkInput(evt,  { validate: validators.name,  groupEl: nameGroup,  helpEl: nameHelp,  successMsg: 'Nice name!' });
  const onEmail = (evt) => checkInput(evt,  { validate: validators.email, groupEl: emailGroup, helpEl: emailHelp, successMsg: 'Valid email!' });
  const onAge   = (evt) => checkInput(evt,  { validate: validators.age,   groupEl: ageGroup,  helpEl: ageHelp,   successMsg: 'Age accepted.' });

  // live + blur validation
  nameInput.addEventListener('input', onName);
  nameInput.addEventListener('blur',  onName);

  emailInput.addEventListener('input', onEmail);
  emailInput.addEventListener('blur',  onEmail);

  ageInput.addEventListener('input', onAge);
  ageInput.addEventListener('blur',  onAge);

  // final gate on submit
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    onName({ target: nameInput });
    onEmail({ target: emailInput });
    onAge({ target: ageInput });

    const hasErrorOrDefault = [nameGroup, emailGroup, ageGroup].some(g =>
      g.classList.contains('has-error') || g.classList.contains('has-default')
    );
    if (hasErrorOrDefault) {
      e.preventDefault();
      alert('Please fix the highlighted fields before submitting.');
    }
  });
});
