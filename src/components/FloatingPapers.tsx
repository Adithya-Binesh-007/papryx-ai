import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const PAPERS = [
  { left: "6%", top: "12%", size: 120, delay: 0, dur: 14, rot: -8 },
  { left: "82%", top: "18%", size: 90, delay: 1.2, dur: 16, rot: 10 },
  { left: "14%", top: "70%", size: 100, delay: 0.6, dur: 18, rot: 6 },
  { left: "78%", top: "62%", size: 130, delay: 2, dur: 20, rot: -12 },
  { left: "46%", top: "85%", size: 80, delay: 1.5, dur: 15, rot: 4 },
];

/**
 * Subtle, decorative floating paper cards. Pointer-events disabled so they
 * never interfere with content. Hidden on small screens to keep the hero
 * uncluttered on phones.
 */
export function FloatingPapers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block" aria-hidden>
      {PAPERS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.left, top: p.top }}
          initial={{ opacity: 0, y: 20, rotate: p.rot }}
          animate={{
            opacity: [0, 0.55, 0.55, 0],
            y: [20, -20, -10, 20],
            rotate: [p.rot, p.rot + 4, p.rot - 2, p.rot],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="rounded-xl glass border border-border/40 backdrop-blur-md flex flex-col gap-1.5 p-3"
            style={{ width: p.size, height: p.size * 1.3 }}
          >
            <FileText className="h-4 w-4 text-primary/70" />
            <div className="h-1.5 w-3/4 rounded-full bg-foreground/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-foreground/10" />
            <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
            <div className="mt-auto h-1.5 w-1/3 rounded-full bg-primary/30" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingPapers;
