// front-end/src/components/Chatbot.jsx
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "portfolio-chatbot-state-v3";
const MAX_HISTORY = 12;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PROFILE = {
  name: "Basudeb Bej",
  role: "Full-Stack Developer",
  experienceYears: 2,
  projects: [
    { name: "Portfolio Website", stack: "React, Node.js, Express, MongoDB", description: "A personal Full-Stack Developer portfolio with a live AI chat assistant and contact form backed by MongoDB and email delivery." },
    { name: "Quantic", stack: "AI Chat Assistant", description: "A modern AI chatbot with voice input, file uploads, and saved chats." },
  ],
  skills: ["React", "Node.js", "Express", "MongoDB", "Angular", "Bootstrap", "JavaScript"],
  stackBreakdown: {
    Frontend: "React, Bootstrap, custom CSS systems",
    Backend: "Node.js, Express, REST APIs",
    Database: "MongoDB, schema design",
  },
  education: "Bachelor's in Computer Science",
  availability: "Open to freelance and full-time Full-Stack Developer roles",
  responseTime: "usually within 24 hours",
};

const renderInline = (str) => {
  if (!str) return null;
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let tableBuffer = [];

  const flushTable = (key) => {
    if (!tableBuffer.length) return;

    // Parse table cells by splitting pipes |
    const rawRows = tableBuffer.map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1)
    );

    // Take the first row as the table header
    const headerRow = rawRows.shift() || [];

    // Helper to check if a row is a markdown separator (e.g. |---|---|)
    const isSeparator = (cells) =>
      Array.isArray(cells) &&
      cells.length > 0 &&
      cells.every((c) => typeof c === "string" && /^[:\-\s]+$/.test(c));

    // If the next row is the separator line, discard it
    if (rawRows.length > 0 && isSeparator(rawRows.at(0))) {
      rawRows.shift();
    }

    const dataRows = rawRows;

    elements.push(
      <div key={`table-${key}`} className="chatbot-table-box">
        <table className="chatbot-table">
          <thead>
            <tr>
              {headerRow.map((cell, cIdx) => (
                <th key={cIdx}>{renderInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Detect markdown table rows
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      tableBuffer.push(trimmed);
      return;
    }

    if (tableBuffer.length > 0) {
      flushTable(index);
    }

    // Catch any markdown heading (#, ##, or ###)
    if (/^#{1,3}\s/.test(trimmed)) {
      elements.push(
        <div key={index} className="chatbot-heading">
          {renderInline(trimmed.replace(/^#+\s*/, ""))}
        </div>
      );
      return;
    }

    // Horizontal divider (--- or ***)
    if (trimmed === "---" || trimmed === "***") {
      elements.push(<hr key={index} className="chatbot-hr" />);
      return;
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={index} className="chatbot-spacer" />);
      return;
    }

    // Regular line / step
    elements.push(
      <div key={index} className="chatbot-line">
        {renderInline(line)}
      </div>
    );
  });

  if (tableBuffer.length > 0) {
    flushTable("end");
  }

  return elements;
};

const ROUTE_PROMPTS = {
  "/": {
    summary: "A polished portfolio overview with clear navigation and visual hierarchy.",
    prompts: ["Show projects", "Tell me about skills", "Open contact"],
  },
  "/about": {
    summary: "Design-first thinking, responsive UI, and practical frontend delivery.",
    prompts: ["Open about", "Show skills", "What is your design style?"],
  },
  "/education": {
    summary: "A concise view of academic background and learning milestones.",
    prompts: ["Show education", "What did you study?", "Open projects"],
  },
  "/skills": {
    summary: "A focused summary of the stack and tools used across the portfolio.",
    prompts: ["Show React skills", "What backend tools do you use?", "Open projects"],
  },
  "/projects": {
    summary: "Project highlights with direct links and a clear breakdown of work.",
    prompts: ["Tell me about the Portfolio Website", "Show projects", "Open contact"],
  },
  "/contact": {
    summary: "Clear contact options and a straightforward message form.",
    prompts: ["Open contact", "How can I reach you?", "Show projects"],
  },
};

const DEFAULT_PROMPTS = ["Show projects", "Skills", "Contact", "Education"];

const initialMessages = [
  {
    role: "assistant",
    content: `Hi, I’m the assistant for ${PROFILE.name}. Ask me about projects, skills, education, or contact details.`,
  },
];

const isValidMessage = (message) => Boolean(message && message.role && message.content);

const loadMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialMessages;
    }

    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed.messages.filter(isValidMessage);
    }

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter(isValidMessage);
    }
  } catch {
    return initialMessages;
  }
  return initialMessages;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadMessages());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quotaCooldown, setQuotaCooldown] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const endRef = useRef(null);
  const closeTimerRef = useRef(null);
  const quotaCooldownTimerRef = useRef(null);
  const inFlightRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const routeMeta = useMemo(() => ROUTE_PROMPTS[location.pathname] || null, [location.pathname]);
  const suggestions = routeMeta?.prompts || DEFAULT_PROMPTS;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages }));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (quotaCooldownTimerRef.current) {
        window.clearTimeout(quotaCooldownTimerRef.current);
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  };

  const speakMessage = (text, index) => {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance === "undefined") {
      return;
    }

    // If this message is already speaking, clicking it stops the voice
    if (speakingIndex === index) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const logLocalMessage = (role, content) => {
    fetch(`${API_BASE_URL}/api/chat/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, message: content, path: location.pathname }),
    }).catch(() => { });
  };

  const NAV_COMMAND_REGEX =
    /^(?:open|go to|navigate to|take me to|show me|show|tell me about)\s+(?:the\s+)?(home|about|education|skills?|projects?|contact)(?:\s+page)?$/i;

  const ROUTE_BY_TARGET = {
    home: "/",
    about: "/about",
    education: "/education",
    skill: "/skills",
    skills: "/skills",
    project: "/projects",
    projects: "/projects",
    contact: "/contact",
  };

  const hasWord = (text, word) => new RegExp(`\\b${word}\\b`, "i").test(text);

  const detectIntent = (text) => {
    const normalized = text.toLowerCase().trim();

    const navMatch = normalized.match(NAV_COMMAND_REGEX);
    if (navMatch) {
      // Destructure group 1 so target is cleanly "projects", "contact", etc.
      const [, target] = navMatch;
      const targetKey = target ? target.toLowerCase() : "";

      if (targetKey && ROUTE_BY_TARGET[targetKey]) {
        return {
          type: "local",
          response: `Opening the ${targetKey} page now.`,
          route: ROUTE_BY_TARGET[targetKey],
        };
      }
    }

    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    const isShortDirectQuestion = wordCount <= 6;

    if (isShortDirectQuestion && hasWord(normalized, "how many project(s)?")) {
      return {
        type: "local",
        response: `There ${PROFILE.projects.length === 1 ? "is" : "are"} currently ${PROFILE.projects.length} project${PROFILE.projects.length === 1 ? "" : "s"} on this portfolio: ${PROFILE.projects.map((project) => project.name).join(", ")}.`,
        route: "/projects",
      };
    }

    if (isShortDirectQuestion && hasWord(normalized, "projects?")) {
      const projectDetails = PROFILE.projects
        .map((project) => `${project.name} — ${project.description}`)
        .join(" ");

      return {
        type: "local",
        response: `${projectDetails} Opening the projects page for more detail.`,
        route: "/projects",
      };
    }

    if (isShortDirectQuestion && (hasWord(normalized, "years?") || hasWord(normalized, "experience"))) {
      return {
        type: "local",
        response: `${PROFILE.experienceYears} year${PROFILE.experienceYears === 1 ? "" : "s"} of hands-on Full-Stack Developer development, spanning ${Object.values(PROFILE.stackBreakdown).join("; ")}.`,
      };
    }

    if (isShortDirectQuestion && (hasWord(normalized, "skills?") || hasWord(normalized, "stack") || hasWord(normalized, "tech"))) {
      return {
        type: "local",
        response: `Core stack: ${PROFILE.skills.join(", ")}. Frontend: ${PROFILE.stackBreakdown.Frontend}. Backend: ${PROFILE.stackBreakdown.Backend}. Database: ${PROFILE.stackBreakdown.Database}.`,
        route: "/skills",
      };
    }

    if (isShortDirectQuestion && (hasWord(normalized, "available") || hasWord(normalized, "hire") || hasWord(normalized, "freelance"))) {
      return {
        type: "local",
        response: `${PROFILE.availability}. Response time on messages is ${PROFILE.responseTime}.`,
        route: "/contact",
      };
    }

    if (isShortDirectQuestion && (hasWord(normalized, "contact") || hasWord(normalized, "reach"))) {
      return {
        type: "local",
        response: `Opening the contact page — messages typically get a reply ${PROFILE.responseTime}.`,
        route: "/contact",
      };
    }

    if (isShortDirectQuestion && (hasWord(normalized, "education") || hasWord(normalized, "study") || hasWord(normalized, "degree"))) {
      return {
        type: "local",
        response: `${PROFILE.education}. Opening the education page for the full timeline.`,
        route: "/education",
      };
    }

    // Anything longer, open-ended, or not an exact match goes to Gemini
    // so it gets a real, context-aware answer instead of a canned one.
    return { type: "ai" };
  };
  const closePanel = () => {
    setIsClosing(true);
    stopSpeaking();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 180);
  };

  const openPanel = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    setOpen(true);
    setIsClosing(false);
  };

  const sendMessage = async (rawMessage) => {
    const trimmedMessage = rawMessage.trim();

    if (!trimmedMessage || loading || quotaCooldown || inFlightRef.current) {
      return;
    }

    stopSpeaking();

    const nextMessages = [...messages, { role: "user", content: trimmedMessage }].slice(-MAX_HISTORY);
    setMessages(nextMessages);
    setInput("");

    const intent = detectIntent(trimmedMessage);

    if (intent.type === "local") {
      logLocalMessage("user", trimmedMessage);

      window.setTimeout(() => {
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: "assistant", content: intent.response },
        ].slice(-MAX_HISTORY));

        logLocalMessage("assistant", intent.response);

        if (intent.route) {
          navigate(intent.route);
        }
      }, 220);

      return;
    }

    inFlightRef.current = true;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history: nextMessages.slice(0, -1),
          profile: PROFILE,
          currentPath: location.pathname,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (response.status === 429) {
        const retryAfterSeconds = Number(result.retryAfterSeconds) > 0 ? Number(result.retryAfterSeconds) : 20;

        setQuotaCooldown(true);

        if (quotaCooldownTimerRef.current) {
          window.clearTimeout(quotaCooldownTimerRef.current);
        }

        quotaCooldownTimerRef.current = window.setTimeout(() => {
          setQuotaCooldown(false);
        }, retryAfterSeconds * 1000);

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            role: "assistant",
            content: result.reply || `Gemini quota is busy right now. Try again in about ${retryAfterSeconds} seconds.`,
          },
        ].slice(-MAX_HISTORY));

        return;
      }

      const reply = result.reply || "Gemini is unavailable right now, so live replies are unavailable.";

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: reply },
      ].slice(-MAX_HISTORY));
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: "Gemini is returning a quota error, so live replies are unavailable right now. Add billing or available credits to restore online chat.",
        },
      ].slice(-MAX_HISTORY));
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const resetChat = () => {
    stopSpeaking();
    setMessages(initialMessages);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentLabel = routeMeta?.summary || "Ask about my projects, skills, education, or contact details.";
  const isChatDisabled = loading || quotaCooldown;

  const chatbotUi = (
    <div className="chatbot-shell">
      {open ? (
        <div className={`chatbot-panel ${isClosing ? "chatbot-panel-closing" : "chatbot-panel-open"}`}>
          <div className="chatbot-panel-header">
            <div>
              <span className="chatbot-eyebrow">Portfolio Assistant</span>
            </div>
            <div className="chatbot-header-actions">
              <button type="button" className="chatbot-reset" onClick={resetChat}>
                Reset
              </button>
              <button type="button" className="chatbot-icon-button" onClick={closePanel} aria-label="Close chat">
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          {/* <div className="chatbot-status-row">
            <span className="chatbot-status-pill">
              <i className="bi bi-sparkles" />
              {quotaCooldown ? "Gemini quota is cooling down. Please try again shortly." : currentLabel}
            </span>
          </div> */}

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chatbot-message ${message.role}`}>
                {/* Inside messages.map(...) */}
                <div className="chatbot-message-row">
                  <span>{renderFormattedText(message.content)}</span>

                  {message.role === "assistant" ? (
                    <button
                      type="button"
                      className={`chatbot-speak ${speakingIndex === index ? "is-speaking" : ""}`}
                      onClick={() => speakMessage(message.content.replace(/[\*\#\|]/g, " ").replace(/-{3,}/g, ""), index)}
                      aria-label="Read answer aloud"
                      title="Read aloud"
                    >
                      <i className={`bi ${speakingIndex === index ? "bi-volume-up-fill" : "bi-volume-up"}`} />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="chatbot-message assistant chatbot-typing" aria-label="Assistant is typing">
                <span className="chatbot-dots">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="chatbot-actions">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chatbot-chip"
                onClick={() => sendMessage(prompt)}
              >
                <i className="bi bi-chat-square-text" />
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="chatbot-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about projects, skills, or contact..."
              className="chatbot-input"
              disabled={isChatDisabled}
            />
            <button type="submit" className="chatbot-send" disabled={isChatDisabled} aria-label="Send message">
              <i className="bi bi-send-fill" />
            </button>
          </form>
        </div>
      ) : null}

      <button type="button" className="chatbot-launcher" onClick={openPanel} aria-label="Open chat assistant">
        <span className="chatbot-launcher-avatar">
          <i className="bi bi-robot" />
        </span>
        <span className="chatbot-launcher-pulse" />
      </button>
    </div>
  );

  if (typeof document === "undefined") {
    return chatbotUi;
  }

  return createPortal(chatbotUi, document.body);
};

export default Chatbot;
