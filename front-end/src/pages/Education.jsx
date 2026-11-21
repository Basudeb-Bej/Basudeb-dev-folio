// front-end/src/pages/Education.jsx
import React from "react";
import { RevealBlock, StaggerGrid, StaggerItem } from "../components/MotionPrimitives";

const Education = () => {
  return (
    <section className="portfolio-page">
      <div className="portfolio-shell">
        <div className="portfolio-hero">
          <div className="portfolio-hero-grid">
            <StaggerGrid className="timeline" stagger={0.12}>
              <StaggerItem>
                <div className="timeline-item education-timeline-item futuristic-glass-card">
                  <div className="timeline-icon-badge futuristic-icon-box">
                    <i className="bi bi-mortarboard-fill" />
                  </div>
                  <div>
                    <h3>Bachelor of Computer Applications (BCA)</h3>
                    <p>2023 – 2027 | MAKAUT University, India</p>
                    <p>Studying core subjects including programming, database systems, software engineering, and web development.</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="timeline-item education-timeline-item futuristic-glass-card">
                  <div className="timeline-icon-badge futuristic-icon-box">
                    <i className="bi bi-journal-text" />
                  </div>
                  <div>
                    <h3>Higher Secondary (Commerce)</h3>
                    <p>2021 – 2023 | Tikrapara A.M. High School</p>
                    <p>Focused on Accountancy, Business Studies, Mathematics, and Computer Science. Developed interest in coding and software development.</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="timeline-item education-timeline-item futuristic-glass-card">
                  <div className="timeline-icon-badge futuristic-icon-box">
                    <i className="bi bi-award-fill" />
                  </div>
                  <div>
                    <h3>Madhyamik</h3>
                    <p>2021 | Tikrapara A.M. High School</p>
                    <p>Completed secondary education and built a strong academic base that strengthened my discipline, curiosity, and problem-solving mindset.</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerGrid>

            <RevealBlock delay={0.15} className="portfolio-panel education-panel futuristic-glass-card">
              <span className="eyebrow">What I keep improving</span>
              <div className="skill-grid education-skill-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="info-card education-info-card">
                  <div className="education-info-head">
                    <i className="bi bi-puzzle-fill" />
                    <strong>Problem solving</strong>
                  </div>
                  <p>Breaking UI and backend work into smaller, easier-to-ship pieces.</p>
                </div>
                <div className="info-card education-info-card">
                  <div className="education-info-head">
                    <i className="bi bi-chat-dots-fill" />
                    <strong>Communication</strong>
                  </div>
                  <p>Presenting work clearly through layout, copy, and visual hierarchy.</p>
                </div>
                <div className="info-card education-info-card">
                  <div className="education-info-head">
                    <i className="bi bi-arrow-repeat" />
                    <strong>Adaptability</strong>
                  </div>
                  <p>Learning quickly when a project needs a different stack, structure, or flow.</p>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;