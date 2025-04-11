import { useState } from "react"
import { useLanguage } from "./language-context"

export const TodoSorter = ({ todoList }) => {
  const [sortBy, setSortBy] = useState("newest")
  const { t } = useLanguage()

  const getSortedTodos = () => {
    const sortedTodos = [...todoList]

    if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 }
      sortedTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    } else if (sortBy === "category") {
      sortedTodos.sort((a, b) => a.category.localeCompare(b.category))
    } else if (sortBy === "newest") {
      sortedTodos.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    }

    return sortedTodos
  }

  const renderSortingControls = () => (
    <div className="sorting-controls">
      <label>{t.sortBy}:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">{t.newestFirst}</option>
        <option value="priority">{t.priority}</option>
        <option value="category">{t.category}</option>
      </select>
    </div>
  )

  return {
    getSortedTodos,
    renderSortingControls,
  }
}

export default TodoSorter
