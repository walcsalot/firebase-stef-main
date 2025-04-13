import { useState, useEffect } from "react"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import { toast } from "react-toastify"
import { useLanguage } from "./language-context"

export const DragDropManager = ({ todoList, getTodoList, user }) => {
  const { t } = useLanguage()
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const [todoOrder, setTodoOrder] = useState([])
  const [dragDirection, setDragDirection] = useState(null) // 'up' or 'down'
  const [initialY, setInitialY] = useState(0)

  // Initialize or update todo order when todoList changes
  useEffect(() => {
    if (todoList.length > 0) {
      // If we don't have an order yet, or if there are new todos, update the order
      if (todoOrder.length === 0 || !todoList.every((todo) => todoOrder.includes(todo.id))) {
        setTodoOrder(todoList.map((todo) => todo.id))
      }
    }
  }, [todoList])

  // Handle drag start
  const handleDragStart = (e, id) => {
    setDraggedItem(id)
    setInitialY(e.clientY)
    e.dataTransfer.effectAllowed = "move"

    // Store the initial position for determining drag direction
    const draggedElement = document.querySelector(`[data-todo-id="${id}"]`)
    if (draggedElement) {
      // Add a class to the dragged element
      draggedElement.classList.add("dragging")

      // Set custom ghost image (optional)
      const rect = draggedElement.getBoundingClientRect()
      const ghostElement = draggedElement.cloneNode(true)
      ghostElement.style.width = `${rect.width}px`
      ghostElement.style.height = `${rect.height}px`
      ghostElement.style.opacity = "0.8"
      ghostElement.style.position = "absolute"
      ghostElement.style.top = "-1000px"
      ghostElement.style.left = "-1000px"
      ghostElement.classList.add("drag-ghost")

      document.body.appendChild(ghostElement)
      e.dataTransfer.setDragImage(ghostElement, 20, 20)

      // Remove the ghost element after drag starts
      setTimeout(() => {
        document.body.removeChild(ghostElement)
      }, 0)
    }

    // Add a placeholder element
    addPlaceholder(id)
  }

  // Add a placeholder where the dragged item was
  const addPlaceholder = (id) => {
    const draggedElement = document.querySelector(`[data-todo-id="${id}"]`)
    if (!draggedElement) return

    // Create placeholder with same dimensions as dragged element
    const rect = draggedElement.getBoundingClientRect()
    const placeholder = document.createElement("div")
    placeholder.id = "drag-placeholder"
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.className = "drag-placeholder"

    // Insert placeholder before the dragged element
    draggedElement.parentNode.insertBefore(placeholder, draggedElement)

    // Hide the original element
    draggedElement.style.display = "none"
  }

  // Move placeholder to new position
  const movePlaceholder = (targetId) => {
    if (draggedItem === targetId) return

    const placeholder = document.getElementById("drag-placeholder")
    if (!placeholder) return

    const targetElement = document.querySelector(`[data-todo-id="${targetId}"]`)
    if (!targetElement) return

    // Determine if we should place before or after the target
    const targetRect = targetElement.getBoundingClientRect()
    const placeholderRect = placeholder.getBoundingClientRect()

    // Remove placeholder from its current position
    placeholder.remove()

    // Insert placeholder before or after target based on drag direction
    if (dragDirection === "up") {
      targetElement.parentNode.insertBefore(placeholder, targetElement)
    } else {
      targetElement.parentNode.insertBefore(placeholder, targetElement.nextSibling)
    }
  }

  // Handle drag over
  const handleDragOver = (e, id) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    // Determine drag direction
    const currentY = e.clientY
    if (currentY < initialY) {
      setDragDirection("up")
    } else if (currentY > initialY) {
      setDragDirection("down")
    }
    setInitialY(currentY)

    if (id !== dragOverItem) {
      setDragOverItem(id)
      movePlaceholder(id)
    }

    // Add visual indicator for drop target
    const elements = document.querySelectorAll(".todo-card")
    elements.forEach((el) => {
      el.classList.remove("drag-over")
    })

    const currentElement = document.querySelector(`[data-todo-id="${id}"]`)
    if (currentElement && id !== draggedItem) {
      currentElement.classList.add("drag-over")
    }
  }

  // Handle drag end
  const handleDragEnd = (e) => {
    // Remove placeholder
    const placeholder = document.getElementById("drag-placeholder")
    if (placeholder) {
      placeholder.remove()
    }

    // Show the dragged element again
    const draggedElement = document.querySelector(`[data-todo-id="${draggedItem}"]`)
    if (draggedElement) {
      draggedElement.style.display = ""
      draggedElement.classList.remove("dragging")
    }

    // Remove all drag-over classes
    const elements = document.querySelectorAll(".todo-card")
    elements.forEach((el) => {
      el.classList.remove("drag-over")
    })

    setDraggedItem(null)
    setDragOverItem(null)
    setDragDirection(null)
  }

  // Handle drop
  const handleDrop = async (e, id) => {
    e.preventDefault()

    if (draggedItem === null || draggedItem === id) {
      handleDragEnd(e)
      return
    }

    // Reorder the todos
    const newOrder = [...todoOrder]
    const draggedIndex = newOrder.indexOf(draggedItem)
    const dropIndex = newOrder.indexOf(id)

    if (draggedIndex !== -1 && dropIndex !== -1) {
      newOrder.splice(draggedIndex, 1)

      // Adjust the insertion index based on drag direction
      let insertIndex = dropIndex
      if (draggedIndex < dropIndex) {
        insertIndex = dragDirection === "up" ? dropIndex - 1 : dropIndex
      } else {
        insertIndex = dragDirection === "up" ? dropIndex : dropIndex + 1
      }

      // Ensure the index is valid
      insertIndex = Math.max(0, Math.min(insertIndex, newOrder.length))

      newOrder.splice(insertIndex, 0, draggedItem)
      setTodoOrder(newOrder)

      // Update the order in the database
      try {
        // Update each todo with its new position
        const updatePromises = newOrder.map((todoId, index) => {
          return updateDoc(doc(db, "todos", todoId), {
            displayOrder: index,
          })
        })

        await Promise.all(updatePromises)
        toast.success(t.todoReordered)

        // Refresh the todo list
        getTodoList(user.uid)
      } catch (err) {
        console.error("Error updating todo order: ", err)
        toast.error(t.errorReordering)
      }
    }

    // Clear drag state
    handleDragEnd(e)
  }

  // Handle drag enter
  const handleDragEnter = (e, id) => {
    e.preventDefault()
    if (id !== dragOverItem) {
      setDragOverItem(id)
      movePlaceholder(id)
    }
  }

  // Handle drag leave
  const handleDragLeave = (e, id) => {
    e.preventDefault()
    const relatedTarget = e.relatedTarget

    // Only remove the class if we're actually leaving the element
    // (not just moving between child elements)
    if (!e.currentTarget.contains(relatedTarget)) {
      e.currentTarget.classList.remove("drag-over")
    }
  }

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    todoOrder,
  }
}

export default DragDropManager
