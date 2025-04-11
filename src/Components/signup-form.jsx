import { useState } from "react"
import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import { useLanguage } from "./language-context"

export const SignupForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const signUp = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success("Account created successfully!")
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-logo">
      <img src="./Logo.svg" alt="Todo List App Logo" />
      </div>

      <h2>{t.createAccount}</h2>

      <form onSubmit={signUp} className="auth-form">
        <div className="form-group">
          <label htmlFor="signup-email">{t.email}</label>
          <input
            id="signup-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">{t.password}</label>
          <input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <small className="form-hint">{t.passwordHint}</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">{t.confirmPassword}</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" className="auth-button primary-button" disabled={isLoading}>
          {isLoading ? t.creatingAccount : t.createAccount}
        </button>
      </form>
    </div>
  )
}
