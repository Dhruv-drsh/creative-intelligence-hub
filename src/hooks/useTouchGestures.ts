import { useEffect, useRef, useCallback } from "react";
import type { Canvas as FabricCanvas } from "fabric";

interface TouchGesturesOptions {
  canvas: FabricCanvas | null;
  containerRef: React.RefObject<HTMLDivElement>;
  onZoomChange: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export function useTouchGestures({
  canvas,
  containerRef,
  onZoomChange,
  minZoom = 50,
  maxZoom = 200,
}: TouchGesturesOptions) {
  const initialDistance = useRef<number | null>(null);
  const initialZoom = useRef<number>(100);
  const lastTouchEnd = useRef<number>(0);

  const getDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialDistance.current = getDistance(e.touches);
      initialZoom.current = canvas?.getZoom() ? canvas.getZoom() * 100 : 100;
    }
  }, [canvas, getDistance]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance.current;
      const newZoom = Math.min(maxZoom, Math.max(minZoom, initialZoom.current * scale));
      onZoomChange(Math.round(newZoom));
    }
  }, [getDistance, maxZoom, minZoom, onZoomChange]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      initialDistance.current = null;
    }
    
    // Prevent double-tap zoom on mobile
    const now = Date.now();
    if (now - lastTouchEnd.current < 300) {
      e.preventDefault();
    }
    lastTouchEnd.current = now;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isPinching: initialDistance.current !== null,
  };
}
