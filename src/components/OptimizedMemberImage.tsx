"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

type OptimizedMemberImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

const ALLOWED_REMOTE_HOSTS = [
  "images.unsplash.com",
  "www.lpsvidhyawadi.com",
  "lpsvidhyawadi.com",
  "www.lpsvidyawadi.com",
  "lpsvidyawadi.com",
  "img.youtube.com",
  "res.cloudinary.com",
  "cdn.pixabay.com",
];

export default function OptimizedMemberImage({
  src,
  alt,
  className = "w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500",
  fallbackLabel = "LPS Staff Member",
  fill = true,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority = false,
}: OptimizedMemberImageProps) {
  const [imageError, setImageError] = useState(false);
  const [finalFallback, setFinalFallback] = useState(false);

  // Clean and trim src string if provided
  const cleanedSrc = src?.trim();

  // If no image provided or both Next Image & native img failed, render fallback avatar badge
  if (!cleanedSrc || finalFallback) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-primary/40 p-4 space-y-2 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary/50 shadow-inner group-hover:scale-110 transition-transform">
          <User size={36} strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70 font-montserrat">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  // If Next.js <Image> failed, fallback to native <img> tag so uploaded image still displays
  if (imageError) {
    return (
      <img
        src={cleanedSrc}
        alt={alt}
        className={className}
        onError={() => setFinalFallback(true)}
      />
    );
  }

  // Check if image is local upload or external URL and whether domain is in allowed patterns
  let isUnoptimized = false;
  if (
    cleanedSrc.startsWith("/uploads/") ||
    cleanedSrc.startsWith("uploads/") ||
    cleanedSrc.includes("/uploads/")
  ) {
    isUnoptimized = true;
  } else {
    try {
      if (cleanedSrc.startsWith("http://") || cleanedSrc.startsWith("https://")) {
        const url = new URL(cleanedSrc);
        if (!ALLOWED_REMOTE_HOSTS.includes(url.hostname)) {
          isUnoptimized = true;
        }
      }
    } catch {
      isUnoptimized = true;
    }
  }

  if (fill) {
    return (
      <Image
        src={cleanedSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        quality={85}
        priority={priority}
        unoptimized={isUnoptimized}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Image
      src={cleanedSrc}
      alt={alt}
      width={width ?? 200}
      height={height ?? 200}
      quality={85}
      priority={priority}
      unoptimized={isUnoptimized}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
