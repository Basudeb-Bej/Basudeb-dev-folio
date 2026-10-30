// front-end/src/pages/Skills.jsx
import React, { useState } from "react";
import image2 from "../assets/img/image2.png";
import ImageLightbox from "../components/ImageLightbox";

const skills = [
  {
    title: "Frontend",
    icon: "bi-laptop",
    description: "React, Angular, HTML5, Tailwind CSS, Bootstrap, responsive layouts",
  },
  {
    title: "Backend",
    icon: "bi-braces",
    description: "Python, JS, PHP, Node.js, REST APIs, authentication flow awareness",
  },
  {
    title: "Database",
    icon: "bi-database",
    description: "MongoDB, MySQL, data modeling, CRUD workflow design",
  },
  {
    title: "Tools",
    icon: "bi-gear-fill",
    description: "Git Desktop, GitHub, Vite, debugging, deployment-ready project setup",
  },
  {
    title: "Design",
    icon: "bi-palette",
    description: "Canva, Figma, Visual hierarchy, motion, and clean UI composition",
  },
  {
    title: "Working style",
    icon: "bi-stars",
    description: "Problem solving, iteration, and thoughtful delivery under deadlines",
  },
];

const Skills = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section className="portfolio-page">
      <div className="background-grid" />
      <div className="background-orb one" />
      <div className="background-orb two" />

      <div className="portfolio-shell">
        <div className="portfolio-hero">
          <div className="portfolio-hero-grid">
            <div className="skill-grid">
              {skills.map((skill, index) => (
                <article className="skill-card" key={skill.title} style={{ animationDelay: `${index * 0.08}s` }}>
                  <span className="skill-icon-badge" aria-hidden="true">
                    <i className={`bi ${skill.icon}`} />
                  </span>
                  <strong>{skill.title}</strong>
                  <p>{skill.description}</p>
                </article>
              ))}
            </div>

            <div className="portfolio-panel">
              <div className="experience-card">
                <button
                  type="button"
                  className="experience-image-trigger"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="View certificate in full size"
                >
                  <img
                    src={image2}
                    alt="Full-Stack Developer Internship experience"
                    className="experience-image"
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                    onContextMenu={(event) => event.preventDefault()}
                  />
                  <span className="experience-image-zoom-hint">
                    <i className="bi bi-zoom-in" /> View full size
                  </span>
                </button>

                <div className="experience-content">
                  <span className="eyebrow">Experience</span>
                  <h3>Full-Stack Developer Internship</h3>
                  <p>
                    Built practical{' '}
                    <a
                      href="https://zero-bank-five.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="project-link text-decoration-underline"
                    >
                      'Digital core Banking System'
                    </a>{' '}
                    and web app features during a Full-Stack Developer internship,
                    focusing on React UI work, Node.js and Express flows, MongoDB data handling,
                    and turning ideas into clean user-facing screens.
                  </p>

                  <div className="chip-row mb-2">
                    <span className="skill-chip">React</span>
                    <span className="skill-chip">Node.js</span>
                    <span className="skill-chip">Express</span>
                    <span className="skill-chip">MongoDB</span>
                  </div>

                  {/* Live Project Link */}
                  <a
                    href="https://zero-bank-five.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="project-link d-inline-flex align-items-center gap-2 pt-1"
                  >
                    View ZeroBank Live <i className="bi bi-box-arrow-up-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen ? (
        <ImageLightbox
          src={image2}
          alt="Full-Stack Developer Internship experience — full size"
          onClose={() => setIsLightboxOpen(false)}
        />
      ) : null}
    </section>
  );
};

export default Skills;