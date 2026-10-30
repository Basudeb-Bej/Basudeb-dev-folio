# Basudeb Bej | Full-Stack Developer Portfolio

A responsive full-stack portfolio with a contact form that stores messages in MongoDB and sends email notifications, plus an AI chatbot assistant.

**Live site:** https://basudeb-bej.vercel.app
**API:** https://basudeb-dev-folio.onrender.com

<!-- Add a screenshot or GIF: save it as front-end/public/preview.png, then uncomment -->
<!-- ![Portfolio preview](front-end/public/preview.png) -->

## Features

- Responsive layout with sidebar navigation
- Dark and light mode
- Sections for About, Education, Skills, Projects and Contact
- Contact form with validation, saved to MongoDB, with email notification through Resend
- AI chatbot assistant (Groq / Google Gemini)
- Deployed with CI/CD: frontend on Vercel, backend on Render

## Tech Stack

| Layer     | Technologies                                   |
|-----------|------------------------------------------------|
| Frontend  | React, Vite                                    |
| Backend   | Node.js, Express 5                             |
| Database  | MongoDB Atlas, Mongoose                        |
| Email     | Resend API                                     |
| AI        | Groq SDK, Google Generative AI                 |
| Hosting   | Vercel (frontend), Render (backend)            |

## Project Structure

```
Basudeb-dev-folio/
├── front-end/    # React + Vite app
└── back-end/     # Express API (contact + chatbot routes)
```

## Run Locally

**Prerequisites:** Node.js 18+ and a MongoDB connection string.

```bash
# 1. Clone
git clone https://github.com/Basudeb-Bej/Basudeb-dev-folio.git
cd Basudeb-dev-folio

# 2. Backend
cd back-end
npm install
npm run dev        # http://localhost:8000

# 3. Frontend (new terminal)
cd front-end
npm install
npm run dev
```

## Environment Variables

Create `back-end/.env` (never commit this file). Match the names to what your code reads:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
CONTACT_RECEIVER_EMAIL=you@example.com
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
```

Create `front-end/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Deployment

- **Frontend:** Vercel, root directory `front-end`, with a `vercel.json` rewrite for client-side routing.
- **Backend:** Render, root directory `back-end`, start command `npm start`.

## Contact

**Basudeb Bej**: [GitHub](https://github.com/Basudeb-Bej) · [Live Portfolio](https://basudeb-bej.vercel.app)
