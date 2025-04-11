import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import ThemeToggle from "./theme-toggle"
import LanguageToggle from "./language-toggle"
import { useLanguage } from "./language-context"

export const Auth = ({ isLoggedIn }) => {
  const [authMode, setAuthMode] = useState("login") // "login" or "signup"
  const { t } = useLanguage()

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }

  // If user is logged in, show logout button and theme toggle
  if (isLoggedIn) {
    return (
      <div className="header-controls">
        <LanguageToggle />
        <ThemeToggle />
        <button onClick={logOut} className="logout-button">
          {t.logout}
        </button>
      </div>
    )
  }

  // If not logged in, show either login or signup form
  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button className={`auth-tab ${authMode === "login" ? "active" : ""}`} onClick={() => setAuthMode("login")}>
          {t.login}
        </button>
        <button className={`auth-tab ${authMode === "signup" ? "active" : ""}`} onClick={() => setAuthMode("signup")}>
          {t.createAccount}
        </button>
      </div>

      {authMode === "login" ? <LoginForm /> : <SignupForm onSuccess={() => setAuthMode("login")} />}
    </div>
  )
}
