// Timestamp: date and time the form was loaded
const timestamp = document.querySelector('#timestamp');
if (timestamp) {
  timestamp.value = new Date().toISOString();
}

// Open modals from the card links
document.querySelectorAll('[data-modal]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const modal = document.getElementById(link.dataset.modal);
    modal.showModal();
  });
});

// Close buttons
document.querySelectorAll('.close-modal').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

// Close when clicking the backdrop
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});