"use client";
import { RefObject, useEffect } from "react";

export const useOutsideClick = (ref: RefObject<HTMLElement | null>, callback: () => void, isActive: boolean) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.target &&
        ref?.current &&
        event.target instanceof Node &&
        !ref?.current.contains(event.target) &&
        isActive
      ) {
        callback();
      }
    };
    if (isActive && ref?.current) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, isActive, callback]);
};
