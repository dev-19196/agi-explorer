"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** khoảng cách trễ giữa mỗi item con khi stagger */
  stagger?: number;
  /** chọn selector của các item con cần stagger, mặc định lấy mọi children trực tiếp */
  itemSelector?: string;
  y?: number;
}

/**
 * Bọc một section để các phần tử con tự "bay vào" (fade + dịch lên) khi
 * cuộn tới — dùng GSAP + ScrollTrigger, chỉ chạy 1 lần cho mỗi section.
 */
export function ScrollReveal({
  children,
  className,
  stagger = 0.08,
  itemSelector = ":scope > *",
  y = 28,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const items = ref.current.querySelectorAll(itemSelector);
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
