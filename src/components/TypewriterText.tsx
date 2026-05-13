import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** ms before typing starts (after fade-in) */
  startDelay?: number;
  /** Show blinking cursor */
  cursor?: boolean;
  /** Keep cursor blinking after typing finishes */
  keepCursor?: boolean;
  /** Wrapper element — defaults to span */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Only start when scrolled into view */
  triggerOnView?: boolean;
}

/**
 * Pops/fades in, then types letter-by-letter. Reserves space for the full
 * string so no layout shift occurs while typing.
 */
export function TypewriterText({
  text,
  speed = 28,
  startDelay = 120,
  cursor = true,
  keepCursor = false,
  as = "span",
  className,
  triggerOnView = true,
}: TypewriterTextProps) {
  const Tag = as as any;
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [shouldType, setShouldType] = useState(!triggerOnView);
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (triggerOnView && inView) setShouldType(true);
  }, [inView, triggerOnView]);

  useEffect(() => {
    if (!shouldType) return;
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setCount((c) => {
          if (c >= text.length) { window.clearInterval(id); return c; }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => window.clearTimeout(start);
  }, [shouldType, text, speed, startDelay]);

  return (
    <Tag
      ref={ref as any}
      className={cn("relative inline-block align-baseline", className)}
      aria-label={text}
    >
      {/* Invisible spacer to reserve full layout */}
      <span aria-hidden className="invisible whitespace-pre-wrap">
        {text}
      </span>
      {/* Typed overlay */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
        animate={shouldType ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute inset-0 whitespace-pre-wrap"
      >
        {text.slice(0, count)}
        {cursor && (!done || keepCursor) && (
          <span
            className="inline-block w-[2px] h-[0.95em] -mb-[0.1em] ml-[1px] bg-current align-middle animate-pulse"
            style={{ animationDuration: "1s" }}
          />
        )}
      </motion.span>
    </Tag>
  );
}

export default TypewriterText;
