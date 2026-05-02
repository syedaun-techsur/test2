# Phase 2: Frontend UI - Research

**Researched:** 2026-05-02
**Domain:** React Frontend + Express Backend Integration
**Confidence:** HIGH

## Summary

Phase 2 builds a React frontend that consumes the Express API from Phase 1. Using Vite (v8.x) with React 19, the frontend will make fetch() calls to the backend at localhost:3001. The locked component structure uses a flat folder with App.jsx, TaskList.jsx, TaskItem.jsx, TaskForm.jsx, and App.css. State management uses local React useState/useEffect - appropriate for this simple app. CORS is already handled by the backend's cors middleware.

**Primary recommendation:** Use Vite + React 19 with plain fetch(), local component state, and basic CSS styling. Set up a Vite proxy to handle API calls during development.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Component Structure**: Flat structure - all components in one folder
- **Files**:
  - `client/src/App.jsx` - Main app component
  - `client/src/TaskList.jsx` - Renders task list
  - `client/src/TaskItem.jsx` - Individual task item with checkbox and delete
  - `client/src/TaskForm.jsx` - Form for creating new tasks
  - `client/src/App.css` - Styles

### Claude's Discretion (Freedom Areas)
- State management: use local React state (recommended)
- Styling: plain CSS (recommended)
- API integration: fetch (recommended)

### Deferred Ideas (OUT OF SCOPE)
- React Query or SWR for data fetching (overkill for simple app)
- CSS frameworks (keep it simple with plain CSS per locked decision)

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---------------|
| React | 19.x | UI framework | Industry standard, built-in hooks for state |
| Vite | 8.x | Build tool | Fast dev server, simple config, standard in 2026 |
| Vite plugin React | latest | React HMR | Official Vite React integration |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| - | - | No additional deps needed | Plain fetch() handles API calls |
| cors (backend) | ^2.8.5 | Cross-origin requests | Already installed in Phase 1 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| fetch() | axios | fetch() is built-in, no extra bundle |
| Plain CSS | Tailwind CSS | Keep simple per locked decision |
| Local state | React Query | Overkill for simple CRUD app |
| Vite | Create React App | CRA deprecated, Vite is standard |

**Installation:**
```bash
cd client
npm create vite@latest . -- --template react
npm install
```

**Version verification:**
- React 19.2.5 (verified via npm)
- Vite 8.0.10 (verified via npm)

---

## Architecture Patterns

### Recommended Project Structure

```
client/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx         # React entry point
│   ├── App.jsx          # Main app component (state lives here)
│   ├── TaskList.jsx     # Renders task list
│   ├── TaskItem.jsx     # Individual task (checkbox + delete)
│   ├── TaskForm.jsx     # Form for new tasks
│   └── App.css          # Styles
```

### Pattern 1: Single Source of Truth in App Component

**What:** App.jsx holds all state and API calls; child components are purely presentational

**When to use:** Small apps where all data needs to be in sync

**Example:**
```jsx
// client/src/App.jsx
import { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(text) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setTasks([...tasks, data.data]);
  }

  async function toggleComplete(id, completed) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div>
      <h1>Todo App</h1>
      <TaskForm onAdd={addTask} />
      {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={deleteTask} />}
    </div>
  );
}
```

**Source:** Standard React patterns - no external reference needed

### Pattern 2: TaskItem with Event Handlers

**What:** Each task renders checkbox and delete button, calls parent handlers

**When to use:** Simple CRUD operations

**Example:**
```jsx
// client/src/TaskItem.jsx
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
      />
      <span>{task.text}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}
```

### Pattern 3: TaskForm with Controlled Input

**What:** Form manages own input state, calls parent on submit

**When to use:** Adding new items

**Example:**
```jsx
// client/src/TaskForm.jsx
import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

### Pattern 4: Vite Proxy for API Calls

**What:** Configure Vite to proxy API requests to backend, avoiding CORS in dev

**When to use:** Development - simplifies local setup

**Example:**
```javascript
// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

With proxy enabled, frontend calls `/api/tasks` instead of `http://localhost:3001/api/tasks`.

**Source:** Vite proxy documentation - standard development pattern

### Anti-Patterns to Avoid

- **Inline API calls in child components:** Makes state management complex - keep in App.jsx
- **Missing error handling:** Always catch fetch errors and show user feedback
- **Not handling loading state:** Users need feedback while data loads
- **Missing cleanup in useEffect:** Use AbortController or proper dependency arrays

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP requests | Custom fetch wrapper | Plain fetch() | Simple enough for this app |
| State management | Redux / Context | useState | Simple CRUD doesn't need it |
| CSS | CSS-in-JS or preprocessors | Plain CSS | Per locked decision, keep simple |

