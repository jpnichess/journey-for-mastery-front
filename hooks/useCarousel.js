import { useState, useRef, useCallback } from "react";

export function useCarousel() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const itemWidth = containerRef.current.clientWidth;
    const index = Math.round(scrollLeft / itemWidth);
    setCurrent(index);
  }, []);

  return { current, setCurrent, containerRef, handleScroll };
}