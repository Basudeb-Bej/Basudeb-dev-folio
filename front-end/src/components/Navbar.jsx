// front-end/src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import image from "../assets/img/image1.png";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isHidden, setIsHidden] = useState(false);
  const [isSidebar, setIsSidebar] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const closeNavbar = () => {
    setIsExpanded(false);
  };

  const toggleNavigationMode = () => {
    setIsSidebar(!isSidebar);
    setIsExpanded(false);
  };

  // Helper to apply theme to body and root html tag
  const applyTheme = (currentTheme) => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const savedMode = localStorage.getItem("navigationMode") || "navbar";
    setIsSidebar(savedMode === "sidebar");
  }, []);

  useEffect(() => {
    localStorage.setItem("navigationMode", isSidebar ? "sidebar" : "navbar");

    if (isSidebar) {
      document.body.classList.add("sidebar-active");
    } else {
      document.body.classList.remove("sidebar-active");
    }
  }, [isSidebar]);

  // Scroll behavior only for navbar mode
  useEffect(() => {
    if (isSidebar) {
      setIsHidden(false);
      return;
    }

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setIsHidden(false);
      } else if (currentScrollY > lastScrollY.current + 6) {
        setIsHidden(true);
        setIsExpanded(false);
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSidebar]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Navigation links data
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Education", path: "/education" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  // Helper to dynamically check if link is active
  const isLinkActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Navigation links component
  const NavLinks = ({ isSidebarMode = false }) => (
    <ul className={`navbar-nav ${isSidebarMode ? "flex-column w-100 sidebar-nav" : "align-items-center"}`}>
      {/* Theme Toggle */}
      <li className={`nav-item ${isSidebarMode ? "mb-3 w-100" : "ms-3 ms-lg-4"}`}>
        <button
          type="button"
          className={`theme-toggle-btn ${isSidebarMode ? "w-100" : ""}`}
          onClick={toggleTheme}
          title="Dark/Light Theme"
        >
          {theme === "light" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="theme-toggle-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
              {isSidebarMode && <span>Dark Mode</span>}
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="theme-toggle-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
              {isSidebarMode && <span>Light Mode</span>}
            </>
          )}
        </button>
      </li>

      {navLinks.map((link) => {
        const isActive = isLinkActive(link.path);
        return (
          <li key={link.name} className={`nav-item ${isSidebarMode ? "mb-2 w-100" : "ms-3 ms-lg-4"}`}>
            <Link
              className={`nav-link fw-bold ${isActive ? "active" : ""}`}
              to={link.path}
              onClick={closeNavbar}
            >
              {isSidebarMode && <span className="nav-link-icon">✦</span>}
              {link.name}
              {isSidebarMode && isActive && (
                <span className="nav-link-indicator"></span>
              )}
            </Link>
          </li>
        );
      })}

      {/* Toggle mode button (adapted for light & dark mode contrast) */}
      <li className={`nav-item ${isSidebarMode ? "mt-3 pt-3 w-100 toggle-mode-btn" : "ms-3 ms-lg-4"}`}>
        <button
          type="button"
          className={`btn w-100 ${
            isSidebarMode
              ? theme === "light"
                ? "btn-outline-dark"
                : "btn-outline-light"
              : "btn-outline-primary"
          }`}
          onClick={toggleNavigationMode}
          title={isSidebarMode ? "Switch to Navbar" : "Switch to Sidebar"}
        >
          {isSidebarMode ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-expand me-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8.5 10.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L8.5 14.293V10.5z" />
              </svg>
              Navbar
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-layout-sidebar me-1" viewBox="0 0 16 16">
                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm1 0v14h4V1H1zm14 0H5v14h10V1z" />
              </svg>
            </>
          )}
        </button>
      </li>
    </ul>
  );

  if (isSidebar) {
    return (
      <>
        {!isExpanded ? (
          <button
            type="button"
            className="sidebar-toggle-fab"
            onClick={() => setIsExpanded(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list" />
          </button>
        ) : null}

        <nav
          className={`sidebar ${isExpanded ? "sidebar-open" : "sidebar-collapsed"} ${
            theme === "light" ? "sidebar-light" : "sidebar-dark"
          }`}
        >
          <div className="sidebar-header">
            <div className="sidebar-header-row">
              <Link className="sidebar-brand" to="/" onClick={closeNavbar}>
                <div className="sidebar-brand-icon">
                  <img src={image} alt="Logo" className="sidebar-brand-logo" />
                </div>
                <div className="sidebar-brand-text">
                  <span className="sidebar-brand-title">Basudeb Bej</span>
                  <span className="sidebar-brand-subtitle">Full-Stack Developer</span>
                </div>
              </Link>

              <button
                type="button"
                className="sidebar-close-btn"
                onClick={() => setIsExpanded(false)}
                aria-label="Close menu"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          <div className="sidebar-body">
            <div className="sidebar-nav-wrapper">
              <NavLinks isSidebarMode={true} />
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-footer-content">
              <span className="sidebar-footer-text">FULL-STACK DEVELOPER</span>
              <div className="sidebar-footer-icons">
                <span className="sidebar-footer-icon">✦</span>
                <span className="sidebar-footer-icon">✦</span>
                <span className="sidebar-footer-icon">✦</span>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm fixed-top w-100 py-2 navbar-scroll ${
        isHidden ? "navbar-scroll-hidden" : ""
      } ${theme === "light" ? "navbar-light bg-white" : "navbar-dark bg-dark"}`}
      style={{
        borderRadius: "50px",
        margin: "16px auto",
        left: "0",
        right: "0",
        maxWidth: "min(1180px, calc(100vw - 24px))",
        zIndex: 1030,
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand navbar-brand-stack fw-bold d-flex align-items-center"
          to="/"
          onClick={closeNavbar}
          style={{ letterSpacing: "1px", textDecoration: "none" }}
        >
          <img
            src={image}
            alt="Logo"
            style={{
              height: "40px",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          />
          <span className="navbar-brand-copy">
            <span className="navbar-brand-title">Basudeb Bej</span>
            <span className="navbar-brand-subtitle">Full-Stack Developer</span>
          </span>
        </Link>

        <button className="navbar-toggler" type="button" onClick={handleToggle}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${isExpanded ? "show" : ""}`}>
          <NavLinks isSidebarMode={false} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





// // front-end/src/components/Navbar.jsx
// import { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom"; // <-- Added useLocation
// import image from "../assets/img/image1.png";

// const Navbar = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [theme, setTheme] = useState("light");
//   const [isHidden, setIsHidden] = useState(false);
//   const [isSidebar, setIsSidebar] = useState(false);
//   const location = useLocation(); // <-- Get the current route automatically
//   const lastScrollY = useRef(0);

//   const handleToggle = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const closeNavbar = () => {
//     setIsExpanded(false);
//   };

//   const toggleNavigationMode = () => {
//     setIsSidebar(!isSidebar);
//     setIsExpanded(false);
//   };

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.body.classList.remove("light", "dark");
//     document.body.classList.add(savedTheme);

//     const savedMode = localStorage.getItem("navigationMode") || "navbar";
//     setIsSidebar(savedMode === "sidebar");
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("navigationMode", isSidebar ? "sidebar" : "navbar");

//     if (isSidebar) {
//       document.body.classList.add("sidebar-active");
//     } else {
//       document.body.classList.remove("sidebar-active");
//     }
//   }, [isSidebar]);

//   // Scroll behavior only for navbar mode
//   useEffect(() => {
//     if (isSidebar) {
//       setIsHidden(false);
//       return;
//     }

//     lastScrollY.current = window.scrollY;

//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY < 80) {
//         setIsHidden(false);
//       } else if (currentScrollY > lastScrollY.current + 6) {
//         setIsHidden(true);
//         setIsExpanded(false);
//       } else if (currentScrollY < lastScrollY.current - 6) {
//         setIsHidden(false);
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isSidebar]);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     document.body.classList.remove("light", "dark");
//     document.body.classList.add(newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   // Navigation links data
//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Education", path: "/education" },
//     { name: "Skills", path: "/skills" },
//     { name: "Projects", path: "/projects" },
//     { name: "Contact", path: "/contact" },
//   ];

//   // Helper to dynamically check if link is active
//   const isLinkActive = (path) => {
//     if (path === "/") {
//       return location.pathname === "/";
//     }
//     return location.pathname === path || location.pathname.startsWith(path + "/");
//   };

//   // Navigation links component
//   const NavLinks = ({ isSidebarMode = false }) => (
//     <ul className={`navbar-nav ${isSidebarMode ? "flex-column w-100 sidebar-nav" : "align-items-center"}`}>
//       {/* Theme Toggle */}
//       <li className={`nav-item ${isSidebarMode ? "mb-3 w-100" : "ms-3 ms-lg-4"}`}>
//         <button
//           type="button"
//           className={`theme-toggle-btn ${isSidebarMode ? "w-100" : ""}`}
//           onClick={toggleTheme}
//           title="Dark/Light Theme"
//         >
//           {theme === "light" ? (
//             <>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="theme-toggle-icon"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
//                 />
//               </svg>
//               {isSidebarMode && <span>Dark Mode</span>}
//             </>
//           ) : (
//             <>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="theme-toggle-icon"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
//                 />
//               </svg>
//               {isSidebarMode && <span>Light Mode</span>}
//             </>
//           )}
//         </button>
//       </li>

//       {navLinks.map((link) => {
//         const isActive = isLinkActive(link.path);
//         return (
//           <li key={link.name} className={`nav-item ${isSidebarMode ? "mb-2 w-100" : "ms-3 ms-lg-4"}`}>
//             <Link
//               className={`nav-link fw-bold ${isActive ? "active" : ""}`}
//               to={link.path}
//               onClick={closeNavbar}
//             >
//               {isSidebarMode && <span className="nav-link-icon">✦</span>}
//               {link.name}
//               {isSidebarMode && isActive && (
//                 <span className="nav-link-indicator"></span>
//               )}
//             </Link>
//           </li>
//         );
//       })}

//       {/* Toggle mode button */}
//       <li className={`nav-item ${isSidebarMode ? "mt-3 pt-3 w-100 toggle-mode-btn" : "ms-3 ms-lg-4"}`}>
//         <button
//           type="button"
//           className={`btn ${isSidebarMode ? "btn-outline-light w-100" : "btn-outline-primary"}`}
//           onClick={toggleNavigationMode}
//           title={isSidebarMode ? "Switch to Navbar" : "Switch to Sidebar"}
//         >
//           {isSidebarMode ? (
//             <>
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-expand me-1" viewBox="0 0 16 16">
//                 <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8.5 10.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L8.5 14.293V10.5z" />
//               </svg>
//               Navbar
//             </>
//           ) : (
//             <>
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-layout-sidebar me-1" viewBox="0 0 16 16">
//                 <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm1 0v14h4V1H1zm14 0H5v14h10V1z" />
//               </svg>
//             </>
//           )}
//         </button>
//       </li>
//     </ul>
//   );

//   if (isSidebar) {
//     return (
//       <>
//         {!isExpanded ? (
//           <button
//             type="button"
//             className="sidebar-toggle-fab"
//             onClick={() => setIsExpanded(true)}
//             aria-label="Open menu"
//           >
//             <i className="bi bi-list" />
//           </button>
//         ) : null}

//         <nav
//           className={`sidebar ${isExpanded ? "sidebar-open" : "sidebar-collapsed"} ${
//             theme === "light" ? "sidebar-light" : "sidebar-dark"
//           }`}
//         >
//           <div className="sidebar-header">
//             <div className="sidebar-header-row">
//               <Link className="sidebar-brand" to="/" onClick={closeNavbar}>
//                 <div className="sidebar-brand-icon">
//                   <img src={image} alt="Logo" className="sidebar-brand-logo" />
//                 </div>
//                 <div className="sidebar-brand-text">
//                   <span className="sidebar-brand-title">Basudeb Bej</span>
//                   <span className="sidebar-brand-subtitle">Full-Stack Developer</span>
//                 </div>
//               </Link>

//               <button
//                 type="button"
//                 className="sidebar-close-btn"
//                 onClick={() => setIsExpanded(false)}
//                 aria-label="Close menu"
//               >
//                 <i className="bi bi-x-lg" />
//               </button>
//             </div>
//           </div>

//           <div className="sidebar-body">
//             <div className="sidebar-nav-wrapper">
//               <NavLinks isSidebarMode={true} />
//             </div>
//           </div>

//           <div className="sidebar-footer">
//             <div className="sidebar-footer-content">
//               <span className="sidebar-footer-text">FULL-STACK DEVELOPER</span>
//               <div className="sidebar-footer-icons">
//                 <span className="sidebar-footer-icon">✦</span>
//                 <span className="sidebar-footer-icon">✦</span>
//                 <span className="sidebar-footer-icon">✦</span>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </>
//     );
//   }

//   return (
//     <nav
//       className={`navbar navbar-expand-lg shadow-sm fixed-top w-100 py-2 navbar-scroll ${
//         isHidden ? "navbar-scroll-hidden" : ""
//       } ${theme === "light" ? "navbar-light bg-white" : "navbar-dark bg-dark"}`}
//       style={{
//         borderRadius: "50px",
//         margin: "16px auto",
//         left: "0",
//         right: "0",
//         maxWidth: "min(1180px, calc(100vw - 24px))",
//         zIndex: 1030,
//       }}
//     >
//       <div className="container">
//         <Link
//           className="navbar-brand navbar-brand-stack fw-bold d-flex align-items-center"
//           to="/"
//           onClick={closeNavbar}
//           style={{ letterSpacing: "1px", textDecoration: "none" }}
//         >
//           <img
//             src={image}
//             alt="Logo"
//             style={{
//               height: "40px",
//               marginRight: "10px",
//               borderRadius: "50%",
//             }}
//           />
//           <span className="navbar-brand-copy">
//             <span className="navbar-brand-title">Basudeb Bej</span>
//             <span className="navbar-brand-subtitle">Full-Stack Developer</span>
//           </span>
//         </Link>

//         <button className="navbar-toggler" type="button" onClick={handleToggle}>
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className={`collapse navbar-collapse justify-content-end ${isExpanded ? "show" : ""}`}>
//           <NavLinks isSidebarMode={false} />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


