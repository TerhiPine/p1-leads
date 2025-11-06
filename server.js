// Import built-in Node.js modules
const path = require("path"); // For handling file paths
const fs = require("fs");   // For reading/writing files (File System)

// Import third-party module (from 'npm i express')
const express = require("express");
const app = express(); // Initialise the Express application

// Set up port. Use cloud's port if available, otherwise default to 3000
const PORT = process.env.PORT || 3000;
// Define the absolute path to our JSON data file. '__dirname' is the current folder.
const DATA = path.join(__dirname, "leads.json");

const fsPromises = require("fs").promises;

// --- 3. Middleware Configuration ---
// 'app.use()' adds middleware. Middleware runs on *every* request before our routes.
// This middleware parses incoming request bodies with URL-encoded payloads (like HTML forms).
app.use(express.urlencoded({ extended: true }));
// This middleware parses incoming request bodies with JSON payloads (e.g., from 'fetch' in our app.js).
app.use(express.json());
// This middleware serves static files (HTML, CSS, JS) from the 'public' directory automatically.
app.use(express.static(path.join(__dirname, "public")));

// --- 4. Data Helper Functions ---
// This function safely reads the leads from 'leads.json'.
// Asynkroninen safe read
async function readLeadsAsync() {
  try {
    await fsPromises.access(DATA);           // Tarkistetaan, että tiedosto on olemassa
    const content = await fsPromises.readFile(DATA, "utf8");
    return content ? JSON.parse(content) : []; // Palauta tyhjä lista jos tiedosto tyhjä
  } catch (err) {
    console.error("Failed to read leads.json:", err);
    return []; // Palauta aina tyhjä lista virheen sattuessa
  }
}

// Asynkroninen safe write
async function writeLeadsAsync(leads) {
  try {
    await fsPromises.writeFile(DATA, JSON.stringify(leads || [], null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write leads.json:", err);
  }
}

/* --- 5. API Routes (The server's brain) --- */

// [R]ead: Handle GET requests to '/api/leads' to read and filter all leads.
app.get("/api/leads", async (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const status = (req.query.status || "").toLowerCase();

  let list = await readLeadsAsync(); // async read

  if (q) list = list.filter(l => (l.name + l.company).toLowerCase().includes(q));
  if (status) list = list.filter(l => l.status.toLowerCase() === status);

  res.json(list);
});


// [C]reate: Handle POST requests to '/api/leads' to create a new lead.
app.post("/api/leads", async (req, res) => {
  const {name, email, company, source, notes} = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

  const leads = await readLeadsAsync(); // async read

  const lead = {
    id: Date.now().toString(),
    name,
    email,
    company: company || "",
    source: source || "",
    notes: notes || "",
    status: "New",
    createdAt: new Date().toISOString()
  };

  leads.push(lead);
  await writeLeadsAsync(leads); // async write

  res.status(201).json(lead);
});


// [U]pdate: Handle PATCH requests to '/api/leads/:id' to update a lead.
app.patch("/api/leads/:id", async (req, res) => {
  const leads = await readLeadsAsync(); // async read
  const idx = leads.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const allowed = ["status", "notes"];
  for (const k of allowed) {
    if (req.body[k] !== undefined) {
      leads[idx][k] = req.body[k];
    }
  }

  await writeLeadsAsync(leads); // async write
  res.json(leads[idx]);
});


// --- 6. Root Route ---
// Handle GET requests to the root URL (e.g., http://localhost:3000/)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// --- 7. Server Start ---
// Start the server and listen for connections on the defined PORT.
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));