**Key insight:** For a simple todo app with 3 operations (create, complete, delete), the built-in fetch API and useState are sufficient. Adding React Query or Redux would add complexity without benefit.

---

## Common Pitfalls

### Pitfall 1: CORS Errors in Development

**What goes wrong:** Fetch requests to localhost:3001 fail with "Access to fetch has been blocked by CORS policy"

**Why it happens:** Browser blocks requests to different origins (port 5173 vs 3001)

**How to avoid:** Either (1) use Vite proxy (recommended), or (2) ensure backend has cors middleware enabled

**Warning signs:** Console shows CORS error, request never completes

### Pitfall 2: Race Conditions with useEffect

**What goes wrong:** Multiple API calls complete out of order, state shows wrong data

**Why it happens:** Missing cleanup or not handling component unmount

**How to avoid:** Use AbortController for fetch calls:
```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(/* ... */)
    .catch(e => { if (e.name !== 'AbortError') throw e; });
  return () => controller.abort();
}, [dependency]);
```

**Warning signs:** Data appears wrong after rapid interactions

### Pitfall 3: Not Handling HTTP Error Responses

**What goes wrong:** API returns 400 or 500, but code doesn't check response.ok

**Why it happens:** Only checking if request completed, not if it succeeded

**How to avoid:** Check both response status and parse errors:
```jsx
const res = await fetch(url);
if (!res.ok) {
  const error = await res.json().catch(() => ({ message: 'Unknown error' }));
  throw new Error(error.message || `HTTP ${res.status}`);
}
const data = await res.json();
```

**Warning signs:** "Cannot read property of undefined" when API returns error

### Pitfall 4: Stale State in Event Handlers

**What goes wrong:** Event handler sees old state due to closure

**Why it happens:** Using stale state value in async operations

**How to avoid:** Use functional state updates:
```jsx
// Bad
setTasks([...tasks, newTask]); // tasks may be stale

// Good
setTasks(prev => [...prev, newTask]); // always current
```

**Warning signs:** Adding task shows duplicate or missing items

---

## Code Examples

### API Response Handling (Backend Response Format)

The Phase 1 backend returns this format:
```json
{ "success": true, "data": [...] }
```

Frontend must extract data:
```jsx
const res = await fetch(`${API_URL}/tasks`);
const json = await res.json();
const tasks = json.data; // Extract from success wrapper
```

### Creating a Task (POST)
```jsx
async function addTask(text) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const json = await res.json();
  return json.data; // Returns new task with id
}
```

### Completing a Task (PATCH)
```jsx
async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
}
```

### Deleting a Task (DELETE)
```jsx
async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
}
```

### Task Schema
```typescript
interface Task {
  id: string;        // UUID
  text: string;      // Task description (1-500 chars)
  completed: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Create React App | Vite | 2020+ | Faster dev, smaller bundles |
| class components | Hooks (useState/useEffect) | React 16.8+ (2019) | Simpler code, more composable |
| axios | fetch() | 2020+ | Built-in, no extra dependency |
| Component state in each file | Single state in App | Standard now | Easier to sync data |

**Deprecated/outdated:**
- Create React App: No longer maintained, Vite is standard
- class components: Hooks are preferred for all new code

---

## Open Questions

1. **Should we use the Vite proxy or direct URL?**
   - What we know: Proxy simplifies dev, direct URL works with backend cors
   - What's unclear: Both work, preference depends on team
   - Recommendation: Use proxy for cleaner code (`/api/tasks` vs full URL), but note both work

2. **How to handle empty task list state?**
   - What we know: Tasks may be empty initially
   - What's unclear: Should show "no tasks yet" message?
   - Recommendation: Show simple "No tasks yet" in TaskList when empty

3. **Should we add loading indicators for each operation?**
   - What we know: Operations are fast local to the machine
   - What's unclear: Whether to show spinner per action or just on load
   - Recommendation: Keep simple - loading only on initial fetch, operations are fast enough

---

## Sources

### Primary (HIGH confidence)
- npm view react version - Verified React 19.2.5
- npm view vite version - Verified Vite 8.0.10
- Vite official docs - Proxy configuration
- React official docs - Hooks patterns

### Secondary (MEDIUM confidence)
- WebSearch: "React 19 fetch API best practices 2025 2026" - Confirmed fetch() is standard
- WebSearch: "Vite proxy API calls" - Confirmed pattern
- WebSearch: "React Express CORS" - Confirmed cors middleware is standard fix

### Tertiary (LOW confidence)
- Various blog posts on React patterns - Cross-referenced with official docs

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Vite + React 19 is current standard, versions verified
- Architecture: HIGH - Single source of truth pattern is well-established for small apps
- Pitfalls: MEDIUM - Common issues documented from web search, verified against React docs

**Research date:** 2026-05-02
**Valid until:** 30 days (stable stack) / 7 days (if fast-moving updates)