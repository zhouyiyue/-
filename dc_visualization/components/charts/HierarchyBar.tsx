"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export type HierarchyStage = "准备" | "响应" | "恢复";

export type HierarchyDatum = {
  stage: HierarchyStage;
  central: number; // 0~100
  provincial: number; // 0~100
  municipal: number; // 0~100
};

export type HierarchyBarProps = {
  data?: HierarchyDatum[];
  className?: string;
};

const DEFAULT_DATA: HierarchyDatum[] = [
  { stage: "准备", central: 18, provincial: 32, municipal: 50 },
  { stage: "响应", central: 22, provincial: 38, municipal: 40 },
  { stage: "恢复", central: 16, provincial: 30, municipal: 54 },
];

export default function HierarchyBar({ data = DEFAULT_DATA, className }: HierarchyBarProps) {
  const option = useMemo(() => {
    const stages = data.map((d) => d.stage);
    const central = data.map((d) => d.central);
    const provincial = data.map((d) => d.provincial);
    const municipal = data.map((d) => d.municipal);

    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { left: 44, right: 16, top: 18, bottom: 34, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(0, 5, 16, 0.88)",
        borderColor: "rgba(0,242,255,0.25)",
        textStyle: { color: "rgba(236,254,255,0.92)", fontFamily: "Orbitron, monospace" },
        valueFormatter: (v: number) => `${v}%`,
      },
      legend: {
        top: 0,
        right: 8,
        textStyle: { color: "rgba(236,254,255,0.72)", fontSize: 11, fontFamily: "Orbitron, monospace" },
        itemWidth: 10,
        itemHeight: 6,
      },
      textStyle: { fontFamily: "Orbitron, monospace" },
      xAxis: {
        type: "category",
        data: stages,
        axisLine: { lineStyle: { color: "rgba(0,242,255,0.22)" } },
        axisTick: { show: false },
        axisLabel: { color: "rgba(236,254,255,0.72)", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        max: 100,
        axisLabel: { formatter: "{value}%", color: "rgba(236,254,255,0.62)", fontSize: 11 },
        splitLine: { lineStyle: { color: "rgba(0,242,255,0.10)" } },
      },
      series: [
        {
          name: "中央",
          type: "bar",
          stack: "ratio",
          barWidth: 18,
          data: central,
          itemStyle: {
            color: "rgba(0,242,255,0.85)",
            shadowBlur: 12,
            shadowColor: "rgba(0,242,255,0.22)",
          },
        },
        {
          name: "省级",
          type: "bar",
          stack: "ratio",
          data: provincial,
          itemStyle: {
            color: "rgba(181,108,255,0.65)",
          },
        },
        {
          name: "市级",
          type: "bar",
          stack: "ratio",
          data: municipal,
          itemStyle: {
            color: "rgba(0,242,255,0.25)",
          },
          label: {
            show: true,
            position: "insideRight",
            color: "rgba(236,254,255,0.85)",
            formatter: (p: any) => (p.value >= 18 ? `${p.value}%` : ""),
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

