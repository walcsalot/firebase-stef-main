"use client"

import { createContext, useState, useEffect, useContext } from "react"

// Create translations for English and Filipino
const translations = {
  english: {
    // App header
    appTitle: "Todo List App",
    logout: "Logout",

    // Todo form
    addTodo: "Add Todo",
    listName: "List Name",
    listDescription: "List Description",
    priority: "Priority",
    category: "Category",
    expiryDate: "Expiry Date",

    // Priority levels
    low: "Low",
    medium: "Medium",
    high: "High",

    // Categories
    work: "Work",
    personal: "Personal",
    others: "Others",

    // Todo list
    noteList: "Note List",
    dateAdded: "Date Added",
    markAsComplete: "Mark as Done",
    markAsIncomplete: "Unmark",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    archive: "Archive",
    unarchive: "Unarchive",
    showArchived: "Show Archived",
    hideArchived: "Hide Archived",
    archivedTasks: "Archived Lists",
    activeTasks: "Active Lists",

    // Bulk actions
    selectAll: "Select All",
    selected: "selected",
    markComplete: "Mark Complete",
    markIncomplete: "Mark Incomplete",
    bulkDelete: "Delete Selected",

    // Statistics
    statistics: "Note Completion Statistics",
    totalTasks: "Total Lists",
    completedTasks: "Completed",
    activeTasks: "Active",
    archivedTasks: "Archived",
    completionRate: "Completion Rate",
    tasksByPriority: "List by Priority",
    tasksByCategory: "List by Category",
    recentActivity: "Recent Activity",
    tasksLast7Days: "Created in last 7 days",
    completedLast7Days: "Completed in last 7 days",
    overdueTasks: "Overdue tasks",

    // Sort options
    sortBy: "Sort By",
    newestFirst: "Newest First",

    // Auth
    welcomeBack: "Welcome Back",
    loginAccess: "Login to access your todo lists",
    email: "Email",
    password: "Password",
    login: "Login",
    loggingIn: "Logging in...",
    or: "OR",
    continueWithGoogle: "Continue with Google",
    createAccount: "Create Account",
    signupStart: "Sign up to start managing your todos",
    confirmPassword: "Confirm Password",
    passwordHint: "Must be at least 6 characters",
    creatingAccount: "Creating Account...",

    // Theme
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    // Layout customizer
    customizeLayout: "Customize Layout",
    openCustomizer: "Open Layout Customizer",
    closeCustomizer: "Close Layout Customizer",
    viewType: "View Type",
    gridView: "Grid View",
    listView: "List View",
    density: "Density",
    compact: "Compact",
    comfortable: "Comfortable",
    spacious: "Spacious",
    visibleFields: "Visible Fields",
    description: "Description",

    // Social Share
    shareToSocial: "Share to Social Media",
    share: "Share",
    copyToClipboard: "Copy to Clipboard",
    copied: "Copied!",
    checkOutMyNote: "Check out my Note!",
    todoFromApp: "List from My Note List App",
    status: "Status",
    active: "Active",
    completed: "Completed",

    // Drag and drop
    dragToReorder: "Drag to reorder",
    todoReordered: "Tasks reordered successfully",
    errorReordering: "Error reordering tasks",
  },
  filipino: {
    // App header
    appTitle: "Todo List App",
    logout: "Mag-logout",

    // Todo form
    addTodo: "Magdagdag ng Todo",
    listName: "Pangalan ng Listahan",
    listDescription: "Paglalarawan ng Listahan",
    priority: "Prioridad",
    category: "Kategorya",
    expiryDate: "Petsa ng Pagkapaso",

    // Priority levels
    low: "Mababa",
    medium: "Katamtaman",
    high: "Mataas",

    // Categories
    work: "Trabaho",
    personal: "Personal",
    others: "Iba Pa",

    // Todo list
    noteList: "Listahan ng Mga Tala",
    dateAdded: "Petsa ng Pagdagdag",
    markAsComplete: "Markahan bilang Kumpleto",
    markAsIncomplete: "Markahan bilang Hindi Kumpleto",
    edit: "I-edit",
    delete: "Burahin",
    save: "I-save",
    cancel: "Kanselahin",
    archive: "I-arkibo",
    unarchive: "Alisin sa Arkibo",
    showArchived: "Ipakita ang Naka-arkibo",
    hideArchived: "Itago ang Naka-arkibo",
    archivedTasks: "Mga Naka-arkibong Gawain",
    activeTasks: "Mga Aktibong Gawain",

    // Bulk actions
    selectAll: "Piliin Lahat",
    selected: "napili",
    markComplete: "Markahan Kumpleto",
    markIncomplete: "Markahan Hindi Kumpleto",
    bulkDelete: "Burahin ang Napili",

    // Statistics
    statistics: "Istatistika ng Pagkumpleto ng Tala",
    totalTasks: "Kabuuang Gawain",
    completedTasks: "Nakumpleto",
    activeTasks: "Aktibo",
    archivedTasks: "Naka-arkibo",
    completionRate: "Rate ng Pagkumpleto",
    tasksByPriority: "Mga Gawain ayon sa Prioridad",
    tasksByCategory: "Mga Gawain ayon sa Kategorya",
    recentActivity: "Kamakailang Aktibidad",
    tasksLast7Days: "Nagawa sa huling 7 araw",
    completedLast7Days: "Nakumpleto sa huling 7 araw",
    overdueTasks: "Mga nahuling gawain",

    // Sort options
    sortBy: "Ayusin Ayon sa",
    newestFirst: "Pinakabago Muna",

    // Auth
    welcomeBack: "Maligayang Pagbabalik",
    loginAccess: "Mag-login para ma-access ang iyong mga todo list",
    email: "Email",
    password: "Password",
    login: "Mag-login",
    loggingIn: "Naglo-login...",
    or: "O",
    continueWithGoogle: "Magpatuloy gamit ang Google",
    createAccount: "Gumawa ng Account",
    signupStart: "Mag-sign up para simulan ang pamamahala ng iyong mga todo",
    confirmPassword: "Kumpirmahin ang Password",
    passwordHint: "Dapat ay hindi bababa sa 6 na karakter",
    creatingAccount: "Gumagawa ng Account...",

    // Theme
    darkMode: "Madilim na Mode",
    lightMode: "Maliwanag na Mode",

    // Layout customizer
    customizeLayout: "I-customize ang Layout",
    openCustomizer: "Buksan ang Layout Customizer",
    closeCustomizer: "Isara ang Layout Customizer",
    viewType: "Uri ng View",
    gridView: "Grid View",
    listView: "List View",
    density: "Density",
    compact: "Compact",
    comfortable: "Comfortable",
    spacious: "Spacious",
    visibleFields: "Mga Nakikitang Field",
    description: "Paglalarawan",

    // Social Share
    shareToSocial: "Ibahagi sa Social Media",
    share: "Ibahagi",
    copyToClipboard: "Kopyahin",
    copied: "Nakopya!",
    checkOutMyTask: "Tingnan ang aking gawain",
    todoFromApp: "Todo mula sa MyTodoApp",
    status: "Katayuan",
    active: "Aktibo",
    completed: "Nakumpleto",

    // Drag and drop
    dragToReorder: "I-drag para muling ayusin",
    todoReordered: "Matagumpay na muling inayos ang mga gawain",
    errorReordering: "Error sa pag-aayos ng mga gawain",
  },
}

// Create the language context
const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  // Check if we're in the browser and if there's a saved language preference
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language")
      return savedLanguage || "english" // Default to English
    }
    return "english"
  })

  // Get translations for the current language
  const t = translations[language]

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
    }
  }, [language])

  // Toggle between English and Filipino
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "english" ? "filipino" : "english"))
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
