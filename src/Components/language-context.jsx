import { createContext, useState, useEffect, useContext } from "react"

// Create translations for English and Filipino
const translations = {
  english: {
    // App header
    appTitle: "Note List App",
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
    markAsComplete: "Mark as Complete",
    markAsIncomplete: "Mark as Incomplete",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",

    // Sort options
    sortBy: "Sort By",
    newestFirst: "Newest First",

    // Auth
    welcomeBack: "Welcome Back",
    email: "Email",
    password: "Password",
    login: "Login",
    loggingIn: "Logging in...",
    or: "OR",
    continueWithGoogle: "Continue with Google",
    createAccount: "Create Account",
    confirmPassword: "Confirm Password",
    passwordHint: "Must be at least 6 characters",
    creatingAccount: "Creating Account...",

    // Theme
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
  },
  filipino: {
    // App header
    appTitle: "Note List App",
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

    // Sort options
    sortBy: "Ayusin Ayon sa",
    newestFirst: "Pinakabago Muna",

    // Auth
    welcomeBack: "Maligayang Pagbabalik",
    email: "Email",
    password: "Password",
    login: "Mag-login",
    loggingIn: "Naglo-login...",
    or: "O",
    continueWithGoogle: "Magpatuloy gamit ang Google",
    createAccount: "Gumawa ng Account",
    confirmPassword: "Kumpirmahin ang Password",
    passwordHint: "Dapat ay hindi bababa sa 6 na karakter",
    creatingAccount: "Gumagawa ng Account...",

    // Theme
    darkMode: "Madilim na Mode",
    lightMode: "Maliwanag na Mode",
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
