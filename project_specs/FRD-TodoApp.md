# Functional Requirements Document: TodoApp

## 1. Introduction

### 1.1 Purpose

This Functional Requirements Document (FRD) provides detailed specifications for the TodoApp application, transforming the high-level features defined in the Product Requirements Document (PRD) into implementation-ready requirements. This document serves as the definitive reference for developers building the TodoApp, ensuring all behavioral details, validation rules, and error handling scenarios are clearly defined.

### 1.2 Scope

This FRD covers all features from the PRD including Task Creation (F0), Task Completion (F1), Task Deletion (F2), Task List Display (F3), Data Persistence (F4), and Task Counter/Stats (F5). The application is a React-based single-page application with a Node/Express backend, using browser localStorage for data persistence in version 1.

### 1.3 Architecture Overview

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React 18+ | Single-page application with client-side state management |
| Backend API | Node.js + Express | RESTful API endpoint serving task operations |
| Data Storage | Browser localStorage | Client-side persistence for v1 (no server database) |
| HTTP Client | Fetch API or Axios | Communication between frontend and backend |

### 1.4 Assumptions

- Users access the application via modern web browsers (Chrome, Firefox, Safari, Edge)
- No authentication or user accounts required for v1
- Single-user experience only (no sharing/syncing)
- Data stored exclusively in browser localStorage

---

## 2. Feature Specifications

### 2.1 Task Creation (F0)

**Description:** This feature enables users to add new tasks to their todo list. When a user enters task text and submits, the system validates the input, generates a unique identifier, assigns a creation timestamp, saves the task to localStorage, and immediately displays it in the task list. The feature ensures no empty or invalid tasks can be created through comprehensive input validation.

**Terminology:**
- **Task:** A single to-do item with text, completion status, unique ID, and timestamps
- **Task Text:** The user-provided description of what needs to be done
- **Task ID:** A globally unique identifier (UUID v4) assigned upon task creation
- **Creation Timestamp:** Date/time recorded when the task was originally created
- **Submit:** The action of sending the task input for processing

**Sub-features:**
- Text input field with placeholder text guidance
- Submit via Enter key press or dedicated submit button
- Real-time validation feedback as user types
- Automatic focus management for continuous task entry
- Keyboard accessible input field

**Process:**
1. User navigates to the application and sees the task input field
2. User clicks the input field or presses Tab to focus it
3. User types the task description (minimum 1 character, maximum 500 characters)
4. User presses Enter or clicks the Submit button
5. System validates the input (checks for empty, whitespace-only, or excessive length)
6. If valid, system generates a unique task ID using UUID v4
7. System captures the current timestamp as the creation time
8. System saves the new task object to localStorage
9. System updates the React state to include the new task
10. System clears the input field and maintains focus for the next entry
11. UI re-renders to display the new task at the top of the list

**Inputs:**
- `taskText` (string, required): The task description entered by the user

**Validation:**
- Task text must not be empty after trimming whitespace
- Task text must not exceed 500 characters
- Task text must not consist only of whitespace
- Leading and trailing whitespace should be trimmed before storage

**Outputs:**
- New task object with properties: id (string), text (string), completed (boolean), createdAt (ISO timestamp), updatedAt (ISO timestamp)
- UI update showing the new task in the list
- Updated task count in the statistics display

**Error States:**
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Empty task text | 400 | EMPTY_TASK_TEXT | "Task cannot be empty" |
| Task text exceeds limit | 400 | TASK_TOO_LONG | "Task must be 500 characters or less" |
| Whitespace-only input | 400 | INVALID_TASK_TEXT | "Task cannot be only whitespace" |
| localStorage full | 507 | STORAGE_ERROR | "Unable to save task. Storage may be full." |
| localStorage unavailable | 503 | STORAGE_UNAVAILABLE | "Storage unavailable. Please check browser settings." |

---

### 2.2 Task Completion (F1)

**Description:** This feature allows users to mark tasks as complete or incomplete by toggling their completion status. When a user clicks the checkbox or completion indicator, the system updates the task's completed status, modifies the visual styling (applying strikethrough and dimming), saves the change to localStorage, and updates any related statistics. Completed tasks remain visible in the list but are visually distinguished from active tasks.

