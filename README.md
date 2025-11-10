# Micro CRM Leads

A lightweight, browser-based CRM for managing leads. 
Built with **HTML, CSS, JavaScript, and Node.js/Express**, this project allows users to add, view, update, and delete leads with a clean, responsive interface.

## Core Functionality

- **Add new leads** with Name(required), Email (required), Company, Source, and Notes.  
- **Update lead status** using "Mark Contacted / Qualified / Lost" buttons.  
- **Delete leads** with confirmation.  
- **Search and filter** leads by name.  
- **Validation and feedback**: required fields, error messages, success messages.  
- **Responsive layout**: works on desktop and mobile.  

---
## Code Quality & Structure

- **Frontend**: `index.html`, `styles.css`, `app.js`  
- **Backend**: `server.js` with Express and JSON-based storage (`leads.json`)  
- **Clear separation of concerns**: API routes, rendering, and event handling separated.  
- **Readable and consistent naming** and structured comments throughout.  

---
## UX & Accessibility

- Keyboard-accessible forms and buttons.  
- Focus outlines visible for all interactive elements.  
- Status badges color-coded (New, Contacted, Qualified, Lost).  
- Loading and empty states visible and styled.  
- Safe data handling with error checks and JSON storage.  
- Dynamic content is sanitized to prevent XSS.  

---

## Installation

1. Clone the repository:

```bash
git clone [<repository-url>](https://github.com/TerhiPine/p1-leads)
cd p1-leads

2. Install dependencies:

npm install

3. Start the server:
npm start

4. Open your browser and navigate to:

http://localhost:3000
