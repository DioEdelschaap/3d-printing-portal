document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tip-form');
  const successMessage = document.getElementById('form-success');

  if (form) {
    form.reset();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        form.reset();
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
      } else {
        alert('Er ging iets mis bij het versturen. Probeer het later opnieuw.');
      }
    })
    .catch(() => {
      alert('Netwerkfout. Controleer je verbinding en probeer opnieuw.');
    });
  });
});

// ✅ Volledige pagina herladen bij terugkeer via back-knop (lost formuliercache op)
window.addEventListener('pageshow', function (event) {
  if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
    window.location.reload();
  }
});