**Terminology:**
- **Completion Status:** Boolean flag indicating whether a task is done (true) or pending (false)
- **Toggle:** The action of switching between completed and incomplete states
- **Visual Distinction:** Styling applied to completed tasks (strikethrough text, reduced opacity, checkmark indicator)
- **Filter View:** Option to show only active, only completed, or all tasks

**Sub-features:**
- Clickable checkbox or completion button for each task
- Visual feedback on hover indicating interactivity
- Strikethrough styling applied to completed task text
- Reduced opacity (0.6) for completed tasks to de-emphasize
- Checkmark icon displayed for completed tasks
- Filter controls to show All/Active/Completed tasks

**Process:**
1. User views the task list with all tasks displayed
2. User hovers over a task to reveal the completion toggle
3. User clicks the checkbox or completion button
4. System reads the current completion status from the task object
5. System toggles the boolean value (true becomes false, false becomes true)
6. System updates the updatedAt timestamp to reflect the change
7. System saves the modified task to localStorage
8. System updates the React state with the new completion status
9. UI re-renders applying appropriate visual styling
10. Task counter updates to reflect new completion count
11. If filter is active, task may show or hide based on new status

**Inputs:**
- `taskId` (string, required): The unique identifier of the task to toggle
- `completed` (boolean, required): The new completion status

**Validation:**
- Task ID must exist in the task list
- Completed status must be a valid boolean value
- User must have permission to modify the task (implicit: same browser session)

**Outputs:**
- Updated task object with toggled completed status
- Visual update showing new completion state (or filter adjustment if applicable)
- Updated count in statistics display

**Error States:**
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Task not found | 404 | TASK_NOT_FOUND | "Task not found" |
| Invalid task ID format | 400 | INVALID_TASK_ID | "Invalid task identifier" |
| Toggle operation failed | 500 | TOGGLE_FAILED | "Unable to update task status" |
| localStorage error | 507 | STORAGE_ERROR | "Failed to save task update" |

---

### 2.3 Task Deletion (F2)

**Description:** This feature enables users to remove tasks from their todo list permanently. When a user clicks the delete button adjacent to a task, the system immediately removes the task from the React state and localStorage without requiring confirmation (for speed). Deleted tasks cannot be recovered within the application, though they remain in localStorage until overwritten.

**Terminology:**
- **Delete:** The action of permanently removing a task from the list
- **Delete Button:** UI element (icon or text) adjacent to each task for removal
- **Permanent Removal:** Action cannot be undone within the application
- **Task Removal:** Process of deleting a task from all storage

**Sub-features:**
- Delete button/icon displayed on each task row
- Hover state revealing the delete option
- Immediate removal from UI upon click
- Immediate removal from localStorage
- No confirmation dialog (speed-optimized for v1)
- Optional: future consideration for undo delete (not in v1 scope)

**Process:**
1. User views the task list with delete buttons visible on hover
2. User hovers over the task they wish to delete
3. User clicks the delete icon/button
4. System receives the task ID from the click event
5. System validates the task ID exists in the task list
6. System removes the task from the React state array
7. System removes the task from localStorage
8. UI re-renders without the deleted task
9. Task counter updates to reflect new total

**Inputs:**
- `taskId` (string, required): The unique identifier of the task to delete

**Validation:**
- Task ID must exist in the current task list
- Task ID must be a valid UUID format

**Outputs:**
- Task removed from display
- Updated task count
- Empty state displayed if last task was deleted

**Error States:**
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Task not found | 404 | TASK_NOT_FOUND | "Task not found" |
| Invalid task ID | 400 | INVALID_TASK_ID | "Invalid task identifier" |
| Delete failed | 500 | DELETE_FAILED | "Unable to delete task" |
| localStorage error | 507 | STORAGE_ERROR | "Failed to remove task" |

---

### 2.3 Task List Display (F3)

**Description:** This feature handles the presentation of all tasks in a clear, scrollable list format. The application displays tasks with their text, completion status, and available action buttons. Newest tasks appear at the top by default. The interface is responsive and adapts to various screen sizes. When no tasks exist, an empty state message encourages the user to add their first task.

