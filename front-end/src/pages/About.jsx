// front-end/src/pages/About.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const capabilities = [
  {
    icon: "bi-diagram-3",
    title: "System design",
    body: "I plan the data model and API shape before writing UI, so features stay consistent as the app grows instead of being patched together.",
  },
  {
    icon: "bi-code-slash",
    title: "Clean implementation",
    body: "Reusable components on the frontend, clear separation of concerns on the backend, and code that the next person (often future me) can follow.",
  },
  {
    icon: "bi-phone",
    title: "Responsive by default",
    body: "Every layout is built to hold up from a small phone screen to a wide desktop, not adapted after the fact.",
  },
  {
    icon: "bi-shield-check",
    title: "Reliable delivery",
    body: "I scope work honestly, communicate blockers early, and hand off projects that are documented and easy to maintain.",
  },
];

const techStack = [
  { icon: "devicon-react-original colored", label: "React" },
  { icon: "devicon-nodejs-plain colored", label: "Node.js" },
  { icon: "devicon-express-original", label: "Express" },
  { icon: "devicon-javascript-plain colored", label: "JavaScript" },
  { icon: "devicon-python-plain colored", label: "Python" },
  { icon: "devicon-mongodb-plain colored", label: "MongoDB" },
  { icon: "devicon-mysql-plain colored", label: "MySQL" },
  { icon: "devicon-bootstrap-plain colored", label: "Bootstrap" },
  { icon: "devicon-git-plain colored", label: "Git & GitHub" },
  { icon: "bi bi-shield-lock", label: "JWT Auth" },
  { icon: "bi bi-hdd-network", label: "REST APIs" },
];

const About = () => {
  return (
    <section className="portfolio-page">
      <div className="background-grid" />
      <div className="background-orb one" />
      <div className="background-orb two" />

      <Container className="portfolio-shell">
        <div className="portfolio-hero">
          <Row className="mb-5 align-items-center">
            <Col lg={7}>
              <span className="eyebrow mb-3 d-inline-flex">About</span>
              <h2 className="section-title">
                Full-stack development, built the way products actually get used
              </h2>
              <p className="section-copy">
                I build complete web applications — from database schema to
                deployed UI — with a focus on clarity and reliability over
                flash. My background spans both JavaScript and Python stacks,
                so I pick the right tool for a problem rather than forcing
                every project into one framework.
              </p>
            </Col>

            <Col lg={5} className="d-none d-lg-block">
              <lottie-player
                src="https://assets5.lottiefiles.com/packages/lf20_iv4dsx3q.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: "100%", height: "320px" }}
              />
            </Col>
          </Row>

          {/* Capabilities Grid */}
          <Row className="g-4 mb-5">
            {capabilities.map((item) => (
              <Col key={item.title} md={6} lg={3}>
                <Card className="h-100 footer-panel about-card-glow border-0">
                  <Card.Body className="p-0">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                      style={{
                        width: "2.75rem",
                        height: "2.75rem",
                        background: "rgba(56, 189, 248, 0.16)",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                      }}
                    >
                      <i
                        className={`bi ${item.icon} fs-5`}
                        style={{ color: "var(--primary-strong)" }}
                      />
                    </div>
                    <Card.Title className="h6 fw-bold mb-2">
                      {item.title}
                    </Card.Title>
                    <Card.Text
                      className="muted-copy small mb-0"
                      style={{ lineHeight: 1.65 }}
                    >
                      {item.body}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Tech Stack Card */}
          <Card className="footer-panel about-card-glow border-0">
            <Card.Body className="p-0">
              <h3 className="h5 fw-bold mb-1">Technologies I work with</h3>
              <p
                className="muted-copy small mb-3"
                style={{ lineHeight: 1.6 }}
              >
                Comfortable across both JavaScript (React, Node.js, Express)
                and Python full-stack development — databases, APIs,
                authentication, and deployment included.
              </p>

              <div className="d-flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech.label}
                    className="tag-chip d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                    style={{ fontSize: "0.86rem", borderRadius: "999px" }}
                  >
                    <i
                      className={tech.icon}
                      style={
                        tech.label === "Express"
                          ? { filter: "var(--express-filter, none)" }
                          : undefined
                      }
                    />
                    {tech.label}
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default About;