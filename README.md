# Micro CRM Leads

A lightweight, browser-based CRM for managing leads. 
Built with **HTML, CSS, JavaScript, and Node.js/Express**, this project allows users to add, view, update, and delete leads with a clean, responsive interface.

# Live Deployment

Live: https://micro-crm-leads.onrender.com/

## Prerequisites

You must have Node.js (version 18 or later) installed.

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

```bash
git clone <https://github.com/TerhiPine/p1-leads.git>
cd p1-leads
npm install
node server.js
```

## Improvements & Learning

- More advanced email validation (regex), backend development with user management (login).

- Project was an great opportunity to deepen my understanding of full-stack web development, particularly in building a small-scale CRM system from scratch. 

- Frontend; I deepened my core `HTML`, `CSS`, and `JavaScript` skills. I stepped into DOM manipulation, event handling, making eventlisteners and form validations. Adding responsive design and dynamic status badges strengthened made nice addition to delivering better user experiene. 

- Backend: I practiced building a lightweight RESTful API with `Node.js` and `Express`. Reading and writing  JSON files in safe way gave me hands-on experience in asynchronous file handling, error checking, and simple data manipulation. I also implemented standard CRUD operations—Create, Read, Update, Delete—allowing leads to be added, updated, or removed while ensuring proper error handling.

- Integrating the frontend with the backend reinforced concepts of asynchronous communication with fetch requests, handling promises, and updating the UI dynamically based on server responses. I also became more aware of security and usability concerns, including input sanitization, basic email validation, and consistent state management. Overall, this project consolidated my skills in combining frontend and backend development, creating an interactive and functional web application that could serve as a foundation for more advanced CRM features in the future.
