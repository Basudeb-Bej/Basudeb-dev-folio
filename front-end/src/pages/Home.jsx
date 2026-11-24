// front-end/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { motion, useReducedMotion } from "framer-motion";
import image from "../assets/img/image3.png";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];

const Home = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
        initial: { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: EASE_OUT_EXPO },
      };

  return (
    <section className="portfolio-page home-page">
      <div className="portfolio-shell">
        <div className="portfolio-hero">
          <div className="portfolio-hero-grid">
            <div>
              <motion.div
                className="d-flex flex-wrap align-items-center gap-3 mb-3"
                {...fadeUp(0.05)}
              >
                <span className="eyebrow hero-cyber-badge">
                  <span className="hero-status-dot" />
                  Full-Stack Developer
                </span>
                <span className="about-inline-meta">
                  <i className="bi bi-geo-alt" /> India
                </span>
              </motion.div>

              <motion.h2
                className="section-title hero-futuristic-title"
                style={{
                  fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)",
                  lineHeight: 1.05,
                }}
                {...fadeUp(0.14)}
              >
                I build fast, polished{" "}
                <strong className="hero-gradient-highlight">
                  end-to-end web applications
                </strong>
                —from database to deployment.
              </motion.h2>

              <motion.p className="section-copy" {...fadeUp(0.24)}>
                I create responsive interfaces, practical API-driven features, and
                visual systems that make a website feel premium. The focus is always
                the same: clarity, usability, and a strong first impression
              </motion.p>

              <motion.div className="hero-type-line" {...fadeUp(0.32)}>
                <span className="hero-type-label">Focused on</span>
                <TypeAnimation
                  sequence={[
                    "React interfaces and polished UI design",
                    1800,
                    "Node.js APIs and Express servers",
                    1800,
                    "MongoDB data layers and schemas",
                    1800,
                    "Professional UI design",
                    1800,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="hero-type-text"
                />
              </motion.div>

              <motion.div className="hero-actions" {...fadeUp(0.4)}>
                <Link
                  to="/projects"
                  className="portfolio-btn portfolio-btn-primary futuristic-btn-glow"
                >
                  View Projects <i className="bi bi-arrow-right" />
                </Link>
                <Link
                  to="/contact"
                  className="portfolio-btn portfolio-btn-secondary futuristic-btn-outline"
                >
                  Contact Me <i className="bi bi-send" />
                </Link>
                <a
                  href="/Resume.pdf"
                  className="portfolio-btn portfolio-btn-secondary futuristic-btn-outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume <i className="bi bi-download" />
                </a>
              </motion.div>
            </div>

            <motion.div
              className="portfolio-visual"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 18 }}
              animate={shouldReduceMotion ? false : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE_OUT_EXPO }}
            >
              <div className="profile-card futuristic-profile-card">
                <div className="profile-ring futuristic-profile-ring">
                  <img src={image} alt="Basudeb Bej profile" />
                </div>

                <div className="profile-meta">
                  <span className="meta-chip">Basudeb Bej</span>
                  <h2>Full-Stack Developer</h2>
                  {/* <p>
                    i am basudeb bej, a full-stack developer with a passion for
                    creating interactive websites that strike the perfect balance
                    between design, usability, and performance.
                  </p> */}
                  <p>
                    I’m Basudeb Bej, a full-stack developer building high-performance interactive websites.
                  </p>
                </div>
              </div>

              <motion.div
                className="floating-tag one"
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              >
                React + UI
              </motion.div>
              <motion.div
                className="floating-tag two"
                animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                Node + APIs
              </motion.div>
              <motion.div
                className="floating-tag three"
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                Database + Cloud
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;