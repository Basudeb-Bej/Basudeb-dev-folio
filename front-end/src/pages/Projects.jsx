// front-end/src/pages/Projects.jsx
import React from "react";
import { Link } from "react-router-dom";

import image4 from "../assets/img/image4.png";
import image5 from "../assets/img/image5.png";
import image6 from "../assets/img/image6.png";
import image7 from "../assets/img/image7.png";

const projects = [
  {
    number: "01",
    title: "Portfolio Studio",
    image: image4,
    description:
      "A clean personal branding experience that pairs premium typography, animated surfaces, and clear section hierarchy.",
    details: ["React", "Responsive UI", "Motion-ready layout"],
    link: "#",
    linkLabel: "Talk about this project",
  },
  {
    number: "02",
    title: "Weather-X",
    image: image5,
    description:
      "Weather X is a sleek weather app that provides real-time conditions, forecasts, and location-based updates in a simple, modern interface.",
    details: ["Live updates", "Interactive UI", "REST API"],
    link: "https://weather-x-topaz.vercel.app/",
    linkLabel: "Open live demo",
  },
  {
    number: "03",
    title: "ZeroBank — Core Banking",
    image: image6,
    description:
      "A full-stack digital core banking platform featuring online account opening with admin approval workflows, automated KYC, real-time fund transfers, and email notifications.",
    details: ["React", "Node.js", "Express", "MongoDB", "Nodemailer"],
    link: "https://zero-bank-five.vercel.app/",
    linkLabel: "Open live demo",
  },
    {
    number: "04",
    title: "Quantic — AI Chatbot",
    image: image7,
    description:
      "Quantic is a modern AI chat assistant with a clean dark interface, voice input, file attachments, and user accounts for saved, personalised conversations.",
    details: ["AI Chat", "Voice Input", "File Uploads", "Auth"],
    link: "https://quantic-nu.vercel.app/",
    linkLabel: "Open live demo",
  },
];

const Projects = () => {
  return (
    <section className="portfolio-page">
      <style>{`
        .project-image-wrapper {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(166, 191, 255, 0.14);
          background: rgba(0, 0, 0, 0.2);
          margin-bottom: 0.8rem;
        }
        .project-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .project-card:hover .project-card-image {
          transform: scale(1.05);
        }
        body.light .project-image-wrapper {
          border-color: rgba(15, 23, 42, 0.08);
          background: rgba(15, 23, 42, 0.04);
        }
      `}</style>

      <div className="background-grid" />
      <div className="background-orb one" />
      <div className="background-orb two" />

      <div className="portfolio-shell">
        <div className="section-heading">
          <h2>Featured work and concepts with a polished presentation</h2>
          <p>
            These cards showcase projects with clear standards, visible structure, and practical implementations.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <header>
                <div>
                  <span className="project-number">{project.number}</span>
                  <h3>{project.title}</h3>
                </div>
                <span className="project-tag">Featured</span>
              </header>

              {/* Project Image Preview */}
              {project.image && (
                <div className="project-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-card-image"
                    loading="lazy"
                  />
                </div>
              )}

              <p>{project.description}</p>

              <div className="chip-row">
                {project.details.map((detail) => (
                  <span className="skill-chip" key={detail}>
                    {detail}
                  </span>
                ))}
              </div>

              <div className="divider-line" />

              {project.link && project.link.startsWith("http") ? (
                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                  {project.linkLabel} <i className="bi bi-arrow-right" />
                </a>
              ) : (
                <Link to="/contact" className="project-link">
                  {project.linkLabel} <i className="bi bi-arrow-right" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;