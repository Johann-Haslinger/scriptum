"use client";
import { RefObject, useEffect } from "react";

export const useOutsideClick = (ref: RefObject<HTMLElement | null>, callback: (e: Event) => void, isActive: boolean = true) => {
  const handleClick = (event: MouseEvent) => {
    if (ref?.current && !ref?.current.contains(event.target as Node) && isActive) {
      callback(event);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, isActive, callback]);
};
