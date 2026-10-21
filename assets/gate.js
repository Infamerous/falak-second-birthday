(function(){
  const HASH = '4cbc94725af76cc0347cd3ed31524a937d4182f3c83641d7d67d61b3959c1a96';

  async function sha256(text){
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  if (sessionStorage.getItem('falak_unlocked') === 'true') {
    location.replace('birthday.html');
    return;
  }

  const form = document.getElementById('gateForm');
  const input = document.getElementById('passInput');
  const error = document.getElementById('gateError');
  const gate = document.getElementById('gate');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const digest = await sha256(value);
    if (digest === HASH) {
      sessionStorage.setItem('falak_unlocked', 'true');
      location.replace('birthday.html');
    } else {
      error.textContent = 'Not quite — try again.';
      gate.classList.remove('shake');
      requestAnimationFrame(() => gate.classList.add('shake'));
      input.value = '';
      input.focus();
    }
  });
})();
