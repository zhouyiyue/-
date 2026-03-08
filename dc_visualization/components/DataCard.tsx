"use client";

import React from "react";

export type DataCardProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

export default function DataCard({ title, className, children }: DataCardProps) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-xl",
        "border border-[rgba(0,242,255,0.35)]",
        "bg-[rgba(0,242,255,0.05)]",
        "shadow-[0_0_0_1px_rgba(0,242,255,0.08),0_0_28px_rgba(0,242,255,0.16),0_0_60px_rgba(181,108,255,0.08)]",
        "backdrop-blur-md",
        className ?? "",
      ].join(" ")}
    >
      <div className="relative flex items-center gap-3 px-4 py-3">
        <div className="h-3 w-3 rounded-sm bg-[#00f2ff] shadow-[0_0_18px_rgba(0,242,255,0.9)]" />
        <h3 className="text-[15px] font-semibold tracking-wide text-[rgba(236,254,255,0.95)]">
          {title}
        </h3>
        <div className="ml-auto h-px flex-1 bg-gradient-to-r from-[rgba(0,242,255,0.38)] via-[rgba(0,242,255,0.10)] to-transparent" />
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(0,242,255,0.22)] to-transparent" />

      <div className="p-4 text-sm text-[rgba(236,254,255,0.82)]">{children}</div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-52 w-52 rounded-full bg-[rgba(0,242,255,0.12)] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-60 w-60 rounded-full bg-[rgba(181,108,255,0.10)] blur-3xl" />
      </div>
    </section>
  );
}

