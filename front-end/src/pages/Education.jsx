// front-end/src/pages/Education.jsx
import React from "react";

const Education = () => {
  return (
    <section className="portfolio-page">
      <div className="background-grid" />
      <div className="background-orb one" />
      <div className="background-orb two" />

      <div className="portfolio-shell">
        {/* <div className="section-heading education-heading">
          <span className="eyebrow">Education</span>
          <h2>Learning has been a steady part of my development path</h2>
          <p>
            Instead of treating education as a single milestone, I see it as a timeline of growth. Each stage added more structure to how I build, debug, and present web applications.
          </p>
          <div className="education-badge-row">
            <span className="education-chip"><i className="bi bi-mortarboard-fill" /> Academic growth</span>
            <span className="education-chip"><i className="bi bi-journal-code" /> Technical learning</span>
            <span className="education-chip"><i className="bi bi-lightning-charge-fill" /> Practical skills</span>
          </div>
        </div> */}

        <div className="portfolio-hero">
          <div className="portfolio-hero-grid">
            <div className="timeline">
              <div className="timeline-item education-timeline-item">
                <div className="timeline-icon-badge">
                  <i className="bi bi-mortarboard-fill" />
                </div>
                <div>
                  <h3>Bachelor of Computer Applications (BCA)</h3>
                  <p>2023 – 2027 | MAKAUT University, India</p>
                  <p>Studying core subjects including programming, database systems, software engineering, and web development.</p>
                </div>
              </div>
              <div className="timeline-item education-timeline-item">
                <div className="timeline-icon-badge">
                  <i className="bi bi-journal-text" />
                </div>
                <div>
                  <h3>Higher Secondary (Commerce)</h3>
                  <p>2021 – 2023 | Tikrapara A.M. High School</p>
                  <p>Focused on Accountancy, Business Studies, Mathematics, and Computer Science. Developed interest in coding and software development.</p>
                </div>
              </div>
              <div className="timeline-item education-timeline-item">
                <div className="timeline-icon-badge">
                  <i className="bi bi-award-fill" />
                </div>
                <div>
                  <h3>Madhyamik</h3>
                  <p>2021 | Tikrapara A.M. High School</p>
                  <p>Completed secondary education and built a strong academic base that strengthened my discipline, curiosity, and problem-solving mindset.</p>
                </div>
              </div>
            </div>

            <div className="portfolio-panel education-panel">
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

              {/* <p className="muted-copy">
                If you want to add marks, board names, or certifications later, this section can be expanded without changing the layout.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;