**Terminology:**
- **Task List:** The UI component displaying all task items
- **Empty State:** Message shown when no tasks exist
- **Responsive Layout:** UI that adapts to different screen widths
- **Task Item:** A single row/card displaying one task with its actions

**Sub-features:**
- Vertical scrollable list of task items
- Each task shows: text, completion status, action buttons
- Newest-first ordering (by createdAt descending)
- Empty state with helpful message and call-to-action
- Responsive design: single column on mobile, optimized width on desktop
- Completion status clearly indicated with icon

**Process:**
1. Application loads on user visit
2. System retrieves all tasks from localStorage
3. System sorts tasks by createdAt (newest first)
4. System renders each task as a list item
5. Each item shows task text and completion checkbox
6. Action buttons (complete toggle, delete) appear on hover
7. If no tasks exist, display empty state message
8. User can scroll through list if items exceed viewport

**Inputs:**
- `tasks` (array): All task objects retrieved from localStorage

**Validation:**
- Task data must be parsed as valid JSON
- Missing or corrupted task data handled gracefully (logged, skipped)

**Outputs:**
- Rendered list of task items
- Each item displays: checkbox, task text, delete button
- Empty state when no tasks exist
- Scroll container when list exceeds viewport height

**Error States:**
| Scenario | Behavior |
|----------|----------|
| Corrupted localStorage data | Log error, skip corrupted items, display valid tasks |
| localStorage unavailable | Display error message, disable task operations |
| Empty task array | Show empty state with "Add your first task" message |

---

### 2.4 Data Persistence (F4)

**Description:** This feature ensures task data persists across browser sessions. Every task operation (create, update, delete) triggers an immediate save to browser localStorage. On application startup, all saved tasks are loaded and restored to the React state. The feature handles storage quota limits and provides graceful error handling when storage is unavailable or full.

**Terminology:**
- **localStorage:** Browser key-value storage API for persistent data
- **Auto-save:** Automatic saving triggered on every data change
- **Load:** Retrieval of saved data on application startup
- **Storage Quota:** Maximum storage capacity (typically 5-10MB per origin)
- **Serialization:** Converting JavaScript objects to JSON strings for storage

**Sub-features:**
- Auto-save on task creation
- Auto-save on task completion toggle
- Auto-save on task deletion
- Load all tasks on application mount
- Serialize tasks as JSON array
- Handle storage quota exceeded errors
- Handle localStorage unavailable errors

**Process:**
1. Application initializes on page load
2. System attempts to read from localStorage key "todoapp_tasks"
3. If data exists, parse JSON and restore to React state
4. If no data exists, initialize with empty array
5. User performs task operation (create/update/delete)
6. System updates React state
7. System serializes entire task array to JSON
8. System writes to localStorage with key "todoapp_tasks"
9. If write succeeds, operation complete
10. If write fails, display error notification

**Inputs:**
- No direct user input — this is a background feature

**Validation:**
- localStorage must be available in the browser
- Data must be valid JSON when parsing
- Storage quota must not be exceeded (catch error)

**Outputs:**
- Persisted task data survives browser refresh
- Data available after browser restart
- Error notification if persistence fails

**Error States:**
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| localStorage unavailable | 503 | STORAGE_UNAVAILABLE | "Browser storage is not available" |
| Storage quota exceeded | 507 | QUOTA_EXCEEDED | "Storage full. Please delete some tasks." |
| JSON parse error | 500 | CORRUPTED_DATA | "Unable to load saved tasks" |
| Write failed | 507 | SAVE_FAILED | "Failed to save tasks" |

**Data Schema (localStorage):**

```json
{
  "todoapp_tasks": [
    {
      "id": "uuid-v4-string",
      "text": "Task description",
      "completed": false,
      "createdAt": "2026-04-29T10:30:00.000Z",
      "updatedAt": "2026-04-29T10:30:00.000Z"
    }
  ]
}
```

---

### 2.5 Task Counter/Stats (F5)

