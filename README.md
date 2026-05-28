# 📚 StudySync

A modern student productivity app built with vanilla HTML, CSS, and JavaScript.

---

## 🗂️ File Structure

```

StudySync-Academic-Task-Manager/
├── index.html      → App structure & all HTML
├── style.css       → All styles, themes, animations
├── app.js          → All logic, data, rendering
└── README.md       → This file
```

---

## 🚀 How to Run

Just open `index.html` in any browser. No build step, no npm, no server needed.

```
Double click index.html → Done ✅
```

Demo credentials:
- **Email:** demo@studysync.app
- **Password:** demo123

---

## ✨ Features

### 📋 Assignments
- Add, edit, delete tasks
- Priority levels (High / Medium / Low)
- Subject-wise categorization
- Due date tracking with overdue alerts
- Click any card to see full task detail

### 👥 Group Tasks (Kanban)
- Todo → In Progress → Done columns
- Assign members, set due dates
- Click card to edit details

### 📅 Calendar
- Monthly view with task dots
- Click any day to see tasks
- Color coded by priority

### 🔔 Reminders
- Auto-generated from tasks with due dates
- Color coded: 🔴 Overdue, 🟡 Due Soon, 🟢 On Track
- Click to view task detail

### ⏱️ Pomodoro Timer
- Flip clock style UI
- Focus (25 min) / Short Break (5 min) / Long Break (15 min)
- Session tracking with log

### 📝 Notes
- Color coded sticky notes
- Click to edit any note

### 🏠 Dashboard
- Live stats with count-up animation
- Priority bars with **hover tooltip** — shows which tasks are pending
- Subject breakdown bars with hover popup
- Due this week preview
- Upcoming tasks list

---

## 🎨 UI Highlights

| Feature | Details |
|---|---|
| 🌙 Dark / Light Mode | Toggle via moon/sun button in topbar |
| ✨ Glassmorphism | Cards and sidebar with blur effect |
| 🌊 Floating Orbs | Ambient background animation |
| 💫 Page Transitions | Smooth slide-in on every view switch |
| 🖱️ Ripple Effect | Click ripple on all buttons |
| 📊 Animated Numbers | Dashboard stats count up on load |
| 🔢 Flip Clock | Bebas Neue font, dark cards, golden dots |
| 🎯 Progress Bars | Hover to see task list popup per category |

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, animations, glassmorphism, `backdrop-filter`
- **Vanilla JS** — no frameworks, no dependencies
- **Google Fonts** — Syne (headings), DM Sans (body), Bebas Neue (flip clock)
- **localStorage** — data persists across sessions

---

## 📦 Versions Log

| Version | What changed |
|---|---|
| v1–v2 | Initial project |
| v3–v8 | Flip clock timer (CSS/font/overlap fixes) |
| v9 | Dark/light mode, glassmorphism, transitions |
| v10 | Loading screen, ripple, orbs, number animation |
| v11 | Dashboard items clickable |
| v12 | All cards clickable app-wide, progress bar hover popups, split into 3 files |

---

## 💡 Debugging Lessons Learned

This project was built as part of **Learn_Debugging** — here's what we fixed:

1. **Wrong UI output** → Expected vs Actual comparison
2. **Font overflow** → Bebas Neue too wide, switched to correct sizing
3. **Digit overlap** → Split top/bottom halves showing different values — fixed with single `card-face` approach
4. **CSS not applying** → String mismatch in Python replace — fixed with exact character matching
5. **Buttons not clickable** → `event.stopPropagation()` needed on child buttons inside clickable parent
