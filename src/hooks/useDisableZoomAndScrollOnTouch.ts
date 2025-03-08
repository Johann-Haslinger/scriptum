"use client";
import { useEffect } from "react";

export const useDisableZoomAndScrollOnTouch = () => {
  useEffect(() => {
    const preventZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    const preventScroll = (event: TouchEvent) => {
      const target = event.target as HTMLElement;

      if (target && target.closest('[data-scrollable="true"]')) {
        return;
      }
      event.preventDefault();
    };

    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);
};
