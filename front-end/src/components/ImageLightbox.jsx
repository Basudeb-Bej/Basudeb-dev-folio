// front-end/src/components/ImageLightbox.jsx
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.4;

const ImageLightbox = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const pinchState = useRef({ pinching: false, startDistance: 0, startScale: 1 });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const clampScale = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const zoomIn = () => setScale((current) => clampScale(current + SCALE_STEP));

  const zoomOut = () => {
    setScale((current) => {
      const next = clampScale(current - SCALE_STEP);
      if (next === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -SCALE_STEP / 2 : SCALE_STEP / 2;
    setScale((current) => {
      const next = clampScale(current + delta);
      if (next === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleMouseDown = (event) => {
    if (scale === MIN_SCALE) {
      return;
    }

    dragState.current = {
      dragging: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handleMouseMove = (event) => {
    if (!dragState.current.dragging) {
      return;
    }

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    setPosition({
      x: dragState.current.originX + deltaX,
      y: dragState.current.originY + deltaY,
    });
  };

  const stopDragging = () => {
    dragState.current.dragging = false;
  };

  const getTouchDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      pinchState.current = {
        pinching: true,
        startDistance: getTouchDistance(event.touches),
        startScale: scale,
      };
    } else if (event.touches.length === 1 && scale > MIN_SCALE) {
      dragState.current = {
        dragging: true,
        startX: event.touches[0].clientX,
        startY: event.touches[0].clientY,
        originX: position.x,
        originY: position.y,
      };
    }
  };

  const handleTouchMove = (event) => {
    if (pinchState.current.pinching && event.touches.length === 2) {
      event.preventDefault();
      const currentDistance = getTouchDistance(event.touches);
      const ratio = currentDistance / pinchState.current.startDistance;
      const next = clampScale(pinchState.current.startScale * ratio);
      setScale(next);
      if (next === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return;
    }

    if (dragState.current.dragging && event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - dragState.current.startX;
      const deltaY = event.touches[0].clientY - dragState.current.startY;
      setPosition({
        x: dragState.current.originX + deltaX,
        y: dragState.current.originY + deltaY,
      });
    }
  };

  const handleTouchEnd = () => {
    pinchState.current.pinching = false;
    dragState.current.dragging = false;
  };

  const preventContextMenu = (event) => {
    event.preventDefault();
  };

  const preventDragStart = (event) => {
    event.preventDefault();
  };

  const lightboxUi = (
    <div
      className="image-lightbox-overlay"
      onClick={onClose}
      onContextMenu={preventContextMenu}
    >
      <div className="image-lightbox-toolbar" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="image-lightbox-btn" onClick={zoomOut} aria-label="Zoom out" disabled={scale === MIN_SCALE}>
          <i className="bi bi-dash-lg" />
        </button>
        <span className="image-lightbox-scale">{Math.round(scale * 100)}%</span>
        <button type="button" className="image-lightbox-btn" onClick={zoomIn} aria-label="Zoom in" disabled={scale === MAX_SCALE}>
          <i className="bi bi-plus-lg" />
        </button>
        <button type="button" className="image-lightbox-btn" onClick={resetZoom} aria-label="Reset zoom">
          <i className="bi bi-aspect-ratio" />
        </button>
        <button type="button" className="image-lightbox-btn image-lightbox-close" onClick={onClose} aria-label="Close preview">
          <i className="bi bi-x-lg" />
        </button>
      </div>

      <div
        className="image-lightbox-stage"
        onClick={(event) => event.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={src}
          alt={alt}
          className="image-lightbox-img"
          draggable={false}
          onDragStart={preventDragStart}
          onContextMenu={preventContextMenu}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > MIN_SCALE ? "grab" : "default",
          }}
        />
      </div>

      <p className="image-lightbox-hint">Scroll or pinch to zoom · Drag to pan · Esc to close</p>
    </div>
  );

  if (typeof document === "undefined") {
    return lightboxUi;
  }

  return createPortal(lightboxUi, document.body);
};

export default ImageLightbox;