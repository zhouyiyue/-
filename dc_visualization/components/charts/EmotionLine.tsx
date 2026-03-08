"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export type EmotionPoint = {
  date: string;
  /** 情感得分（建议 -1 ~ 1） */
  score: number;
};

export type EmotionLineProps = {
  data?: EmotionPoint[];
  className?: string;
};

const DEFAULT_DATA: EmotionPoint[] = [
  { date: "07-21", score: 0.18 },
  { date: "07-22", score: 0.12 },
  { date: "07-23", score: 0.05 },
  { date: "07-24", score: -0.08 },
  { date: "07-25", score: -0.22 },
  { date: "07-26", score: -0.35 },
  { date: "07-27", score: -0.48 },
  { date: "07-28", score: -0.30 },
  { date: "07-29", score: -0.10 },
  { date: "07-30", score: 0.06 },
  { date: "07-31", score: 0.14 },
  { date: "08-01", score: 0.22 },
  { date: "08-02", score: 0.16 },
  { date: "08-03", score: 0.10 },
];

export default function EmotionLine({ data = DEFAULT_DATA, className }: EmotionLineProps) {
  const option = useMemo(() => {
    const x = data.map((d) => d.date);
    const y = data.map((d) => d.score);

    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 44, right: 16, top: 18, bottom: 34, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 5, 16, 0.88)",
        borderColor: "rgba(0,242,255,0.25)",
        textStyle: { color: "rgba(236,254,255,0.92)", fontFamily: "Orbitron, monospace" },
        valueFormatter: (v: number) => v.toFixed(2),
      },
      textStyle: { fontFamily: "Orbitron, monospace" },
      xAxis: {
        type: "category",
        data: x,
        axisLine: { lineStyle: { color: "rgba(0,242,255,0.22)" } },
        axisTick: { show: false },
        axisLabel: { color: "rgba(236,254,255,0.72)", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        min: -1,
        max: 1,
        splitLine: { lineStyle: { color: "rgba(0,242,255,0.10)" } },
        axisLabel: { color: "rgba(236,254,255,0.62)", fontSize: 11 },
      },
      series: [
        {
          name: "情感得分",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: y,
          lineStyle: { width: 2, color: "rgba(181,108,255,0.95)" },
          areaStyle: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(181,108,255,0.18)" },
              { offset: 1, color: "rgba(181,108,255,0.02)" },
            ]),
          },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: "rgba(236,254,255,0.18)", type: "dashed" },
            data: [{ yAxis: 0 }],
          },
        },
      ],
    } as echarts.EChartsOption;
  }, [data]);

  return (
    <ReactECharts
      className={["chart-enter", className ?? ""].join(" ")}
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge
      lazyUpdate
    />
  );
}

