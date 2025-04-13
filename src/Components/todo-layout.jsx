import { Auth } from "./auth"
import Footer from "./Footer"
import { useLanguage } from "./language-context"

export const TodoLayout = ({ user, children }) => {
  const { t } = useLanguage()

  if (!user) {
    // When not logged in, show only the login page
    return (
      <div className="login-page">
        <div className="login-logo">
          <h1>{t.appTitle}</h1>
          <p>Organize your Notes efficiently</p>
        </div>
        <Auth isLoggedIn={false} />
        <Footer />
      </div>
    )
  }

  // When logged in, show the app content with logout button
  return (
    <div className="app-content">
      <div className="app-header">
        <div className="header-logo">
          <img src="./Logo.svg" alt="Todo List App Logo" />
          <h1>{t.appTitle}</h1>
        </div>
        <Auth isLoggedIn={true} />
      </div>
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  )
}

export default TodoLayout
