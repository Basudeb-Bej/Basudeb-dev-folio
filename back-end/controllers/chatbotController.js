// back-end/controllers/chatbotController.js
const mongoose = require('mongoose');
const ChatLog = require('../modals/chatLogModel');
const Groq = require('groq-sdk');

const isMongoAvailable = () => mongoose.connection.readyState === 1;

const saveChatLog = async (entries) => {
  if (!isMongoAvailable()) return;
  try {
    await ChatLog.insertMany(entries);
  } catch (logError) {
    console.error('Failed to save chat log:', logError?.message || logError);
  }
};

// const systemPrompt = `
// You are the AI portfolio assistant for Basudeb Bej, a MERN stack developer.

// Your Job:
// 1. Answer visitor questions conversationally, dynamically, and clearly.
// 2. Ground all factual details (skills, projects, education, experience) strictly in the provided "Portfolio profile".
// 3. When explaining workflows, technical processes, project architecture, or questions with multiple parts, format them into clear step-by-step numbered points (1., 2., 3.) with line breaks.
// 4. Use markdown bold (**term**) to emphasize key technologies, tools, and core points.
// 5. If a question is unrelated to Basudeb or web development, politely steer the conversation back to his portfolio.

// Tone & Formatting:
// - Professional, approachable, and clean.
// - Highlight tech terms in bold (e.g., **React**, **Node.js**, **Express**, **MongoDB**).
// - For step-by-step answers, use clear numbered lists with separate lines so they are easy to read.
// `;

// back-end/controllers/chatbotController.js

const systemPrompt = `
You are the AI portfolio assistant for Basudeb Bej, a Full-Stack Developer.

Role & Core Responsibilities:
1. Represent Basudeb professionally, warmly, and authentically to potential recruiters, clients, and collaborators.
2. Ground every factual claim (skills, years of experience, projects, education, contact options) strictly in the provided "Portfolio profile". Never invent non-existent projects, employers, or metrics.
3. If asked about technologies outside Basudeb's core stack, be honest about his primary focus while highlighting his quick learning agility and strong foundational knowledge.
4. If a question is off-topic or unrelated to Basudeb, web development, or hiring, politely pivot back to his portfolio.

Response Length & Structure:
- For simple or direct questions (e.g., "What is your stack?", "Where did you study?"): Provide a concise, punchy 2–3 sentence answer.
- For technical explanations, workflows, or project overviews: Use structured, step-by-step numbered points (1., 2., 3.) or bullet points with clean line breaks.
- Always finish your thoughts completely—never leave a list item or concluding thought cut off.

Formatting Guidelines for Chat UI:
- Use markdown bold (**React**, **Node.js**, **Express**, **MongoDB**) to highlight key technologies, metrics, and concepts so answers are easily scannable.
- When creating tables, restrict them to 2 columns (e.g., | Category | Details |) and keep cell values concise so they render comfortably in the chat window.
- Use clean headings (## or ###) only when structuring longer, multi-part answers.

Tone:
- Professional, approachable, confident, and developer-centric.
- Proactive: Where appropriate, wrap up answers with a natural call-to-action (e.g., "Feel free to check out the Projects page, or send a message via the Contact section!").
`;

const buildSystemInstruction = (profileSummary) => {
  return [systemPrompt.trim(), profileSummary].filter(Boolean).join("\n\n");
};

const getMessages = (body) => {
  if (Array.isArray(body?.messages) && body.messages.length > 0) {
    return body.messages.filter((m) => m && m.role && m.content);
  }

  const history = Array.isArray(body?.history)
    ? body.history.filter((m) => m && m.role && m.content)
    : [];

  if (body?.message) {
    return [...history, { role: "user", content: body.message }];
  }

  return history;
};

const handleChat = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing in process.env");
      return res.status(200).json({
        reply: "Groq API key is missing. Please verify GROQ_API_KEY in back-end/.env and restart the backend server.",
      });
    }

    const messages = getMessages(req.body);

    if (!messages.length) {
      return res.status(400).json({
        reply: "Please send a message.",
      });
    }

    const profile = req.body?.profile || {};
    const currentPath = req.body?.currentPath || "/";
    const profileSummary = [
      "Portfolio profile:",
      profile.name ? `Name: ${profile.name}` : "Name: Basudeb Bej",
      profile.role ? `Role: ${profile.role}` : "Role: Full-Stack Developer",
      profile.experienceYears ? `Years of experience: ${profile.experienceYears}` : "Experience: 2 years",
      Array.isArray(profile.skills) && profile.skills.length
        ? `Skills: ${profile.skills.join(", ")}`
        : null,
      profile.stackBreakdown
        ? `Frontend: ${profile.stackBreakdown.Frontend}. Backend: ${profile.stackBreakdown.Backend}. Database: ${profile.stackBreakdown.Database}.`
        : null,
      Array.isArray(profile.projects) && profile.projects.length
        ? `Projects: ${profile.projects
            .map((project) =>
              typeof project === "string"
                ? project
                : `${project.name} (${project.stack}) — ${project.description || ""}`
            )
            .join(" | ")}`
        : null,
      profile.education ? `Education: ${profile.education}` : null,
      profile.availability ? `Availability: ${profile.availability}` : null,
      profile.responseTime ? `Typical response time: ${profile.responseTime}` : null,
      `Current page the visitor is on: ${currentPath}`,
    ]
      .filter(Boolean)
      .join("\n");

    const groq = new Groq({ apiKey });

    // Groq requires conversation history after the system message to start with a 'user' message.
    // Strip any initial assistant greetings from the history:
    let conversationHistory = messages.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    while (conversationHistory.length > 0 && conversationHistory[0].role !== "user") {
      conversationHistory.shift();
    }

    // Fallback if history was only the assistant greeting
    if (conversationHistory.length === 0) {
      conversationHistory = [
        { role: "user", content: req.body?.message || "Hello" },
      ];
    }

    const formattedMessages = [
      { role: "system", content: buildSystemInstruction(profileSummary) },
      ...conversationHistory,
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const reply = chatCompletion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(200).json({
        reply: "I couldn't generate a response. Please try rephrasing your question.",
      });
    }

    saveChatLog([
      { role: "user", message: messages[messages.length - 1]?.content || "", source: "ai", path: currentPath },
      { role: "assistant", message: reply, source: "ai", path: currentPath },
    ]);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error?.message || error);

    return res.status(200).json({
      reply: "Sorry, I had trouble generating a reply. (" + (error?.message || "Please try again shortly.") + ")",
    });
  }
};

const logLocalMessage = async (req, res) => {
  const { role, message, path } = req.body || {};

  if (!role || !message || !["user", "assistant"].includes(role)) {
    return res.status(400).json({ ok: false });
  }

  await saveChatLog([{ role, message, source: "local", path: path || "/" }]);

  return res.status(200).json({ ok: true });
};

module.exports = { handleChat, logLocalMessage };