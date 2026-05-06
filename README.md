# ⬡ StudySync — Academic Task Manager

> A lightweight, responsive web app that helps students track assignments, collaborate on group tasks, and never miss a deadline.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Agile](https://img.shields.io/badge/Methodology-Scrum%20Agile-F97316?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Agile / Scrum Process](#agile--scrum-process)
- [Team](#team)

---

## 📖 About the Project

StudySync was built as part of a **Project-Based Learning (PBL)** assignment using the **Scrum Agile methodology**. The goal was to solve a real student problem — managing multiple assignments, group tasks, and deadlines — with a simple, purpose-built web application.

The project was planned and delivered across **3 Sprints of 3 weeks each**, with daily standups, sprint reviews, and retrospectives following standard Scrum practices.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 **Assignment Tracker** | Add assignments with title, subject, due date, priority (High / Medium / Low), and notes |
| ✅ **Task Completion** | Mark tasks as done with a single click; completed tasks are visually struck through |
| 📊 **Live Dashboard** | Real-time stats — Total, Pending, Completed, and Overdue task counts |
| 🔍 **Smart Filters** | Filter assignments by All / Pending / Completed / Overdue |
| 👥 **Group Kanban Board** | Create group tasks, assign members, and track status across To Do → In Progress → Done |
| 📅 **Calendar View** | Monthly calendar showing all assignment deadlines; navigate months freely |
| 🔔 **Deadline Reminders** | Urgency-coded reminders — 🔴 Overdue, 🟡 Due soon, 🟢 On track |
| 🔴 **Overdue Badge** | Notification badge in the header shows live count of overdue tasks |
| 💾 **Persistent Storage** | All data saved to `localStorage` — survives browser refresh and session close |
| 📱 **Mobile Responsive** | Fully responsive layout with hamburger menu for small screens |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, flexbox, grid, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser `localStorage` |
| Fonts | Google Fonts — Syne + DM Sans |
| Design | Figma (wireframes & mockups) |
| Version Control | Git + GitHub |
| Task Tracking | Trello / Jira |
| Methodology | Scrum (Agile) |

---

## 📁 Project Structure

```
studysync/
├── index.html      # App structure — all 5 views (Dashboard, Assignments, Groups, Calendar, Reminders)
├── style.css       # Full styling — dark theme, sidebar, modals, kanban, calendar, responsive
├── app.js          # Application logic — state management, rendering, localStorage, events
└── README.md       # You are here
```

> No build tools, no frameworks, no dependencies. Just open `index.html` in a browser and it works.

---

## 🚀 Getting Started

### Option 1 — Open Directly (Simplest)

1. Clone or download this repository
2. Open `index.html` in any modern browser

```bash
git clone https://github.com/YOUR_USERNAME/studysync.git
cd studysync
# Open index.html in your browser
```

### Option 2 — Live Server (Recommended for development)

If you have VS Code with the **Live Server** extension:

1. Open the project folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 3 — GitHub Pages (Deploy for free)

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder `/`
4. Your app will be live at `https://YOUR_USERNAME.github.io/studysync/`

---

## 📸 Screenshots

> *(Replace these with actual screenshots after running the app)*

| Dashboard | Assignments |
|---|---|
| ![Dashboard](https://via.placeholder.com/400x250/0d0f14/F97316?text=Dashboard) | ![Assignments](https://via.placeholder.com/400x250/0d0f14/3b82f6?text=Assignments) |

| Group Kanban | Calendar |
|---|---|
| ![Kanban](https://via.placeholder.com/400x250/0d0f14/22c55e?text=Kanban+Board) | ![Calendar](https://via.placeholder.com/400x250/0d0f14/a855f7?text=Calendar) |

---

## 🔄 Agile / Scrum Process

This project was developed using the **Scrum framework** across 3 sprints:

### Sprint Overview

| Sprint | Duration | Focus | Story Points |
|---|---|---|---|
| Sprint 1 | Weeks 3–5 | Assignment CRUD, Dashboard, Filters | 11 |
| Sprint 2 | Weeks 6–8 | Kanban Board, Calendar View | 20 |
| Sprint 3 | Weeks 9–11 | Reminders, Persistence, Responsiveness | 13 |
| Buffer | Weeks 12–14 | Bug fixes, final review, presentation | — |

### Scrum Roles

| Role | Responsibility |
|---|---|
| **Product Owner** | Defines user stories, sets priorities, accepts completed work |
| **Scrum Master** | Facilitates standups, removes blockers, ensures Agile practices |
| **Development Team** | Implements features, writes tests, performs code reviews |

### Artefacts Produced
- ✅ Product Backlog (15 User Stories)
- ✅ Sprint Backlogs (3 sprints)
- ✅ Burndown Chart
- ✅ Daily Standup Logs
- ✅ Sprint Review & Retrospective Notes
- ✅ Agile Project Report (`.docx`)
- ✅ Working Prototype (this repository)

---

## 👥 Team

| Name | Role |
|---|---|
| Member Name 1 | Product Owner |
| Member Name 2 | Scrum Master |
| Member Name 3 | Developer |
| Member Name 4 | Developer / QA |

> *Replace with actual team member names before submitting.*

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for educational purposes.

---

<div align="center">
  Made with ☕ and Scrum by Team Agile Coders
</div>
