"use client";

import React, { useCallback, useEffect, useState } from "react";

interface ScreenAdapterProps {
  designWidth?: number;
  designHeight?: number;
  className?: string;
  children: React.ReactNode;
}

export default function ScreenAdapter({
  designWidth = 1920,
  designHeight = 1080,
  className,
  children,
}: ScreenAdapterProps) {
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const { innerWidth, innerHeight } = window;
    setScale(Math.min(innerWidth / designWidth, innerHeight / designHeight));
  }, [designWidth, designHeight]);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1000px 520px at 50% 12%, rgba(0,242,255,0.13), rgba(0,5,16,0) 58%), radial-gradient(900px 520px at 18% 85%, rgba(181,108,255,0.10), rgba(0,5,16,0) 60%), linear-gradient(180deg, #000510 0%, #000510 50%, #000 100%)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1,
          pointerEvents: "none",
        }}
      >
        {/* moving grid */}
        <div
          style={{
            position: "absolute",
            inset: "-40%",
            backgroundImage:
              "linear-gradient(rgba(0,242,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            transform: "translate3d(0,0,0)",
            animation: "bgGridMove 30s linear infinite",
            maskImage:
              "radial-gradient(circle at 50% 35%, rgba(0,0,0,0.95), rgba(0,0,0,0.1) 65%, rgba(0,0,0,0) 78%)",
          }}
        />
        {/* particles glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(1px 1px at 15% 25%, rgba(0,242,255,0.55), rgba(0,0,0,0)), radial-gradient(1px 1px at 85% 30%, rgba(181,108,255,0.55), rgba(0,0,0,0)), radial-gradient(1px 1px at 35% 78%, rgba(0,242,255,0.35), rgba(0,0,0,0)), radial-gradient(1px 1px at 62% 62%, rgba(181,108,255,0.35), rgba(0,0,0,0)), radial-gradient(1px 1px at 72% 82%, rgba(0,242,255,0.25), rgba(0,0,0,0))",
            animation: "floatParticles 14s ease-in-out infinite",
            filter: "blur(0.2px)",
          }}
        />
        {/* vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 60% at 50% 30%, rgba(0,0,0,0), rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

