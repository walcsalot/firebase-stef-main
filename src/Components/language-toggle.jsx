import { useLanguage } from "./language-context"

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle-button"
      aria-label={`Switch to ${language === "english" ? "Filipino" : "English"} language`}
    >
      {language === "english" ? "🇵🇭" : "🇺🇸"}
    </button>
  )
}

export default LanguageToggle
