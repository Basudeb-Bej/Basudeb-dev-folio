// front-end/src/components/AnimatedBackground.jsx
import { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let animationFrameId;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    // Smooth mouse tracking with inertia
    const pointer = {
      targetX: width * 0.5,
      targetY: height * 0.35,
      x: width * 0.5,
      y: height * 0.35,
      active: false,
    };

    const onPointerMove = (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        pointer.targetX = e.touches[0].clientX;
        pointer.targetY = e.touches[0].clientY;
        pointer.active = true;
      }
    };

    window.addEventListener("resize", setCanvasSize, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onPointerLeave, { passive: true });

    // Adaptive particle density based on viewport area (mobile-friendly)
    const getNodeCounts = () => {
      const area = width * height;
      if (width < 480) return { back: 14, front: 22, linkDist: 105 };
      if (width < 992) return { back: 22, front: 36, linkDist: 130 };
      const scale = Math.min(1.35, area / (1440 * 900));
      return {
        back: Math.round(28 * scale),
        front: Math.round(48 * scale),
        linkDist: 155,
      };
    };

    const paletteDark = [
      { r: 56, g: 189, b: 248 },  // Electric Sky Blue
      { r: 34, g: 211, b: 238 },  // Cyber Cyan
      { r: 192, g: 132, b: 252 }, // Neon Violet
      { r: 129, g: 140, b: 248 }, // Indigo Glow
    ];

    const paletteLight = [
      { r: 2, g: 132, b: 199 },   // Deep Sky Blue
      { r: 14, g: 165, b: 233 },  // Crisp Cyan
      { r: 124, g: 58, b: 237 },  // Royal Purple
    ];

    const createNodes = (count, depth) =>
      Array.from({ length: count }, (_, idx) => {
        const speedBase = depth === 1 ? 0.14 : 0.32;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedBase * 2,
          vy: (Math.random() - 0.5) * speedBase * 2,
          baseRadius: depth === 1 ? Math.random() * 1.1 + 0.6 : Math.random() * 1.9 + 1.1,
          pulseOffset: Math.random() * Math.PI * 2,
          colorIdx: idx % paletteDark.length,
          depth,
        };
      });

    let { back, front, linkDist } = getNodeCounts();
    let backNodes = createNodes(back, 1);
    let frontNodes = createNodes(front, 2);

    let resizeDebounce;
    const handleResponsiveRebuild = () => {
      window.clearTimeout(resizeDebounce);
      resizeDebounce = window.setTimeout(() => {
        const next = getNodeCounts();
        linkDist = next.linkDist;
        backNodes = createNodes(next.back, 1);
        frontNodes = createNodes(next.front, 2);
      }, 220);
    };
    window.addEventListener("resize", handleResponsiveRebuild, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const isLight = document.body.classList.contains("light");
      const palette = isLight ? paletteLight : paletteDark;

      // Smoothly interpolate pointer coordinates
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      // 1. Atmospheric Cursor Spotlight Bloom
      if (pointer.active) {
        const bloomRadius = width < 768 ? 220 : 340;
        const grad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          bloomRadius
        );
        if (isLight) {
          grad.addColorStop(0, "rgba(14, 165, 233, 0.09)");
          grad.addColorStop(0.5, "rgba(124, 58, 237, 0.04)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else {
          grad.addColorStop(0, "rgba(56, 189, 248, 0.14)");
          grad.addColorStop(0.45, "rgba(192, 132, 252, 0.07)");
          grad.addColorStop(1, "rgba(4, 11, 24, 0)");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Helper to update & render each depth layer
      const drawLayer = (nodes, isForeground) => {
        const maxDist = isForeground ? linkDist : linkDist * 0.85;
        const parallaxX = pointer.active ? (pointer.x - width * 0.5) * (isForeground ? 0.015 : 0.006) : 0;
        const parallaxY = pointer.active ? (pointer.y - height * 0.5) * (isForeground ? 0.015 : 0.006) : 0;

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          // Seamless wrap-around at viewport edges
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;

          // Gentle interactive magnetic drift near pointer
          if (pointer.active && isForeground) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 180 && dist > 1) {
              const force = (1 - dist / 180) * 0.018;
              n.x += dx * force;
              n.y += dy * force;
            }
          }

          const drawX = n.x + parallaxX;
          const drawY = n.y + parallaxY;
          const c = palette[n.colorIdx % palette.length];
          const pulse = 0.78 + Math.sin(time * 2.1 + n.pulseOffset) * 0.22;

          // Neural synaptic connections
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const drawX2 = n2.x + parallaxX;
            const drawY2 = n2.y + parallaxY;
            const dx = drawX - drawX2;
            const dy = drawY - drawY2;
            const dist = Math.hypot(dx, dy);

            if (dist < maxDist) {
              const alpha =
                (1 - dist / maxDist) *
                (isForeground ? (isLight ? 0.22 : 0.3) : isLight ? 0.09 : 0.13);

              const lineGrad = ctx.createLinearGradient(drawX, drawY, drawX2, drawY2);
              const c2 = palette[n2.colorIdx % palette.length];
              lineGrad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`);
              lineGrad.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${alpha})`);

              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(drawX2, drawY2);
              ctx.strokeStyle = lineGrad;
              ctx.lineWidth = isForeground ? 1.05 : 0.65;
              ctx.stroke();
            }
          }

          // Connect foreground nodes directly to pointer for interactive neural feedback
          if (pointer.active && isForeground) {
            const pdx = drawX - pointer.x;
            const pdy = drawY - pointer.y;
            const pDist = Math.hypot(pdx, pdy);
            if (pDist < 175) {
              const pAlpha = (1 - pDist / 175) * (isLight ? 0.32 : 0.45);
              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(pointer.x, pointer.y);
              ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${pAlpha})`;
              ctx.lineWidth = 1.15;
              ctx.stroke();
            }
          }

          // Glowing outer node halo (foreground nodes)
          if (isForeground) {
            const haloRadius = n.baseRadius * 4.5 * pulse;
            const halo = ctx.createRadialGradient(
              drawX,
              drawY,
              0,
              drawX,
              drawY,
              haloRadius
            );
            halo.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${isLight ? 0.28 : 0.42})`);
            halo.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
            ctx.beginPath();
            ctx.arc(drawX, drawY, haloRadius, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();
          }

          // Crisp core node
          ctx.beginPath();
          ctx.arc(drawX, drawY, n.baseRadius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${
            isForeground ? (isLight ? 0.78 : 0.92) : 0.42
          })`;
          ctx.fill();
        }
      };

      drawLayer(backNodes, false);
      drawLayer(frontNodes, true);

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(resizeDebounce);
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("resize", handleResponsiveRebuild);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onPointerLeave);
    };
  }, []);

  return (
    <div className="neural-bg-stage" aria-hidden="true">
      <div className="neural-bg-aurora neural-bg-aurora-1" />
      <div className="neural-bg-aurora neural-bg-aurora-2" />
      <div className="neural-bg-aurora neural-bg-aurora-3" />
      <div className="neural-bg-grid" />
      <canvas ref={canvasRef} className="neural-bg-canvas" />
      <div className="neural-bg-vignette" />
    </div>
  );
};

export default AnimatedBackground;