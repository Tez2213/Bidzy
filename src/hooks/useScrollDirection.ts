import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [prevOffset, setPrevOffset] = useState(0);

  useEffect(() => {
    const toggleScrollDirection = () => {
      const currentOffset = window.pageYOffset;
      const direction = currentOffset > prevOffset ? "down" : "up";

      if (
        direction !== scrollDirection &&
        (currentOffset - prevOffset > 10 || currentOffset - prevOffset < -10)
      ) {
        setScrollDirection(direction);
      }

      setPrevOffset(currentOffset);
    };

    window.addEventListener("scroll", toggleScrollDirection);

    return () => window.removeEventListener("scroll", toggleScrollDirection);
  }, [scrollDirection, prevOffset]);

  return scrollDirection;
}