// Get references to key elements in the HTML for later use
const grid = document.querySelector("#grid tbody"); // Table body
const form = document.querySelector("#newLead");   // 'Add lead' form
const q = document.querySelector("#q");           // Search input
const statusSel = document.querySelector("#status"); // Status
const formError = document.querySelector("#formError"); // For validation errors

// Apply filters button
document.querySelector("#applyFilters").addEventListener("click", load);

// Form submit with client-side validation
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = ""; // Clear previous errors

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
  } 
  catch (error) {
    formError.textContent = "Network error, try again.";
  }
});

// Fetch and display leads
async function load() {
  const params = new URLSearchParams();
  if (q.value) params.set("q", q.value);
  if (statusSel.value) params.set("status", statusSel.value);

  const res = await fetch("/api/leads?" + params.toString());
  const leads = await res.json();

  renderLeads(leads);
}

// Render leads using DOM-API (safe)
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
    tdStatus.textContent = l.status || "";

    const tdActions = document.createElement("td");
    tdActions.dataset.label = "Actions";

    // Status buttons
    ["Contacted", "Qualified", "Lost"].forEach(s => {
      const btn = document.createElement("button");
      btn.className = "link";
      btn.type = "button";
      btn.dataset.id = l.id;
      btn.dataset.s = s;
      btn.textContent = `Mark ${s.toLowerCase()}`;
      tdActions.appendChild(btn);
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "link delete";
    delBtn.type = "button";
    delBtn.dataset.id = l.id;
    delBtn.textContent = "Delete";
    tdActions.appendChild(delBtn);

    tr.append(tdName, tdEmail, tdCompany, tdStatus, tdActions);
    grid.appendChild(tr);
  });

  bindActions(); // Attach click listeners to buttons
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
