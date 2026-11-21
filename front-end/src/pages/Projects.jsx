// front-end/src/pages/Projects.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  RevealBlock,
  StaggerGrid,
  StaggerItem,
  TiltCard,
} from "../components/MotionPrimitives";

import image4 from "../assets/img/image4.png";
import image5 from "../assets/img/image5.png";
import image6 from "../assets/img/image6.png";
import image7 from "../assets/img/image7.png";
import image8 from "../assets/img/image8.png";

const projects = [
  {
    number: "01",
    title: "Quantic — AI Chatbot",
    image: image7,
    description:
      "Quantic is a modern AI chat assistant with a clean dark interface, voice input, file attachments, and user accounts for saved, personalised conversations.",
    details: ["AI Chat", "Voice Input", "File Uploads", "Auth"],
    link: "https://quantic-nu.vercel.app/",
    linkLabel: "Open live demo",
  },
  {
    number: "02",
    title: "Payzo — Digital Wallet",
    image: image8,
    description:
      "A full-stack digital wallet web application featuring dynamic UPI QR codes, instant peer-to-peer transfers, real-time analytics, invoicing, and 2FA security.",
    details: ["React", "FastAPI", "Tailwind CSS", "Dynamic UPI QR", "2FA"],
    link: "https://payzo-one.vercel.app/",
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
    title: "Weather-X",
    image: image5,
    description:
      "Weather X is a sleek weather app that provides real-time conditions, forecasts, and location-based updates in a simple, modern interface.",
    details: ["Live updates", "Interactive UI", "REST API"],
    link: "https://weather-x-topaz.vercel.app/",
    linkLabel: "Open live demo",
  },
  {
    number: "05",
    title: "Portfolio Studio",
    image: image4,
    description:
      "A clean personal branding experience that pairs premium typography, animated surfaces, and clear section hierarchy.",
    details: ["React", "Responsive UI", "Motion-ready layout"],
    link: "#",
    linkLabel: "Talk about this project",
  },
];

const Projects = () => {
  return (
    <section className="portfolio-page">
      <div className="portfolio-shell">
        <RevealBlock className="section-heading">
          <h2>Featured work and concepts with a polished presentation</h2>
          <p>
            These cards showcase projects with clear standards, visible structure, and practical implementations.
          </p>
        </RevealBlock>

        <StaggerGrid className="project-grid" stagger={0.09}>
          {projects.map((project) => (
            <StaggerItem key={project.number}>
              <TiltCard className="h-100">
                <article className="project-card futuristic-project-card h-100">
                  <header>
                    <div>
                      <span className="project-number">{project.number}</span>
                      <h3>{project.title}</h3>
                    </div>
                    <span className="project-tag">Featured</span>
                  </header>

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
                    <a
                      href={project.link}
                      className="project-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.linkLabel} <i className="bi bi-arrow-right" />
                    </a>
                  ) : (
                    <Link to="/contact" className="project-link">
                      {project.linkLabel} <i className="bi bi-arrow-right" />
                    </Link>
                  )}
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
};

export default Projects;