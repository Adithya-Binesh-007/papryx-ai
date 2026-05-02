interface Props { className?: string; color?: "blue" | "violet" | "cyan"; size?: number }
const colors = {
  blue: "hsl(217 91% 60% / 0.5)",
  violet: "hsl(265 89% 66% / 0.5)",
  cyan: "hsl(190 95% 55% / 0.5)",
};
export const GlowOrb = ({ className = "", color = "blue", size = 400 }: Props) => (
  <div
    className={`glow-orb animate-pulse-glow ${className}`}
    style={{ width: size, height: size, background: colors[color] }}
    aria-hidden
  />
);
