"use client"

import { useState } from "react"
import { addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import { toast } from "react-toastify"
import { useLanguage } from "./language-context"
import { DragDropManager } from "./drag-drop-manager"
import { SocialShare } from "./social-share"

// Helper function to format dates consistently
const formatDateOnly = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export const TodoCrud = ({ user, todoListCollectionRef, getTodoList, showNotification }) => {
  // Get translations
  const { t, language } = useLanguage()

  // State for adding new todos
  const [newTodoName, setNewTodoName] = useState("")
  const [newTodoDesc, setNewTodoDesc] = useState("")
  const [newTodoExpiry, setNewTodoExpiry] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState("Low")
  const [newTodoCategory, setNewTodoCategory] = useState("Work")

  // State for editing todos
  const [editingTodo, setEditingTodo] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editExpiry, setEditExpiry] = useState("")
  const [editPriority, setEditPriority] = useState("Low")
  const [editCategory, setEditCategory] = useState("Work")

  // State for bulk actions
  const [selectedTodos, setSelectedTodos] = useState([])
  const [showArchived, setShowArchived] = useState(false)

  // State for layout customization
  const [layoutSettings, setLayoutSettings] = useState({
    viewType: "grid",
    density: "comfortable",
    visibleFields: {
      description: true,
      dateAdded: true,
      expiryDate: true,
      priority: true,
      category: true,
    },
  })

  // Initialize drag and drop manager
  const { handleDragStart, handleDragOver, handleDragEnd, handleDrop, handleDragEnter, handleDragLeave, todoOrder } =
    DragDropManager({ todoList: [], getTodoList, user })

  // Helper function to get translated priority
  const getTranslatedPriority = (priority) => {
    if (language === "english") return priority

    const priorityMap = {
      Low: t.low,
      Medium: t.medium,
      High: t.high,
    }

    return priorityMap[priority] || priority
  }

  // Helper function to get translated category
  const getTranslatedCategory = (category) => {
    if (language === "english") return category

    const categoryMap = {
      Work: t.work,
      Personal: t.personal,
      Others: t.others,
    }

    return categoryMap[category] || category
  }

  // Handle layout changes
  const handleLayoutChange = (newSettings) => {
    setLayoutSettings(newSettings)
  }

  // Add a new todo
  const onSubmitTodo = async () => {
    if (!user) return alert("You must be logged in to add a todo.")
    if (!newTodoName.trim() || !newTodoDesc.trim() || !newTodoExpiry) return alert("Fill in all fields.")

    try {
      await addDoc(todoListCollectionRef, {
        name: newTodoName,
        description: newTodoDesc,
        completed: false,
        archived: false,
        dateAdded: new Date().toISOString(),
        expiryDate: new Date(newTodoExpiry).toISOString(),
        priority: newTodoPriority,
        category: newTodoCategory,
        userId: user.uid,
        displayOrder: 9999, // Default to end of list
      })

      toast.success("List added successfully!")
      setNewTodoName("")
      setNewTodoDesc("")
      setNewTodoExpiry("")
      setNewTodoPriority("Low")
      setNewTodoCategory("Work")
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error adding List: ", err)
      toast.error("Failed to add List.")
    }
  }

  // Toggle todo completion status
  const toggleTodoCompletion = async (id, completed) => {
    try {
      await updateDoc(doc(db, "todos", id), { completed: !completed })
      toast.success(completed ? "List marked as incomplete!" : "List completed!")

      if (!completed) {
        const todo = document.querySelector(`[data-todo-id="${id}"]`)
        const todoName = todo ? todo.querySelector("h2").textContent.split(" ")[0] : "Todo"
        showNotification("List Completed", `"${todoName}" has been marked as complete!`)
      }

      getTodoList(user.uid)
    } catch (err) {
      console.error("Error updating List: ", err)
      toast.error("Failed to update List.")
    }
  }

  // Archive a todo
  const archiveTodo = async (id, archived) => {
    try {
      await updateDoc(doc(db, "todos", id), { archived: !archived })
      toast.success(archived ? "List unarchived!" : "List archived!")
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error archiving List: ", err)
      toast.error("Failed to archive List.")
    }
  }

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id))
      toast.success("List deleted successfully!")
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error deleting List: ", err)
      toast.error("Failed to delete List.")
    }
  }

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingTodo(todo.id)
    setEditName(todo.name)
    setEditDesc(todo.description)
    setEditExpiry(todo.expiryDate.split("T")[0])
    setEditPriority(todo.priority)
    setEditCategory(todo.category)
  }

  // Save edited todo
  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        name: editName,
        description: editDesc,
        expiryDate: new Date(editExpiry).toISOString(),
        priority: editPriority,
        category: editCategory,
      })

      toast.success("List updated successfully!")
      setEditingTodo(null)
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error updating List: ", err)
      toast.error("Failed to update List.")
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingTodo(null)
  }

  // Toggle selection of a todo for bulk actions
  const toggleTodoSelection = (id) => {
    setSelectedTodos((prev) => {
      if (prev.includes(id)) {
        return prev.filter((todoId) => todoId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Select all visible todos
  const selectAllTodos = (todos) => {
    if (selectedTodos.length === todos.length) {
      // If all are selected, deselect all
      setSelectedTodos([])
    } else {
      // Otherwise, select all
      setSelectedTodos(todos.map((todo) => todo.id))
    }
  }

  // Bulk mark todos as complete/incomplete
  const bulkToggleCompletion = async (complete) => {
    if (selectedTodos.length === 0) {
      toast.info("No todos selected")
      return
    }

    try {
      const promises = selectedTodos.map((id) => updateDoc(doc(db, "todos", id), { completed: complete }))

      await Promise.all(promises)

      toast.success(
        complete
          ? `${selectedTodos.length} lists marked as complete!`
          : `${selectedTodos.length} lists marked as incomplete!`,
      )

      setSelectedTodos([])
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error updating lists: ", err)
      toast.error("Failed to update lists.")
    }
  }

  // Bulk archive todos
  const bulkArchiveTodos = async (archive) => {
    if (selectedTodos.length === 0) {
      toast.info("No todos selected")
      return
    }

    try {
      const promises = selectedTodos.map((id) => updateDoc(doc(db, "todos", id), { archived: archive }))

      await Promise.all(promises)

      toast.success(archive ? `${selectedTodos.length} lists archived!` : `${selectedTodos.length} lists unarchived!`)

      setSelectedTodos([])
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error archiving lists: ", err)
      toast.error("Failed to archive lists.")
    }
  }

  // Bulk delete todos
  const bulkDeleteTodos = async () => {
    if (selectedTodos.length === 0) {
      toast.info("No todos selected")
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedTodos.length} lists?`)) {
      return
    }

    try {
      const promises = selectedTodos.map((id) => deleteDoc(doc(db, "todos", id)))

      await Promise.all(promises)

      toast.success(`${selectedTodos.length} lists deleted!`)
      setSelectedTodos([])
      getTodoList(user.uid)
    } catch (err) {
      console.error("Error deleting lists: ", err)
      toast.error("Failed to delete lists.")
    }
  }

  // Render the add todo form
  const renderAddTodoForm = () => (
    <div className="todo-form">
      <input
        placeholder={t.listName}
        type="text"
        value={newTodoName}
        onChange={(e) => setNewTodoName(e.target.value)}
      />
      <input
        placeholder={t.listDescription}
        type="text"
        value={newTodoDesc}
        onChange={(e) => setNewTodoDesc(e.target.value)}
      />
      <input type="date" value={newTodoExpiry} onChange={(e) => setNewTodoExpiry(e.target.value)} />
      <select value={newTodoPriority} onChange={(e) => setNewTodoPriority(e.target.value)}>
        <option value="Low">{t.low}</option>
        <option value="Medium">{t.medium}</option>
        <option value="High">{t.high}</option>
      </select>
      <select value={newTodoCategory} onChange={(e) => setNewTodoCategory(e.target.value)}>
        <option value="Work">{t.work}</option>
        <option value="Personal">{t.personal}</option>
        <option value="Others">{t.others}</option>
      </select>
      <button onClick={onSubmitTodo}>{t.addTodo}</button>
    </div>
  )

  // Render bulk action controls
  const renderBulkActionControls = (todos) => (
    <div className="bulk-actions">
      <div className="bulk-actions-left">
        <button className="archive-toggle-btn" onClick={() => setShowArchived(!showArchived)}>
          {showArchived ? t.hideArchived : t.showArchived}
        </button>
        <label className="select-all-label">
          <input
            type="checkbox"
            checked={selectedTodos.length > 0 && selectedTodos.length === todos.length}
            onChange={() => selectAllTodos(todos)}
          />
          {t.selectAll}
        </label>
      </div>

      {selectedTodos.length > 0 && (
        <div className="bulk-actions-right">
          <span className="selected-count">
            {selectedTodos.length} {t.selected}
          </span>
          <button className="bulk-action-btn complete-btn" onClick={() => bulkToggleCompletion(true)}>
            {t.markComplete}
          </button>
          <button className="bulk-action-btn incomplete-btn" onClick={() => bulkToggleCompletion(false)}>
            {t.markIncomplete}
          </button>
          <button className="bulk-action-btn archive-btn" onClick={() => bulkArchiveTodos(true)}>
            {t.archive}
          </button>
          <button className="bulk-action-btn delete-btn" onClick={bulkDeleteTodos}>
            {t.delete}
          </button>
        </div>
      )}
    </div>
  )

  // Filter todos based on archived status
  const filterTodos = (todos) => {
    return todos.filter((todo) => (showArchived ? todo.archived : !todo.archived))
  }

  // Get CSS classes for todo card based on layout settings
  const getTodoCardClasses = (todo) => {
    let classes = `todo-card ${todo.completed ? "completed" : ""} ${todo.archived ? "archived" : ""}`

    // Add density class
    classes += ` density-${layoutSettings.density}`

    // Add view type class
    classes += ` view-${layoutSettings.viewType}`

    return classes
  }

  // Render todo items with edit functionality
  const renderTodoItem = (todo) => {
    // Format dates for display
    const dateAdded = formatDateOnly(todo.dateAdded)
    const expiryDate = formatDateOnly(todo.expiryDate)

    return (
      <div
        key={todo.id}
        className={getTodoCardClasses(todo)}
        data-todo-id={todo.id}
        draggable={editingTodo !== todo.id}
        onDragStart={(e) => handleDragStart(e, todo.id)}
        onDragOver={(e) => handleDragOver(e, todo.id)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, todo.id)}
        onDragEnter={(e) => handleDragEnter(e, todo.id)}
        onDragLeave={(e) => handleDragLeave(e, todo.id)}
      >
        {editingTodo === todo.id ? (
          <>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            <input type="date" value={editExpiry} onChange={(e) => setEditExpiry(e.target.value)} />
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="Low">{t.low}</option>
              <option value="Medium">{t.medium}</option>
              <option value="High">{t.high}</option>
            </select>
            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
              <option value="Work">{t.work}</option>
              <option value="Personal">{t.personal}</option>
              <option value="Others">{t.others}</option>
            </select>
            <button onClick={() => saveEdit(todo.id)}>{t.save}</button>
            <button onClick={cancelEdit}>{t.cancel}</button>
          </>
        ) : (
          <>
            <div className="todo-card-header">
              <label className="todo-checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedTodos.includes(todo.id)}
                  onChange={() => toggleTodoSelection(todo.id)}
                  className="todo-checkbox"
                />
                <span className="checkmark"></span>
              </label>
              <h2>
                {todo.name}{" "}
                {layoutSettings.visibleFields.priority && (
                  <span className={`priority ${todo.priority.toLowerCase()}`}>
                    {getTranslatedPriority(todo.priority)}
                  </span>
                )}
              </h2>
            </div>

            {layoutSettings.visibleFields.description && <p>{todo.description}</p>}

            <div className="todo-card-details">
              {layoutSettings.visibleFields.dateAdded && (
                <p>
                  <strong>{t.dateAdded}:</strong> {dateAdded}
                </p>
              )}

              {layoutSettings.visibleFields.expiryDate && (
                <p>
                  <strong>{t.expiryDate}:</strong> {expiryDate}
                </p>
              )}

              {layoutSettings.visibleFields.category && (
                <p>
                  <strong>{t.category}:</strong> {getTranslatedCategory(todo.category)}
                </p>
              )}
            </div>

            <div className="todo-card-actions">
              <button onClick={() => toggleTodoCompletion(todo.id, todo.completed)}>
                {todo.completed ? t.markAsIncomplete : t.markAsComplete}
              </button>
              <button className="archive-btn" onClick={() => archiveTodo(todo.id, todo.archived)}>
                {todo.archived ? t.unarchive : t.archive}
              </button>
              <button className="edit-btn" onClick={() => startEditing(todo)}>
                {t.edit}
              </button>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                {t.delete}
              </button>
            </div>

            <SocialShare todo={todo} />

            <div className="drag-handle" title={t.dragToReorder}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="6" r="1"></circle>
                <circle cx="8" cy="12" r="1"></circle>
                <circle cx="8" cy="18" r="1"></circle>
                <circle cx="16" cy="6" r="1"></circle>
                <circle cx="16" cy="12" r="1"></circle>
                <circle cx="16" cy="18" r="1"></circle>
              </svg>
            </div>
          </>
        )}
      </div>
    )
  }

  return {
    renderAddTodoForm,
    renderTodoItem,
    renderBulkActionControls,
    filterTodos,
    editingTodo,
    toggleTodoCompletion,
    deleteTodo,
    startEditing,
    saveEdit,
    cancelEdit,
    showArchived,
    handleLayoutChange,
    layoutSettings,
  }
}

export default TodoCrud
