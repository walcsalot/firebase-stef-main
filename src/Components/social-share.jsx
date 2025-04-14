"use client"

import { useState } from "react"
import { useLanguage } from "./language-context"

export const SocialShare = ({ todo }) => {
  const { t } = useLanguage()
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copySuccess, setCopySuccess] = useState("")

  // Format the todo content for sharing
  const getShareContent = () => {
    const title = `${t.checkOutMyNote} \nTitle: ${todo.name}`
    const description = todo.description
    const priority = `${t.priority}: ${todo.priority}`
    const category = `${t.category}: ${todo.category}`
    const status = todo.completed ? t.completed : t.active

    return `${title}\nDescription: ${description}\n${priority}\n${category}\n${t.status}: ${status}`
  }

  // Share using the Web Share API if available
  const handleShare = async () => {
    const shareContent = getShareContent()

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.todoFromApp}`,
          text: shareContent,
          // url: window.location.href, // Uncomment if you want to share the app URL
        })
        setShowShareOptions(false)
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to showing share options
      setShowShareOptions(!showShareOptions)
    }
  }

  // Share on Twitter
  const shareOnTwitter = () => {
    const shareContent = encodeURIComponent(getShareContent())
    window.open(`https://twitter.com/intent/tweet?text=${shareContent}`, "_blank")
    setShowShareOptions(false)
  }

  // Share on Facebook
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
    setShowShareOptions(false)
  }

  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const shareContent = encodeURIComponent(getShareContent())
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${shareContent}`, "_blank")
    setShowShareOptions(false)
  }

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const shareContent = encodeURIComponent(getShareContent())
    window.open(`https://wa.me/?text=${shareContent}`, "_blank")
    setShowShareOptions(false)
  }

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${t.todoFromApp}: ${todo.name}`)
    const body = encodeURIComponent(getShareContent())
    window.open(`mailto:?subject=${subject}&body=${body}`)
    setShowShareOptions(false)
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(getShareContent())
      .then(() => {
        setCopySuccess(t.copied)
        setTimeout(() => setCopySuccess(""), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="social-share">
      <button className="share-btn" onClick={handleShare} aria-label={t.share} title={t.share}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>{t.share}</span>
      </button>

      {showShareOptions && (
        <div className="share-options">
          <button onClick={shareOnTwitter} className="social-share-btn twitter-share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            Twitter
          </button>
          <button onClick={shareOnFacebook} className="social-share-btn facebook-share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Facebook
          </button>
          <button onClick={shareOnLinkedIn} className="social-share-btn linkedin-share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            LinkedIn
          </button>
          <button onClick={shareOnWhatsApp} className="social-share-btn whatsapp-share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            WhatsApp
          </button>
          <button onClick={shareViaEmail} className="social-share-btn email-share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Email
          </button>
          <button onClick={copyToClipboard} className="social-share-btn copy-share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copySuccess || t.copyToClipboard}
          </button>
        </div>
      )}
    </div>
  )
}

export default SocialShare
