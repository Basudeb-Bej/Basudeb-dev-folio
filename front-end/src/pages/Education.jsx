// front-end/src/pages/Education.jsx
import React from "react";
import { RevealBlock, StaggerGrid, StaggerItem } from "../components/MotionPrimitives";

const milestones = [
  {
    icon: "bi-mortarboard-fill",
    title: "Bachelor of Computer Applications (BCA)",
    meta: "2023 – 2027 | MAKAUT University, India",
    description:
      "Studying core subjects including programming, database systems, software engineering, and web development.",
  },
  {
    icon: "bi-journal-text",
    title: "Higher Secondary (Commerce)",
    meta: "2021 – 2023 | Tikrapara A.M. High School",
    description:
      "Focused on Accountancy, Business Studies, Mathematics, and Computer Science. Developed interest in coding and software development.",
  },
  {
    icon: "bi-award-fill",
    title: "Madhyamik",
    meta: "2021 | Tikrapara A.M. High School",
    description:
      "Completed secondary education and built a strong academic base that strengthened my discipline, curiosity, and problem-solving mindset.",
  },
];

const growthAreas = [
  {
    icon: "bi-puzzle-fill",
    title: "Problem solving",
    body: "Breaking UI and backend work into smaller, easier-to-ship pieces.",
  },
  {
    icon: "bi-chat-dots-fill",
    title: "Communication",
    body: "Presenting work clearly through layout, copy, and visual hierarchy.",
  },
  {
    icon: "bi-arrow-repeat",
    title: "Adaptability",
    body: "Learning quickly when a project needs a different stack, structure, or flow.",
  },
];

const Education = () => {
  return (
    <section className="portfolio-page">
      <div className="portfolio-shell">
        <RevealBlock className="section-heading">
          <span className="eyebrow hero-cyber-badge">
            <span className="hero-status-dot" />
            Education
          </span>
          <h2>Academic background and continuous growth</h2>
          <p>
            A structured timeline of formal computer science studies alongside the engineering habits I refine on every project.
          </p>
        </RevealBlock>

        <div className="portfolio-hero-grid">
          {/* Left: Single-layer timeline cards */}
          <StaggerGrid className="timeline" stagger={0.12}>
            {milestones.map((item) => (
              <StaggerItem key={item.title}>
                <div className="timeline-item education-timeline-item futuristic-glass-card">
                  <div className="timeline-icon-badge futuristic-icon-box">
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p style={{ color: "var(--primary)", fontWeight: 600, marginBottom: "0.35rem" }}>
                      {item.meta}
                    </p>
                    <p>{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Right: Single flat panel with clean typographic dividers (no inner boxes) */}
          <RevealBlock delay={0.15} className="portfolio-panel education-panel futuristic-glass-card">
            <span className="eyebrow">What I keep improving</span>

            <div className="d-grid gap-3">
              {growthAreas.map((area, index) => (
                <div
                  key={area.title}
                  style={
                    index !== growthAreas.length - 1
                      ? {
                          paddingBottom: "1rem",
                          borderBottom: "1px solid rgba(166, 191, 255, 0.14)",
                        }
                      : undefined
                  }
                >
                  <div className="education-info-head">
                    <i className={`bi ${area.icon}`} />
                    <strong>{area.title}</strong>
                  </div>
                  <p className="muted-copy">{area.body}</p>
                </div>
              ))}
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
};

export default Education;