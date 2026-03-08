"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export type TrendPoint = {
  /** x 轴标签（建议：MM-DD 或 YYYY-MM-DD） */
  date: string;
  count: number;
};

export type StageRange = {
  name: string;
  start: string;
  end: string;
  color: string;
};

export type TrendChartProps = {
  data?: TrendPoint[];
  stages?: StageRange[];
  className?: string;
};

const DEFAULT_STAGES: StageRange[] = [
  { name: "准备", start: "07-21", end: "07-26", color: "rgba(0,242,255,0.08)" },
  { name: "响应", start: "07-27", end: "07-29", color: "rgba(181,108,255,0.08)" },
  { name: "恢复", start: "07-30", end: "08-03", color: "rgba(0,242,255,0.05)" },
];

const DEFAULT_DATA: TrendPoint[] = [
  { date: "07-21", count: 1200 },
  { date: "07-22", count: 1600 },
  { date: "07-23", count: 2100 },
  { date: "07-24", count: 2600 },
  { date: "07-25", count: 3300 },
  { date: "07-26", count: 4100 },
  { date: "07-27", count: 5200 },
  { date: "07-28", count: 6800 },
  { date: "07-29", count: 6200 },
  { date: "07-30", count: 4800 },
  { date: "07-31", count: 3900 },
  { date: "08-01", count: 3000 },
  { date: "08-02", count: 2400 },
  { date: "08-03", count: 1900 },
];

export default function TrendChart({
  data = DEFAULT_DATA,
  stages = DEFAULT_STAGES,
  className,
}: TrendChartProps) {
  const option = useMemo(() => {
    const x = data.map((d) => d.date);
    const y = data.map((d) => d.count);

    const markAreaData = stages.map((s) => {
      return [
        {
          name: s.name,
          xAxis: s.start,
          itemStyle: { color: s.color },
          label: {
            show: true,
            color: "rgba(236,254,255,0.8)",
            fontSize: 12,
            fontWeight: 600,
          },
        },
        { xAxis: s.end },
      ];
    });

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
        splitLine: { lineStyle: { color: "rgba(0,242,255,0.10)" } },
        axisLabel: { color: "rgba(236,254,255,0.62)", fontSize: 11 },
      },
      series: [
        {
          name: "发文量",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: y,
          lineStyle: {
            width: 2,
            color: "#00f2ff",
            shadowBlur: 18,
            shadowColor: "rgba(0,242,255,0.22)",
          },
          areaStyle: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0,242,255,0.20)" },
              { offset: 1, color: "rgba(0,242,255,0.02)" },
            ]),
          },
          markArea: {
            silent: true,
            itemStyle: { borderWidth: 0 },
            data: markAreaData as any,
          },
        },
      ],
    } as echarts.EChartsOption;
  }, [data, stages]);

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