**Description:** This feature displays simple statistics about the task list to help users track their progress. The display shows the count of remaining (incomplete) tasks and optionally the count of completed tasks. These counts update in real-time as users create, complete, or delete tasks. The statistics are displayed prominently at the top of the task list for quick reference.

**Terminology:**
- **Remaining Tasks:** Count of tasks where completed is false
- **Completed Tasks:** Count of tasks where completed is true
- **Total Tasks:** Combined count of all tasks
- **Real-time Update:** Statistics refresh immediately on any task change

**Sub-features:**
- Display count of remaining/incomplete tasks
- Optionally display count of completed tasks
- Optionally display total task count
- Update counts on task creation (increment remaining)
- Update counts on task completion (decrement remaining, increment completed)
- Update counts on task deletion (decrement appropriate counter)

**Process:**
1. Application calculates initial counts from task array
2. System filters tasks by completed status for counts
3. System displays statistics in header area
4. User creates new task
5. System increments remaining count
6. User toggles task completion
7. System transfers count between remaining and completed
8. User deletes a task
9. System decrements appropriate counter
10. UI updates statistics display immediately

**Inputs:**
- `tasks` (array): Current array of all task objects

**Validation:**
- Tasks array must be valid (not null/undefined)

**Outputs:**
- Display showing remaining task count (e.g., "3 tasks left")
- Optional: completed count display (e.g., "2 completed")
- Optional: total count display (e.g., "5 total")

**Error States:**
| Scenario | Behavior |
|----------|----------|
| Unable to calculate counts | Display "--" or hide statistics |
| No tasks exist | Display "0 tasks left" |

---

## 3. API Endpoints

### 3.1 API Design

The following RESTful endpoints are defined for task operations. In v1, these endpoints interact with localStorage on the client side rather than a server database, but the API structure is designed for future server-side implementation.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Retrieve all tasks |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update a task (completion status) |
| DELETE | /api/tasks/:id | Delete a task |

### 3.2 GET /api/tasks

**Description:** Retrieve all tasks from storage.

**Request:**
```
GET /api/tasks
Headers:
  Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4-string",
      "text": "Task description",
      "completed": false,
      "createdAt": "2026-04-29T10:30:00.000Z",
      "updatedAt": "2026-04-29T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### 3.3 POST /api/tasks

**Description:** Create a new task.

**Request:**
```
POST /api/tasks
Headers:
  Content-Type: application/json
Body:
{
  "text": "Task description"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4-string",
    "text": "Task description",
    "completed": false,
    "createdAt": "2026-04-29T10:30:00.000Z",
    "updatedAt": "2026-04-29T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "EMPTY_TASK_TEXT",
    "message": "Task cannot be empty"
  }
}
```

### 3.4 PUT /api/tasks/:id

**Description:** Update a task's completion status.

**Request:**
```
PUT /api/tasks/:id
Headers:
  Content-Type: application/json
