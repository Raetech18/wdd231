const params = new URLSearchParams(window.location.search);

const fields = ['first', 'last', 'email', 'phone', 'organization'];

fields.forEach((name) => {
  const output = document.querySelector(`#out-${name}`);
  // textContent keeps user input from being treated as HTML
  output.textContent = params.get(name) || 'Not provided';
});

const stamp = params.get('timestamp');
const stampOutput = document.querySelector('#out-timestamp');
if (stamp && !Number.isNaN(Date.parse(stamp))) {
  stampOutput.textContent = new Date(stamp).toLocaleString('en-NG', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
} else {
  stampOutput.textContent = 'Not available';
}