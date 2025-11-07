// =======================
// Elementtiviittaukset
// =======================
const grid = document.querySelector("#grid tbody");       // Taulukon body
const form = document.querySelector("#newLead");          // Lomake
const q = document.querySelector("#q");                   // Hakukenttä
const statusSel = document.querySelector("#status");      // Status-select
const formError = document.querySelector("#formError");   // Virheviestit
const formSuccess = document.querySelector("#formSuccess"); // Onnistumisviestit
const gridStatus = document.querySelector("#gridStatus"); // Lataus / tyhjäviesti

// =======================
// Apufunktiot
// =======================

// Näyttää virheilmoituksen
function showError(msg) {
  formError.textContent = msg;
  formError.style.color = "red";
  formSuccess.textContent = "";
}

// Näyttää onnistumisviestin
function showSuccess(msg) {
  formSuccess.textContent = msg;
  formSuccess.style.color = "green";
  formError.textContent = "";
  setTimeout(() => formSuccess.textContent = "", 3000);
}

// Kerää lomakedata objektiksi
function getFormData() {
  return Object.fromEntries(new FormData(form).entries());
}

// Lähetä uusi lead backendille
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
// Lomakkeen submit
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
    await submitLead(data); // Lähetä backendille
    await load();           // Päivitä taulukko
    form.reset();           // Tyhjennä lomake
    showSuccess("Lead added successfully!");
  } catch (err) {
    showError(err.message || "Network error, try again.");
  }
});

// =======================
// Haku ja suodatus
// =======================
document.querySelector("#applyFilters").addEventListener("click", load);

// =======================
// Load ja render
// =======================
async function load() {
  gridStatus.textContent = "Loading…"; // Näytä lataustila
  grid.innerHTML = ""; // Tyhjennä taulukko

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

// Renderöi leads taulukkoon
function renderLeads(leads) {
  grid.innerHTML = ""; // Tyhjennä taulukko

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
    tdStatus.textContent = l.status || "";

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

  bindActions(); // Liitä napit
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
      load(); // Päivitä taulukko
    });
  });
}

// =======================
// Initial load
// =======================
load();

