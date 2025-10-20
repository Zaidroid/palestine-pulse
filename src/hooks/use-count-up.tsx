import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

type CounterProps = {
  from: number;
  to: number;
  duration?: number;
};

export function useCountUp({ from, to, duration = 1 }: CounterProps) {
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      }
    });

    return () => controls.stop();
  }, [from, to, duration]);

  return nodeRef;
}