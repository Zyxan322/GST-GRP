import { useRef, type CSSProperties, type ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
  /** lift on hover in px */
  lift?: number;
  glare?: boolean;
  style?: CSSProperties;
};

/**
 * Mouse-tracking 3D tilt wrapper with a moving specular glare.
 * Purely presentational — wrap any card with it.
 */
export function Tilt({
  children,
  className = "",
  max = 10,
  lift = 10,
  glare = true,
  style,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add("tilt-active");
    el.style.transform = `rotateX(${(0.5 - py) * max * 2}deg) rotateY(${(px - 0.5) * max * 2}deg) translateZ(0) translateY(${-lift}px)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, oklch(1 0 0 / 0.16), transparent 60%)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("tilt-active");
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0px)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div className="tilt-perspective" style={style}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`tilt-inner ${className}`}
        style={{ transform: "rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0px)" }}
      >
        {children}
        {glare && (
          <span
            ref={glareRef}
            aria-hidden
            className="tilt-glare"
            style={{
              opacity: 0,
              background:
                "radial-gradient(420px circle at 50% 50%, oklch(1 0 0 / 0.16), transparent 60%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
