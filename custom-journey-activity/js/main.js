document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("journeyForm");
  const output = document.getElementById("output");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const state = document.getElementById("state").value;

    output.innerHTML = `
      <strong>Submitted Values:</strong><br/>
      First Name: ${firstName}<br/>
      Last Name: ${lastName}<br/>
      Email: ${email}<br/>
      State: ${state}
    `;

    // Placeholder for backend call
    // fetch('/api/save', { method: 'POST', body: JSON.stringify({ firstName, lastName, email, state }) });
  });
});
