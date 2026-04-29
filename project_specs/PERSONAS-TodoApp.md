# Personas: TodoApp

## Document Header

| Field | Value |
|-------|-------|
| Product Name | TodoApp |
| Document Date | 2026-04-29 |
| Related PRD | PRD-TodoApp.md |

---

## Persona Summary

| PER-ID | Name | Role | Primary Goal |
|--------|------|------|--------------|
| PER-01 | Alex Turner | Individual Task Manager | Quickly capture and complete daily tasks with zero friction |

---

## PER-01: Alex Turner

**Role & Context:**

Alex Turner is a busy professional who needs a quick, no-frills way to manage personal tasks throughout the day. They use their browser on desktop and mobile to track everything from grocery items to work reminders. Alex values speed and simplicity — they don't want to create accounts, configure settings, or learn new tools. They need to open the app, add a task in under 3 seconds, and get on with their day. The app serves as a personal productivity tool for managing daily responsibilities without overhead.

**Goals:**

- Add a new task within 3 seconds of opening the app (F0, F3)
- Mark tasks complete with a single click to track progress (F1)
- Remove completed or unwanted tasks quickly without confirmation dialogs (F2)
- Have tasks persist automatically so nothing is lost when closing the browser (F4)
- See at a glance how many tasks remain to stay organized (F5)

**Pain Points:**

- Frustrated by complex project management tools that require accounts and setup
- Loses productivity when task data isn't saved across sessions
- Annoyed by slow响应 times that interrupt workflow
- Overwhelmed by feature-heavy apps that obscure the core task list

**Technical Expertise:** High — comfortable with browser-based applications, expects modern, responsive UI

**Top Tasks:**

1. Add a new task via text input and enter key (daily, critical)
2. Toggle task completion status with checkbox click (multiple times daily, critical)
3. Delete a completed or unwanted task (as-needed, high)
4. View list of all tasks with completion status (daily, high)
5. Check remaining task count to gauge daily workload (daily, medium)

**Success Criteria:**

- Can add a task and see it in the list within 3 seconds of first use
- All task changes persist immediately with zero data loss
- Task operations complete in under 200ms
- Can use the app on mobile and desktop with consistent experience

---

## Persona Relationships

| From | To | Relationship |
|------|-----|--------------|
| PER-01 | — | Single-user application — no persona interactions required |

---

## Feature-Persona Matrix

| Feature | PER-01: Alex Turner |
|---------|---------------------|
| F0: Task Creation | Primary |
| F1: Task Completion | Primary |
| F2: Task Deletion | Primary |
| F3: Task List Display | Primary |
| F4: Data Persistence | Primary |
| F5: Task Counter/Stats | Primary |

---

*Document Version: 1.0*
*Generated: 2026-04-29*