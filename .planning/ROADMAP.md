# Todo App Roadmap

## Overview

**Project:** Todo App
**Core Value:** A simple, fast way to manage daily tasks with create, complete, and delete functionality.
**Total v1 Requirements:** 3
**Granularity:** Standard

## Phases

- [ ] **Phase 1: Backend API** - Express server with CRUD endpoints for task management
- [ ] **Phase 2: Frontend UI** - React interface with create, complete, and delete functionality

---

## Phase Details

### Phase 1: Backend API

**Goal:** Users can perform all task operations via REST API

**Depends on:** Nothing (first phase)

**Requirements:**
- CREATE-01: User can add new tasks
- COMPLETE-01: User can mark tasks as done
- DELETE-01: User can remove tasks

**Success Criteria** (what must be TRUE):
1. User can create a new task via POST /api/tasks endpoint
2. User can retrieve all tasks via GET /api/tasks endpoint
3. User can mark a task as complete via PATCH /api/tasks/:id endpoint
4. User can delete a task via DELETE /api/tasks/:id endpoint
5. API persists tasks so they persist across server restarts

**Plans:** 1 plan

**Plan list:**
- [ ] 01-01-PLAN.md — Express backend with CRUD API and JSON file persistence

---

**Status**: awaiting verify
### Phase 2: Frontend UI

**Goal:** Users can interact with tasks through a React interface

**Depends on:** Phase 1 (backend API must be running)

**Requirements:**
- CREATE-01: User can add new tasks
- COMPLETE-01: User can mark tasks as done
- DELETE-01: User can remove tasks

**Success Criteria** (what must be TRUE):
1. User sees a text input to create new tasks
2. User sees a list of all existing tasks
3. User can click a checkbox/button to mark tasks as complete
4. User can click a delete button to remove tasks
5. Frontend communicates correctly with backend API endpoints

**Plans:** TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend API | 1/1 | Ready to execute | - |
| 2. Frontend UI | 0/1 | Not started | - |

---

## Coverage Map

| Requirement | Phase | Status |
|-------------|-------|--------|
| CREATE-01 (User can add new tasks) | Phase 1, 2 | Pending |
| COMPLETE-01 (User can mark tasks as done) | Phase 1, 2 | Pending |
| DELETE-01 (User can remove tasks) | Phase 1, 2 | Pending |

**Mapped:** 3/3 requirements ✓
**Notes:** All requirements are implemented in both phases - backend (Phase 1) provides API capability, frontend (Phase 2) provides user interface.