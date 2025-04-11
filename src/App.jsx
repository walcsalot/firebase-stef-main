import { useState, useEffect } from "react"
import "./App.css"
import { db, auth } from "./config/firebase"
import { getDocs, collection, query, where } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { TodoCrud } from "./Components/todo-crud"
import { NotificationManager } from "./Components/notifications"
import { TodoSorter } from "./Components/todo-sorter"
import { TodoLayout } from "./Components/todo-layout"
import { ThemeProvider } from "./Components/theme-context"
import { LanguageProvider } from "./Components/language-context"
import { useLanguage } from "./Components/language-context"

// Helper function to format dates consistently
const formatDateOnly = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

function AppContent() {
  const [todoList, setTodoList] = useState([])
  const [user, setUser] = useState(null)
  const todoListCollectionRef = collection(db, "todos")
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { t } = useLanguage()

  // Initialize notification manager
  const { showNotification } = NotificationManager()

  // Initialize todo sorter
  const { getSortedTodos, renderSortingControls } = TodoSorter({ todoList })

  const getTodoList = async (userId) => {
    try {
      const q = query(todoListCollectionRef, where("userId", "==", userId))
      const data = await getDocs(q)
      setTodoList(
        data.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Set default archived status if it doesn't exist
            archived: data.archived ?? false,
            // Format dates for display if needed
            formattedDateAdded: formatDateOnly(data.dateAdded),
            formattedExpiryDate: formatDateOnly(data.expiryDate),
          }
        }),
      )
    } catch (err) {
      console.error("Error fetching todos: ", err)
    }
  }

  // Initialize the TodoCrud component
  const {
    renderAddTodoForm,
    renderTodoItem,
    renderBulkActionControls,
    filterTodos,
    toggleTodoCompletion,
    showArchived,
  } = TodoCrud({
    user,
    todoListCollectionRef,
    getTodoList,
    showNotification,
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        getTodoList(currentUser.uid)
      } else {
        setTodoList([])
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      autoCompleteExpiredTodos()
    }
  }, [todoList, user])

  const autoCompleteExpiredTodos = async () => {
    const now = new Date()
    const expiredTodos = todoList.filter((todo) => new Date(todo.expiryDate) < now && !todo.completed)

    for (const todo of expiredTodos) {
      try {
        await toggleTodoCompletion(todo.id, false)
        toast.info(`"${todo.name}" was auto-completed (past expiry).`)
        showNotification("List Expired", `"${todo.name}" has been auto-completed as it's past its expiry date.`)
      } catch (err) {
        console.error("Error auto-completing todo: ", err)
      }
    }

    if (expiredTodos.length > 0) {
      getTodoList(user.uid)
    }
  }

  const getToastPosition = () => {
    return isMobile ? "bottom-center" : "top-right"
  }

  // Filter todos based on archived status
  const filteredTodos = filterTodos(getSortedTodos())

  // Render the todo content only when user is logged in
  const renderTodoContent = () => (
    <>
      {renderAddTodoForm()}
      <h2>{showArchived ? t.archivedTasks : t.activeTasks}</h2>
      {renderBulkActionControls(filteredTodos)}
      {renderSortingControls()}
      <div className="todo-list">{filteredTodos.map((todo) => renderTodoItem(todo))}</div>
      {filteredTodos.length === 0 && (
        <div className="empty-state">
          <p>{showArchived ? "No archived tasks found" : "No active tasks found"}</p>
        </div>
      )}
    </>
  )

  return (
    <div className="app">
      <ToastContainer
        position={getToastPosition()}
        autoClose={3000}
        hideProgressBar={isMobile}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        className="toast-container-custom"
        toastClassName="toast-custom"
        bodyClassName="toast-body-custom"
      />
      <TodoLayout user={user}>{user ? renderTodoContent() : null}</TodoLayout>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
