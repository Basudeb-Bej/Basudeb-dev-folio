// front-end/src/pages/Contact.jsx
import { useEffect, useRef, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your message right now.");
      }

      const sentOk = result.emailSent !== false;

      setStatus({
        type: sentOk ? "success" : "warning",
        message: sentOk
          ? result.message || "Message sent successfully."
          : result.warning || "Message saved, but email delivery failed.",
      });
      showToast(
        sentOk ? "success" : "warning",
        sentOk
          ? result.message || "Message sent successfully."
          : result.warning || "Message saved, but email delivery failed."
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong while sending the message.",
      });
      showToast(
        "error",
        error.message || "Something went wrong while sending the message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="portfolio-page">
      {/* Contact page-এর অনাকাঙ্ক্ষিত ব্লিঙ্ক/ফ্লিকার বন্ধ করার জন্য লোকাল স্টাইল */}
      <style>{`
        .contact-no-blink .contact-card-primary,
        .contact-no-blink .contact-card-side,
        .contact-no-blink .contact-submit,
        .contact-no-blink .contact-method,
        .contact-no-blink .contact-method i {
          animation: none !important;
        }
      `}</style>

      {toast ? (
        <div className={`contact-toast ${toast.type}`} role="status">
          <i
            className={`bi ${toast.type === "success"
              ? "bi-check-circle-fill"
              : "bi-exclamation-triangle-fill"
              }`}
          />
          <p>{toast.message}</p>
          <button
            type="button"
            className="contact-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      ) : null}

      <div className="portfolio-shell contact-no-blink">
        <div className="contact-grid">
          <div className="contact-card contact-card-primary futuristic-glass-card">
            <span className="eyebrow">Send a message</span>
            <div className="contact-hero-copy">
              <h3>Share your idea, timeline, and what success looks like</h3>
              <p className="contact-copy">
                I like working on projects where the goal is clear and the
                experience matters. A short brief is enough to get a
                conversation started.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="contact-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="contact-input contact-textarea"
                  placeholder="Tell me about your project"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className={`portfolio-btn contact-submit contact-submit-clean ${status.type === "success" ? "contact-submit-sent" : ""
                  }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

          <div className="contact-card contact-card-side futuristic-glass-card">
            <div className="contact-methods">
              {/* GitHub */}
              <div className="contact-method futuristic-tag-chip">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="1.15rem"
                  height="1.15rem"
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <div>
                  <strong>GitHub</strong>
                  <a
                    href="https://github.com/Basudeb-Bej"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github Profile
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="contact-method futuristic-tag-chip">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="1.15rem"
                  height="1.15rem"
                  fill="#0A66C2"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
                <div>
                  <strong>LinkedIn</strong>
                  <a
                    href="https://www.linkedin.com/in/basudeb-bej/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="contact-method futuristic-tag-chip">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="1.15rem"
                  height="1.15rem"
                  fill="#26A5E4"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
                </svg>
                <div>
                  <strong>Telegram</strong>
                  <a
                    href="https://t.me/BasudebBej99"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram Profile
                  </a>
                </div>
              </div>

              {/* YouTube */}
              <div className="contact-method futuristic-tag-chip">
                <img
                  src="https://cdn.simpleicons.org/youtube/FF0000"
                  alt=""
                  style={{ width: "1.15rem", height: "1.15rem", flexShrink: 0 }}
                />
                <div>
                  <strong>YouTube</strong>
                  <a
                    href="https://www.youtube.com/@Basudeb_Bej"
                    target="_blank"
                    rel="noreferrer"
                  >
                    YouTube Channel
                  </a>
                </div>
              </div>

              {/* LeetCode */}
              <div className="contact-method futuristic-tag-chip">
                <img
                  src="https://cdn.simpleicons.org/leetcode/FFA116"
                  alt=""
                  style={{ width: "1.15rem", height: "1.15rem", flexShrink: 0 }}
                />
                <div>
                  <strong>LeetCode</strong>
                  <a
                    href="https://leetcode.com/u/Basudeb_Bej/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LeetCode Profile
                  </a>
                </div>
              </div>

              {/* Fiverr */}
              <div className="contact-method futuristic-tag-chip">
                <img
                  src="https://cdn.simpleicons.org/fiverr/1DBF73"
                  alt=""
                  style={{ width: "1.15rem", height: "1.15rem", flexShrink: 0 }}
                />
                <div>
                  <strong>Fiverr</strong>
                  <a
                    href="https://www.fiverr.com/s/NeW5GLp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Fiverr Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;