Body:
{
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4-string",
    "text": "Task description",
    "completed": true,
    "createdAt": "2026-04-29T10:30:00.000Z",
    "updatedAt": "2026-04-29T10:35:00.000Z"
  }
}
```

### 3.5 DELETE /api/tasks/:id

**Description:** Delete a task by ID.

**Request:**
```
DELETE /api/tasks/:id
Headers:
  Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4-string"
  }
}
```

---

## 4. Database Schema

### 4.1 localStorage Data Structure

Tasks are stored in browser localStorage under the key `todoapp_tasks`. The structure is a JSON array of task objects.

**Storage Key:** `todoapp_tasks`

**Data Type:** JSON Array (stringified)

### 4.2 Task Object Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID v4) | Yes | Unique identifier |
| text | string | Yes | Task description (1-500 chars) |
| completed | boolean | Yes | Completion status (default: false) |
| createdAt | ISO 8601 string | Yes | Creation timestamp |
| updatedAt | ISO 8601 string | Yes | Last update timestamp |

### 4.3 Example localStorage Entry

```
Key: todoapp_tasks
Value: [{"id":"550e8400-e29b-41d4-a716-446655440000","text":"Buy groceries","completed":false,"createdAt":"2026-04-29T10:30:00.000Z","updatedAt":"2026-04-29T10:30:00.000Z"},{"id":"550e8400-e29b-41d4-a716-446655440001","text":"Walk the dog","completed":true,"createdAt":"2026-04-29T09:00:00.000Z","updatedAt":"2026-04-29T09:15:00.000Z"}]
```

---

## 5. Error Handling

### 5.1 Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### 5.2 Error Codes Reference

| Code | Description | HTTP Status |
|------|-------------|-------------|
| EMPTY_TASK_TEXT | Task text is empty | 400 |
| TASK_TOO_LONG | Task text exceeds 500 characters | 400 |
| INVALID_TASK_TEXT | Task text is only whitespace | 400 |
| INVALID_TASK_ID | Task ID format is invalid | 400 |
| TASK_NOT_FOUND | Task with given ID does not exist | 404 |
| STORAGE_UNAVAILABLE | Browser localStorage is not available | 503 |
| STORAGE_ERROR | General localStorage error | 507 |
| QUOTA_EXCEEDED | localStorage quota exceeded | 507 |
| SAVE_FAILED | Failed to save to localStorage | 500 |
| DELETE_FAILED | Failed to delete task | 500 |
| TOGGLE_FAILED | Failed to toggle task status | 500 |

### 5.3 Client-Side Error Handling

| Scenario | User Experience |
|----------|-----------------|
| Empty task submission | Show inline error message below input, do not clear input |
| localStorage full | Show toast notification with error, suggest deleting tasks |
| localStorage unavailable | Show persistent banner, disable all write operations |
| Corrupted data | Log error, show valid tasks, notify user partial data loaded |

---

## 6. Validation Rules Summary

### 6.1 Input Validation

| Field | Rule | Error Code |
|-------|------|------------|
| taskText | Required, trimmed length > 0 | EMPTY_TASK_TEXT |
| taskText | Maximum 500 characters | TASK_TOO_LONG |
| taskText | Not whitespace only | INVALID_TASK_TEXT |
| taskId | Valid UUID format | INVALID_TASK_ID |
| completed | Boolean value | INVALID_STATUS |

### 6.2 Storage Validation

| Check | Error Code |
|-------|------------|
| localStorage available | STORAGE_UNAVAILABLE |
| Storage not full | QUOTA_EXCEEDED |
| JSON parseable | CORRUPTED_DATA |
| Write successful | SAVE_FAILED |

---

## 7. Component Architecture

### 7.1 React Components

| Component | Responsibility |
|-----------|---------------|
| App | Root component, state management |
| TaskInput | Text input and submit for new tasks |
| TaskList | Container for task items |
| TaskItem | Individual task display with actions |
| TaskStats | Display task counts |
| EmptyState | Message when no tasks exist |

### 7.2 State Management

```javascript
// Application state structure
{
  tasks: [
    {
      id: string,
      text: string,
      completed: boolean,
      createdAt: string,
      updatedAt: string
    }
  ],
  filter: 'all' | 'active' | 'completed',
  loading: boolean,
  error: string | null
}
```

---

## 8. Non-Functional Requirements

### 8.1 Performance Targets

| Metric | Target |
|--------|--------|
| Task creation to display | < 200ms |
| Task toggle to UI update | < 100ms |
| Task delete to removal | < 100ms |
| Initial load time | < 2 seconds |
| localStorage read/write | < 50ms |

### 8.2 Browser Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Mobile Chrome | 80+ |
| Mobile Safari | 13+ |

### 8.3 Accessibility Requirements

- All interactive elements keyboard accessible
- Sufficient color contrast (WCAG AA: 4.5:1 for text)
- Screen reader compatible labels for buttons
- Focus indicators visible
- Error messages announced to assistive technology

---

## 9. Feature Index

| Feature ID | Feature Name | Priority | Status |
|------------|--------------|----------|--------|
| F0 | Task Creation | P0 | Required |
| F1 | Task Completion | P0 | Required |
| F2 | Task Deletion | P0 | Required |
| F3 | Task List Display | P0 | Required |
| F4 | Data Persistence | P0 | Required |
| F5 | Task Counter/Stats | P1 | Enhancement |

---

*Document Version: 1.0*
*Generated: 2026-04-29*
*Based on PRD-TodoApp.md v1.0*