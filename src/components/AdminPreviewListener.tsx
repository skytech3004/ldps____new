"use client";

import { useEffect } from "react";

export default function AdminPreviewListener() {
  useEffect(() => {
    // Only execute if page is embedded inside an iframe (Visual CMS Editor)
    if (typeof window === "undefined" || window.self === window.top) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "CMS_SELECT_SECTION") {
        const { sectionId, sectionIndex } = event.data;
        const taggedSections = Array.from(document.querySelectorAll("[data-cms-section-id], [data-section-id]"));
        const sections = taggedSections.length > 0 ? taggedSections : Array.from(document.querySelectorAll("section, [data-section-id], article"));
        let target: Element | null = null;

        if (sectionId) {
          target =
            document.getElementById(sectionId) ||
            document.querySelector(`[data-cms-section-id="${sectionId}"]`) ||
            document.querySelector(`[data-section-id="${sectionId}"]`);
        }
        if (!target && typeof sectionIndex === "number" && sections[sectionIndex]) {
          target = sections[sectionIndex];
        }

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });

          target.classList.add("ring-4", "ring-accent", "ring-offset-4", "transition-all", "duration-500", "shadow-2xl");
          setTimeout(() => {
            target?.classList.remove("ring-4", "ring-accent", "ring-offset-4", "shadow-2xl");
          }, 2500);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Attach click listeners to all page sections
    const taggedSections = Array.from(document.querySelectorAll("[data-cms-section-id], [data-section-id]"));
    const sections = taggedSections.length > 0 ? taggedSections : Array.from(document.querySelectorAll("section, [data-section-id]"));
    sections.forEach((sec, idx) => {
      (sec as HTMLElement).style.cursor = "pointer";
      (sec as HTMLElement).title = "Click section to select in Layout Panel";

      const handleClick = (e: MouseEvent) => {
        const id = sec.getAttribute("data-cms-section-id") || sec.getAttribute("data-section-id") || sec.id || `section-${idx}`;
        const titleText = sec.querySelector("h1, h2, h3, h4")?.textContent?.trim() || `Section ${idx + 1}`;

        window.parent.postMessage(
          {
            type: "CMS_SECTION_CLICKED",
            sectionId: id,
            sectionIndex: idx,
            title: titleText,
          },
          "*"
        );
      };

      sec.addEventListener("click", handleClick as EventListener);
    });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
