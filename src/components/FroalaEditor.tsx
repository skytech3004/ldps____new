"use client";

import React, { useEffect, useRef, useState } from "react";

interface FroalaEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const loadCSS = (url: string) => {
  if (typeof window === "undefined") return;
  if (document.querySelector(`link[href="${url}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
};

const loadScript = (url: string, callback: () => void) => {
  if (typeof window === "undefined") return;
  const existing = document.querySelector(`script[src="${url}"]`);
  if (existing) {
    if ((window as any).FroalaEditor) {
      callback();
    } else {
      existing.addEventListener("load", callback);
    }
    return;
  }
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
};

export default function FroalaEditor({ value, onChange, placeholder }: FroalaEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const isInitializingRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Froala CSS files
    loadCSS("https://cdn.jsdelivr.net/npm/froala-editor@4.1.4/css/froala_editor.pkgd.min.css");
    loadCSS("https://cdn.jsdelivr.net/npm/froala-editor@4.1.4/css/froala_style.min.css");

    // Load Froala JS bundle file
    loadScript("https://cdn.jsdelivr.net/npm/froala-editor@4.1.4/js/froala_editor.pkgd.min.js", () => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current || editorRef.current || isInitializingRef.current) return;

    isInitializingRef.current = true;
    const textarea = document.createElement("textarea");
    textarea.value = value;
    containerRef.current.appendChild(textarea);

    try {
      const editor = new (window as any).FroalaEditor(textarea, {
        placeholderText: placeholder || "Write your blog contents here...",
        charCounterCount: true,
        heightMin: 300,
        heightMax: 600,
        events: {
          initialized: function(this: any) {
            editorRef.current = this;
            isInitializingRef.current = false;
          },
          contentChanged: function(this: any) {
            const html = this.html.get();
            onChange(html);
          },
          blur: function(this: any) {
            const html = this.html.get();
            onChange(html);
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize Froala Editor", e);
      isInitializingRef.current = false;
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [loaded]);

  // Synchronize dynamic updates to value from external forms
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.html.get();
      if (currentHtml !== value) {
        editorRef.current.html.set(value || "");
      }
    }
  }, [value]);

  return (
    <div className="w-full text-black bg-white rounded-xl overflow-hidden shadow-inner border border-white/10 p-1">
      {!loaded ? (
        <div className="py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading editor interface...
        </div>
      ) : null}
      <div ref={containerRef} className="w-full text-black" style={{ display: loaded ? "block" : "none" }} />
    </div>
  );
}
