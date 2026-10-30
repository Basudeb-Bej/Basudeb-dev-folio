import { useEffect, useRef } from "react";

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ringTimeout = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const updateCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (dot) {
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      if (ring) {
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }
      
      requestAnimationFrame(animateRing);
    };

    const handleMouseDown = () => {
      if (ring) {
        ring.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px) scale(0.8)`;
        ring.style.borderColor = "rgba(56, 189, 248, 0.9)";
      }
      if (dot) {
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1.5)`;
      }
    };

    const handleMouseUp = () => {
      if (ring) {
        ring.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px) scale(1)`;
        ring.style.borderColor = "rgba(56, 189, 248, 0.5)";
      }
      if (dot) {
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`;
      }
    };

    const handleLinkHover = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".clickable")
      ) {
        if (dot) dot.classList.add("hover");
        if (ring) ring.classList.add("hover");
      } else {
        if (dot) dot.classList.remove("hover");
        if (ring) ring.classList.remove("hover");
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleLinkHover);
    
    // Start ring animation
    animateRing();

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleLinkHover);
      if (ringTimeout.current) {
        cancelAnimationFrame(ringTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default Cursor;