"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/** Bọc 1 card để nó nghiêng nhẹ theo vị trí con trỏ (hiệu ứng "magnetic tilt"). */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const rotateX = gsap.quickTo(inner, "rotateX", { duration: 0.4, ease: "power3.out" });
      const rotateY = gsap.quickTo(inner, "rotateY", { duration: 0.4, ease: "power3.out" });
      const scale = gsap.quickTo(inner, "scale", { duration: 0.4, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = outer.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY(px * 14);
        rotateX(-py * 14);
      };
      const onEnter = () => scale(1.03);
      const onLeave = () => {
        scale(1);
        rotateX(0);
        rotateY(0);
      };

      outer.addEventListener("pointermove", onMove);
      outer.addEventListener("pointerenter", onEnter);
      outer.addEventListener("pointerleave", onLeave);

      return () => {
        outer.removeEventListener("pointermove", onMove);
        outer.removeEventListener("pointerenter", onEnter);
        outer.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: outerRef }
  );

  return (
    <div ref={outerRef} className={className} style={{ perspective: 800 }}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
