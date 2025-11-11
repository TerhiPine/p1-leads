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

- Application improvements: More advanced email validation (regex), backend development with user management (login). Better error-handling and better responsiveness (UX). 

- Project was an great opportunity to deepen my understanding of full-stack web development, building a small-scale CRM system from scratch was really great opportunity to see what I can already do. 

- Frontend; I deepened my basic `HTML`, `CSS`, and `JavaScript` skills. I learned more about DOM manipulation, event handling, making eventlisteners and form validations. Adding responsive design and dynamic status badges made nice addition to delivering better user experience. 

- Backend: I practiced building a lightweight application with `Node.js` and `Express`. Reading and writing  JSON files in safe way gave me hands-on experience in asynchronous file handling, error checking, and simple data manipulation. I also implemented standard CRUD operations—Create, Read, Update, Delete—allowing leads to be added, updated, or removed while ensuring proper error handling. User can also modify notes later.

- Integrating the frontend with the backend reinforced concepts of asynchronous communication with fetch requests, handling promises, and updating the UI dynamically based on server responses. I also became more aware of security and usability concerns, including input sanitization, basic email validation, and consistent state management. Overall, this project deepened my skills in combining frontend and backend development, creating an interactive and functional web application that could serve as a foundation for more advanced application later on.

- While making video and self reflection, I see easily things to make better or cleaner code-wise. I think that tells story how this project taught me and is still teaching and I will keep learning. 

## Rubric for grading

- I see that I got all needed features implemented to project for 20pts.
- Core functionality, Code quality & architecture: Application works as its meant to, code is structured and commented that way, that outsider will understand what is gong on. Frontend is separated from backend, which makes managing files and core easier.
-  UX, Accessibility & Data Handling: Error/success messaging, responsive layout (mobile first), `aria-live` for screen readers. Frontend uses `fetch` + JSON, validation in the both ends - on the user and server. `readLeadsAsync` and `writeLeadsAsync` are safe way to handle inputs.
