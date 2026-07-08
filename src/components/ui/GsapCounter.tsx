"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function GsapCounter({ value, prefix = "", suffix = "", duration = 2 }: Props) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const counterObj = { count: 0 };

    const anim = gsap.to(counterObj, {
      count: value,
      duration: duration,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (el) el.innerText = Math.floor(counterObj.count).toLocaleString();
      },
    });

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}
      <span ref={elementRef}>0</span>
      {suffix}
    </span>
  );
}
