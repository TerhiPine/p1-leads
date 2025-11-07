// Get references to key elements in the HTML for later use
const grid = document.querySelector("#grid tbody"); // Table body
const form = document.querySelector("#newLead");   // 'Add lead' form
const q = document.querySelector("#q");           // Search input
const statusSel = document.querySelector("#status"); // Status
const formError = document.querySelector("#formError"); // For validation errors
const formSuccess = document.querySelector("#formSuccess");
const gridStatus = document.querySelector("#gridStatus");


// Apply filters button
document.querySelector("#applyFilters").addEventListener("click", load);

// Form submit with client-side validation
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = ""; // Clear previous errors
  formSuccess.textContent = "";

  const data = Object.fromEntries(new FormData(form).entries());

  // Client-side validation
  if (!data.name.trim() || !data.email.trim()) {
    formError.textContent = "Name and email are required.";
    return;
  }

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      formError.textContent = err.error || "Validation failed";
      return;
    }

    await load(); 
    form.reset(); 

        // Näytä onnistumisviesti
    formSuccess.textContent = "Lead added successfully!";
    setTimeout(() => formSuccess.textContent = "", 3000);
  } 
  catch (error) {
    formError.textContent = "Network error, try again.";
  }
});

// Fetch and display leads
async function load() {
    gridStatus.textContent = "Loading…"; // Näytä lataustila
    grid.innerHTML = ""; // Tyhjennä vanha sisältö

    const params = new URLSearchParams();
    if (q.value) params.set("q", q.value);
    if (statusSel.value) params.set("status", statusSel.value);

  try {
    const res = await fetch("/api/leads?" + params.toString());
    const leads = await res.json();

    if (leads.length === 0) {
      gridStatus.textContent = "No leads found.";
    } else {
      gridStatus.textContent = ""; // Tyhjennä status jos on dataa
    }

    renderLeads(leads);
  } catch (err) {
    gridStatus.textContent = "Failed to load leads.";
  }
}

// Render leads using DOM-API (safe)
function renderLeads(leads) {
  grid.innerHTML = ""; // Tyhjennetään taulukko

  leads.forEach(l => {
    const tr = document.createElement("tr");

    // Name
    const tdName = document.createElement("td");
    tdName.dataset.label = "Name";
    tdName.textContent = l.name || "";

    // Email
    const tdEmail = document.createElement("td");
    tdEmail.dataset.label = "Email";
    tdEmail.textContent = l.email || "";

    // Company
    const tdCompany = document.createElement("td");
    tdCompany.dataset.label = "Company";
    tdCompany.textContent = l.company || "";

    // Status
    const tdStatus = document.createElement("td");
    tdStatus.dataset.label = "Status";
    tdStatus.textContent = l.status || "";

    // Notes
    const tdNotes = document.createElement("td");
    tdNotes.dataset.label = "Notes";
    tdNotes.textContent = l.notes || "";

    // Action buttons
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

    // Liitetään kaikki solut riviin
    tr.append(tdName, tdEmail, tdCompany, tdStatus, tdNotes, tdActions);
    grid.appendChild(tr);
  });

  bindActions(); // Liitetään event listenerit action-napeille
}

// Attach click listeners to action buttons (status + delete)
function bindActions() {
  document.querySelectorAll("#grid button.link").forEach(b => {
    b.addEventListener("click", async () => {
      if (b.classList.contains("delete")) {
        // Confirm deletion
        if (!confirm("Are you sure you want to delete this lead?")) return;
        await fetch("/api/leads/" + b.dataset.id, {
          method: "DELETE"
        });
      } else {
        // Update status
        await fetch("/api/leads/" + b.dataset.id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: b.dataset.s })
        });
      }
      load(); // Refresh table after action
    });
  });
}

// Initial load
load();
