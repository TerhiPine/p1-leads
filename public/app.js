// =======================
// Elements
// =======================
const grid = document.querySelector("#grid tbody");       // Table body
const form = document.querySelector("#newLead");          // Form
const q = document.querySelector("#q");                   // Search field
const statusSel = document.querySelector("#status");      // Status-select
const formError = document.querySelector("#formError");   // Error messages
const formSuccess = document.querySelector("#formSuccess"); // Success messages
const gridStatus = document.querySelector("#gridStatus"); // Loading / empty message

// =======================
// Functions
// =======================

// Displays an error message
function showError(msg) {
  formError.textContent = msg;
  formError.style.color = "red";
  formSuccess.textContent = "";
}

// Displays a success message
function showSuccess(msg) {
  formSuccess.textContent = msg;
  formSuccess.style.color = "green";
  formError.textContent = "";
  setTimeout(() => formSuccess.textContent = "", 3000);
}

// Collect form data as an object
function getFormData() {
  return Object.fromEntries(new FormData(form).entries());
}

// Send a new lead to the backend
async function submitLead(data) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Validation failed");
  }
  return res.json();
}

// =======================
// Form submit
// =======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = "";
  formSuccess.textContent = "";

  const data = getFormData();

  // Client-side validation
  if (!data.name.trim() || !data.email.trim()) {
    showError("Name and email are required.");
    return;
  }

  try {
    await submitLead(data); // Send to backend
    await load();           // Update the table
    form.reset();           // Clear form
    showSuccess("Lead added successfully!");
  } catch (err) {
    showError(err.message || "Network error, try again.");
  }
});

// =======================
// Search and filtering
// =======================
document.querySelector("#applyFilters").addEventListener("click", load);

// =======================
// Load and render
// =======================
async function load() {
  gridStatus.textContent = "Loading…"; // Show download status
  grid.innerHTML = ""; // Clear table

  const params = new URLSearchParams();
  if (q.value) params.set("q", q.value);
  if (statusSel.value) params.set("status", statusSel.value);

  try {
    const res = await fetch("/api/leads?" + params.toString());
    const leads = await res.json();

    if (leads.length === 0) {
      gridStatus.textContent = "No leads found.";
    } else {
      gridStatus.textContent = "";
    }

    renderLeads(leads);
  } catch (err) {
    gridStatus.textContent = "Failed to load leads.";
  }
}

// Render leads to table
function renderLeads(leads) {
  grid.innerHTML = ""; // Clear table

  leads.forEach(l => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.dataset.label = "Name";
    tdName.textContent = l.name || "";

    const tdEmail = document.createElement("td");
    tdEmail.dataset.label = "Email";
    tdEmail.textContent = l.email || "";

    const tdCompany = document.createElement("td");
    tdCompany.dataset.label = "Company";
    tdCompany.textContent = l.company || "";

    const tdStatus = document.createElement("td");
    tdStatus.dataset.label = "Status";

    // Adding a color-coded status badge
    const span = document.createElement("span");
    span.textContent = l.status || "New";
    span.className = `status ${l.status || "New"}`; // CSS class determines color
    tdStatus.appendChild(span);

    const tdNotes = document.createElement("td");
    tdNotes.dataset.label = "Notes";
    tdNotes.textContent = l.notes || "";

    const tdActions = document.createElement("td");
    tdActions.dataset.label = "Actions";

    ["Contacted", "Qualified", "Lost"].forEach(s => {
      const btn = document.createElement("button");
      btn.className = "link";
      btn.type = "button";
      btn.dataset.id = l.id;
      btn.dataset.s = s;
      btn.textContent = `Mark ${s.toLowerCase()}`;
      tdActions.appendChild(btn);
    });

    const delBtn = document.createElement("button");
    delBtn.className = "link delete";
    delBtn.type = "button";
    delBtn.dataset.id = l.id;
    delBtn.textContent = "Delete";
    tdActions.appendChild(delBtn);

    tr.append(tdName, tdEmail, tdCompany, tdStatus, tdNotes, tdActions);
    grid.appendChild(tr);
  });

  bindActions();
}

// =======================
// Action buttons (status + delete)
// =======================
function bindActions() {
  document.querySelectorAll("#grid button.link").forEach(b => {
    b.addEventListener("click", async () => {
      if (b.classList.contains("delete")) {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        await fetch("/api/leads/" + b.dataset.id, { method: "DELETE" });
      } else {
        await fetch("/api/leads/" + b.dataset.id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: b.dataset.s })
        });
      }

      load(); // Refresh the table to update the status badge
      
    });
  });
}

// =======================
// Initial load
// =======================
load();


