import { useState } from "react"
import { useLanguage } from "./language-context"

export const StatisticsPanel = ({ todoList }) => {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  // Calculate basic statistics
  const totalTasks = todoList.length
  const completedTasks = todoList.filter((todo) => todo.completed).length
  const activeTasks = totalTasks - completedTasks
  const archivedTasks = todoList.filter((todo) => todo.archived).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate tasks by priority
  const tasksByPriority = {
    High: todoList.filter((todo) => todo.priority === "High").length,
    Medium: todoList.filter((todo) => todo.priority === "Medium").length,
    Low: todoList.filter((todo) => todo.priority === "Low").length,
  }

  // Calculate tasks by category
  const tasksByCategory = todoList.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1
    return acc
  }, {})

  // Calculate completion by category
  const completionByCategory = Object.keys(tasksByCategory).reduce((acc, category) => {
    const tasksInCategory = todoList.filter((todo) => todo.category === category)
    const completedInCategory = tasksInCategory.filter((todo) => todo.completed).length
    acc[category] = {
      total: tasksInCategory.length,
      completed: completedInCategory,
      rate: tasksInCategory.length > 0 ? Math.round((completedInCategory / tasksInCategory.length) * 100) : 0,
    }
    return acc
  }, {})

  // Calculate completion by priority
  const completionByPriority = {
    High: {
      total: tasksByPriority.High,
      completed: todoList.filter((todo) => todo.priority === "High" && todo.completed).length,
      rate:
        tasksByPriority.High > 0
          ? Math.round(
              (todoList.filter((todo) => todo.priority === "High" && todo.completed).length / tasksByPriority.High) *
                100,
            )
          : 0,
    },
    Medium: {
      total: tasksByPriority.Medium,
      completed: todoList.filter((todo) => todo.priority === "Medium" && todo.completed).length,
      rate:
        tasksByPriority.Medium > 0
          ? Math.round(
              (todoList.filter((todo) => todo.priority === "Medium" && todo.completed).length /
                tasksByPriority.Medium) *
                100,
            )
          : 0,
    },
    Low: {
      total: tasksByPriority.Low,
      completed: todoList.filter((todo) => todo.priority === "Low" && todo.completed).length,
      rate:
        tasksByPriority.Low > 0
          ? Math.round(
              (todoList.filter((todo) => todo.priority === "Low" && todo.completed).length / tasksByPriority.Low) * 100,
            )
          : 0,
    },
  }

  // Calculate tasks created in the last 7 days
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  const tasksLast7Days = todoList.filter((todo) => new Date(todo.dateAdded) > last7Days).length

  // Calculate tasks completed in the last 7 days
  const completedLast7Days = todoList.filter((todo) => todo.completed && new Date(todo.dateAdded) > last7Days).length

  // Calculate overdue tasks
  const now = new Date()
  const overdueTasks = todoList.filter(
    (todo) => !todo.completed && !todo.archived && new Date(todo.expiryDate) < now,
  ).length

  // Render a progress bar
  const renderProgressBar = (value, max, color = "var(--primary-color)") => (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          width: `${Math.min(100, (value / max) * 100)}%`,
          backgroundColor: color,
        }}
      ></div>
    </div>
  )

  return (
    <div className={`statistics-panel ${expanded ? "expanded" : ""}`}>
      <div className="statistics-header" onClick={() => setExpanded(!expanded)}>
        <h2>{t.statistics}</h2>
        <button className="expand-button">{expanded ? "▲" : "▼"}</button>
      </div>

      {expanded && (
        <div className="statistics-content">
          <div className="statistics-summary">
            <div className="stat-card">
              <h3>{t.totalTasks}</h3>
              <p className="stat-value">{totalTasks}</p>
            </div>
            <div className="stat-card">
              <h3>{t.completedTasks}</h3>
              <p className="stat-value">{completedTasks}</p>
            </div>
            <div className="stat-card">
              <h3>{t.activeTasks}</h3>
              <p className="stat-value">{activeTasks}</p>
            </div>
            <div className="stat-card">
              <h3>{t.archivedTasks}</h3>
              <p className="stat-value">{archivedTasks}</p>
            </div>
          </div>

          <div className="statistics-details">
            <div className="stat-section">
              <h3>{t.completionRate}</h3>
              <div className="completion-rate">
                <span className="rate-value">{completionRate}%</span>
                {renderProgressBar(completedTasks, totalTasks)}
              </div>
            </div>

            <div className="stat-section">
              <h3>{t.tasksByPriority}</h3>
              <div className="priority-stats">
                <div className="priority-stat">
                  <div className="priority-label">
                    <span className="priority high">{t.high}</span>
                    <span className="priority-count">
                      {completionByPriority.High.completed}/{completionByPriority.High.total} (
                      {completionByPriority.High.rate}%)
                    </span>
                  </div>
                  {renderProgressBar(completionByPriority.High.completed, completionByPriority.High.total, "#e53935")}
                </div>
                <div className="priority-stat">
                  <div className="priority-label">
                    <span className="priority medium">{t.medium}</span>
                    <span className="priority-count">
                      {completionByPriority.Medium.completed}/{completionByPriority.Medium.total} (
                      {completionByPriority.Medium.rate}%)
                    </span>
                  </div>
                  {renderProgressBar(
                    completionByPriority.Medium.completed,
                    completionByPriority.Medium.total,
                    "#ffa000",
                  )}
                </div>
                <div className="priority-stat">
                  <div className="priority-label">
                    <span className="priority low">{t.low}</span>
                    <span className="priority-count">
                      {completionByPriority.Low.completed}/{completionByPriority.Low.total} (
                      {completionByPriority.Low.rate}%)
                    </span>
                  </div>
                  {renderProgressBar(completionByPriority.Low.completed, completionByPriority.Low.total, "#43a047")}
                </div>
              </div>
            </div>

            <div className="stat-section">
              <h3>{t.tasksByCategory}</h3>
              <div className="category-stats">
                {Object.keys(completionByCategory).map((category) => (
                  <div className="category-stat" key={category}>
                    <div className="category-label">
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {completionByCategory[category].completed}/{completionByCategory[category].total} (
                        {completionByCategory[category].rate}%)
                      </span>
                    </div>
                    {renderProgressBar(completionByCategory[category].completed, completionByCategory[category].total)}
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-section">
              <h3>{t.recentActivity}</h3>
              <div className="recent-stats">
                <div className="recent-stat">
                  <span>{t.tasksLast7Days}:</span>
                  <span className="recent-value">{tasksLast7Days}</span>
                </div>
                <div className="recent-stat">
                  <span>{t.completedLast7Days}:</span>
                  <span className="recent-value">{completedLast7Days}</span>
                </div>
                <div className="recent-stat">
                  <span>{t.overdueTasks}:</span>
                  <span className="recent-value overdue">{overdueTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatisticsPanel
