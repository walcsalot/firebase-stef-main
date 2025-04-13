import { useState, useEffect } from "react"
import { useLanguage } from "./language-context"

export const LayoutCustomizer = ({ onLayoutChange }) => {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // Layout options
  const [viewType, setViewType] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("viewType") || "grid"
    }
    return "grid"
  })

  const [density, setDensity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("density") || "comfortable"
    }
    return "comfortable"
  })

  const [visibleFields, setVisibleFields] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("visibleFields")
      return saved
        ? JSON.parse(saved)
        : {
            description: true,
            dateAdded: true,
            expiryDate: true,
            priority: true,
            category: true,
          }
    }
    return {
      description: true,
      dateAdded: true,
      expiryDate: true,
      priority: true,
      category: true,
    }
  })

  // Update layout when settings change
  useEffect(() => {
    localStorage.setItem("viewType", viewType)
    localStorage.setItem("density", density)
    localStorage.setItem("visibleFields", JSON.stringify(visibleFields))

    onLayoutChange({
      viewType,
      density,
      visibleFields,
    })
  }, [viewType, density, visibleFields, onLayoutChange])

  // Toggle field visibility
  const toggleField = (field) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className={`layout-customizer ${isOpen ? "open" : "closed"}`}>
      <button
        className="layout-customizer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t.closeCustomizer : t.openCustomizer}
      >
        {isOpen ? "✕" : "⚙️"}
      </button>

      {isOpen && (
        <div className="layout-customizer-content">
          <h3>{t.customizeLayout}</h3>

          <div className="layout-option">
            <label>{t.viewType}</label>
            <div className="layout-option-buttons">
              <button className={viewType === "grid" ? "active" : ""} onClick={() => setViewType("grid")}>
                {t.gridView}
              </button>
              <button className={viewType === "list" ? "active" : ""} onClick={() => setViewType("list")}>
                {t.listView}
              </button>
            </div>
          </div>

          <div className="layout-option">
            <label>{t.density}</label>
            <div className="layout-option-buttons">
              <button className={density === "compact" ? "active" : ""} onClick={() => setDensity("compact")}>
                {t.compact}
              </button>
              <button className={density === "comfortable" ? "active" : ""} onClick={() => setDensity("comfortable")}>
                {t.comfortable}
              </button>
              <button className={density === "spacious" ? "active" : ""} onClick={() => setDensity("spacious")}>
                {t.spacious}
              </button>
            </div>
          </div>

          <div className="layout-option">
            <label>{t.visibleFields}</label>
            <div className="field-toggles">
              <label className="field-toggle">
                <input
                  type="checkbox"
                  checked={visibleFields.description}
                  onChange={() => toggleField("description")}
                />
                {t.description}
              </label>
              <label className="field-toggle">
                <input type="checkbox" checked={visibleFields.dateAdded} onChange={() => toggleField("dateAdded")} />
                {t.dateAdded}
              </label>
              <label className="field-toggle">
                <input type="checkbox" checked={visibleFields.expiryDate} onChange={() => toggleField("expiryDate")} />
                {t.expiryDate}
              </label>
              <label className="field-toggle">
                <input type="checkbox" checked={visibleFields.priority} onChange={() => toggleField("priority")} />
                {t.priority}
              </label>
              <label className="field-toggle">
                <input type="checkbox" checked={visibleFields.category} onChange={() => toggleField("category")} />
                {t.category}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayoutCustomizer
