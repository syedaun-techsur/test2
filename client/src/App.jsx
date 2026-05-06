import { useState, useEffect } from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import './App.css'

const API_BASE = '/api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE}/tasks`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const json = await res.json()
      setTasks(json.data)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(text) {
    try {
      setError(null)
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error?.message || `HTTP ${res.status}`)
      }
      const json = await res.json()
      setTasks(prev => [...prev, json.data])
    } catch (err) {
      setError(err.message || 'Failed to add task')
    }
  }

  async function toggleComplete(id, completed) {
    try {
      setError(null)
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error?.message || `HTTP ${res.status}`)
      }
      setTasks(prev =>
        prev.map(t => (t.id === id ? { ...t, completed } : t))
      )
    } catch (err) {
      setError(err.message || 'Failed to update task')
    }
  }

  async function deleteTask(id) {
    try {
      setError(null)
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error?.message || `HTTP ${res.status}`)
      }
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete task')
    }
  }

  return (
    <div className="app">
      <h1>Todo App</h1>
      <TaskForm onAdd={addTask} />
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={deleteTask} />
      )}
    </div>
  )
}
