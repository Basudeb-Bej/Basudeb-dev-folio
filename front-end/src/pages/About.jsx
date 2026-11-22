// front-end/src/pages/About.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  RevealBlock,
  StaggerGrid,
  StaggerItem,
} from "../components/MotionPrimitives";

const architectureLayers = [
  {
    id: "client",
    label: "Frontend",
    title: "Responsive Frontend Systems",
    stack: "React • Angular • Tailwind • Bootstrap",
    detail:
      "Component-driven interfaces with fluid motion, accessible states, and mobile-first layouts across every viewport.",
  },
  {
    id: "api",
    label: "API & Auth",
    title: "RESTful Services & Security",
    stack: "Node.js • Express • FastAPI • JWT & 2FA",
    detail:
      "Structured endpoints, role-based access control, automated KYC pipelines, and two-factor transaction verification.",
  },
  {
    id: "data",
    label: "Database",
    title: "Schema Modeling & Cloud",
    stack: "MongoDB • MySQL • Git • Vercel & Render",
    detail:
      "Normalized and document schemas built for data integrity, backed by automated CI/CD cloud deployments.",
  },
];

const pillars = [
  {
    num: "01",
    icon: "bi-diagram-3",
    title: "System Design First",
    body: "Data models and API contracts mapped before UI code so features scale cleanly.",
  },
  {
    num: "02",
    icon: "bi-code-slash",
    title: "Maintainable Code",
    body: "Modular components and clear backend separation built for long-term iteration.",
  },
  {
    num: "03",
    icon: "bi-shield-check",
    title: "Security & Reliability",
    body: "Production JWT/2FA authentication, input validation, and resilient error handling.",
  },
  {
    num: "04",
    icon: "bi-lightning-charge",
    title: "End-to-End Ownership",
    body: "From database schema to live cloud URL—delivering complete products on schedule.",
  },
];

const About = () => {
  const [activeLayer, setActiveLayer] = useState("client");
  const currentLayer =
    architectureLayers.find((layer) => layer.id === activeLayer) ||
    architectureLayers[0];

  return (
    <section className="portfolio-page">
      <Container className="portfolio-shell">
        {/* TOP SECTION: Open Typography (Left) + Single Interactive Card (Right) */}
        <Row className="g-4 g-lg-5 align-items-center mb-5">
          <Col lg={7}>
            <RevealBlock>
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <span className="eyebrow hero-cyber-badge">
                  <span className="hero-status-dot" />
                  About Me
                </span>
                <span className="about-inline-meta">
                  <i className="bi bi-geo-alt" /> India 
                </span>
              </div>

              <h2 className="about-hero-heading mb-3">
                Full-Stack Developer building{" "}
                <span className="hero-gradient-highlight">
                  scalable, user-centric software
                </span>{" "}
                from schema to cloud.
              </h2>

              <p className="section-copy mb-4">
                I’m <strong>Basudeb Bej</strong>. I architect and ship complete
                web applications across JavaScript and Python ecosystems—combining
                clean backend engineering, secure authentication workflows, and
                refined, responsive UI.
              </p>

              {/* Flat Typographic Spec Strip (No Boxes) */}
              {/* <div className="about-spec-strip mb-4">
                <div className="about-spec-item">
                  <strong>Full-Stack</strong>
                  <span>MERN & Python</span>
                </div>
                <div className="about-spec-divider" />
                <div className="about-spec-item">
                  <strong>Production</strong>
                  <span>Banking, AI & FinTech</span>
                </div>
                <div className="about-spec-divider" />
                <div className="about-spec-item">
                  <strong>Security</strong>
                  <span>JWT, 2FA & KYC</span>
                </div>
              </div> */}

              {/* Clean CTA Row */}
              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/projects"
                  className="portfolio-btn portfolio-btn-primary futuristic-btn-glow"
                >
                  View Projects <i className="bi bi-arrow-right" />
                </Link>
                <Link
                  to="/skills"
                  className="portfolio-btn portfolio-btn-secondary futuristic-btn-outline"
                >
                  Tech Stack <i className="bi bi-layers" />
                </Link>
                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="portfolio-btn portfolio-btn-secondary futuristic-btn-outline"
                >
                  Resume <i className="bi bi-file-earmark-arrow-down" />
                </a>
              </div>
            </RevealBlock>
          </Col>

          {/* Single Flat Card — No Inner Nested Boxes */}
          <Col lg={5}>
            <RevealBlock delay={0.12}>
              <div className="about-single-card about-card-glow">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="about-blueprint-kicker">
                    <i className="bi bi-cpu" /> ARCHITECTURE FOCUS
                  </span>
                  <div
                    className="about-underline-tabs"
                    role="tablist"
                    aria-label="System Architecture Layers"
                  >
                    {architectureLayers.map((layer) => {
                      const isActive = layer.id === activeLayer;
                      return (
                        <button
                          key={layer.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActiveLayer(layer.id)}
                          className={`about-underline-tab ${
                            isActive ? "is-active" : ""
                          }`}
                        >
                          {layer.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="about-layer-content" key={currentLayer.id}>
                  <h3 className="about-layer-title">{currentLayer.title}</h3>
                  <p className="about-layer-stack">{currentLayer.stack}</p>
                  <p className="about-layer-desc">{currentLayer.detail}</p>
                </div>
              </div>
            </RevealBlock>
          </Col>
        </Row>

        {/* BOTTOM ROW: 4 Flat Engineering Pillars (Single Card Layer Only) */}
        <StaggerGrid stagger={0.08}>
          <Row className="g-3">
            {pillars.map((item) => (
              <Col key={item.title} sm={6} lg={3}>
                <StaggerItem className="h-100">
                  <div className="about-single-card about-card-glow futuristic-glass-card h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="about-pillar-icon">
                        <i className={`bi ${item.icon}`} />
                      </div>
                      <span className="about-pillar-num">{item.num}</span>
                    </div>
                    <h3 className="about-pillar-title">{item.title}</h3>
                    <p className="about-pillar-body">{item.body}</p>
                  </div>
                </StaggerItem>
              </Col>
            ))}
          </Row>
        </StaggerGrid>
      </Container>
    </section>
  );
};

export default About;