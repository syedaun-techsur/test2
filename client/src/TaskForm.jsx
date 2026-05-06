import { useState, useRef, useEffect } from 'react'

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="task-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter task..."
      />
      <button type="submit" className="add-btn">Add</button>
    </form>
  )
}
