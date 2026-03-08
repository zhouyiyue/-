"use client";

import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

type ProvinceHotspot = {
  name: string;
  value: number;
};

export type MapChartProps = {
  /** Top10 省份热点（name 需与地图省份名称一致） */
  top10?: ProvinceHotspot[];
  /** 台风路径经纬度（[lng, lat]），为空则使用默认示例路径 */
  typhoonPath?: [number, number][];
  className?: string;
};

const CHINA_GEOJSON_URL =
  "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json";

const DEFAULT_TOP10: ProvinceHotspot[] = [
  { name: "福建省", value: 9820 },
  { name: "浙江省", value: 8450 },
  { name: "广东省", value: 8022 },
  { name: "江苏省", value: 7360 },
  { name: "上海市", value: 7050 },
  { name: "山东省", value: 6680 },
  { name: "安徽省", value: 6320 },
  { name: "江西省", value: 6110 },
  { name: "河南省", value: 5890 },
  { name: "北京市", value: 5520 },
];

// 省份中心点（粗略，用于 Top10 散点标注）
const PROVINCE_CENTER: Record<string, [number, number]> = {
  北京市: [116.4074, 39.9042],
  上海市: [121.4737, 31.2304],
  天津市: [117.2000, 39.1333],
  重庆市: [106.5516, 29.5630],
  河北省: [114.5025, 38.0455],
  山西省: [112.5492, 37.8570],
  辽宁省: [123.4315, 41.8057],
  吉林省: [125.3245, 43.8868],
  黑龙江省: [126.5349, 45.8038],
  江苏省: [118.7969, 32.0603],
  浙江省: [120.1536, 30.2875],
  安徽省: [117.2830, 31.8612],
  福建省: [119.2965, 26.0745],
  江西省: [115.8582, 28.6829],
  山东省: [117.0009, 36.6758],
  河南省: [113.6254, 34.7466],
  湖北省: [114.2986, 30.5844],
  湖南省: [112.9388, 28.2282],
  广东省: [113.2644, 23.1291],
  广西壮族自治区: [108.3200, 22.8240],
  海南省: [110.3312, 20.0310],
  四川省: [104.0665, 30.5723],
  贵州省: [106.6302, 26.6470],
  云南省: [102.7123, 25.0406],
  陕西省: [108.9402, 34.3416],
  甘肃省: [103.8343, 36.0611],
  青海省: [101.7782, 36.6171],
  内蒙古自治区: [111.6708, 40.8183],
  宁夏回族自治区: [106.2782, 38.4664],
  新疆维吾尔自治区: [87.6177, 43.7928],
  西藏自治区: [91.1322, 29.6604],
  香港特别行政区: [114.1694, 22.3193],
  澳门特别行政区: [113.5439, 22.1987],
  台湾省: [121.5201, 25.0307],
};

const DEFAULT_TYPHOON_PATH: [number, number][] = [
  [120.5, 22.2],
  [120.9, 23.2],
  [121.4, 24.3],
  [121.8, 25.4],
  [122.0, 26.6],
  [121.7, 27.7],
  [121.2, 28.8],
  [120.6, 30.0],
  [120.0, 31.2],
  [119.4, 32.5],
  [118.7, 33.9],
  [118.0, 35.2],
  [117.2, 36.6],
  [116.6, 38.1],
  [116.2, 39.6],
];

export default function MapChart({
  top10 = DEFAULT_TOP10,
  typhoonPath = DEFAULT_TYPHOON_PATH,
  className,
}: MapChartProps) {
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function ensureMap() {
      try {
        // 避免重复注册
        if (echarts.getMap?.("china")) {
          if (!cancelled) setMapReady(true);
          return;
        }

        const res = await fetch(CHINA_GEOJSON_URL, { cache: "force-cache" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const geojson = await res.json();

        echarts.registerMap("china", geojson);
        if (!cancelled) setMapReady(true);
      } catch (e) {
        if (!cancelled) {
          setMapError(e instanceof Error ? e.message : "未知错误");
        }
      }
    }

    ensureMap();
    return () => {
      cancelled = true;
    };
  }, []);

  const series = useMemo(() => {
    const scatterData = top10
      .map((p) => {
        const coord = PROVINCE_CENTER[p.name];
        if (!coord) return null;
        return {
          name: p.name,
          value: [...coord, p.value] as [number, number, number],
        };
      })
      .filter(Boolean) as { name: string; value: [number, number, number] }[];

    const typhoonLine = [
      {
        coords: typhoonPath,
      },
    ];

    return [
      {
        name: "热点省份",
        type: "scatter",
        coordinateSystem: "geo",
        data: scatterData,
        symbolSize: (val: [number, number, number]) =>
          Math.max(8, Math.min(20, val[2] / 600)),
        label: {
          show: true,
          formatter: "{b}",
          position: "right",
          color: "rgba(240,253,250,0.9)",
          fontSize: 11,
        },
        itemStyle: {
          color: "rgba(34,211,238,0.95)",
          shadowBlur: 18,
          shadowColor: "rgba(34,211,238,0.65)",
        },
        tooltip: {
          valueFormatter: (v: number) => `${v}`,
        },
        zlevel: 3,
      },
      {
        name: "台风路径",
        type: "lines",
        coordinateSystem: "geo",
        polyline: true,
        data: typhoonLine,
        effect: {
          show: true,
          constantSpeed: 45,
          symbol: "circle",
          symbolSize: 6,
          trailLength: 0.7,
          color: "rgba(103,232,249,0.9)",
        },
        lineStyle: {
          width: 2,
          opacity: 0.75,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "rgba(34,211,238,0.0)" },
            { offset: 0.25, color: "rgba(34,211,238,0.55)" },
            { offset: 0.6, color: "rgba(56,189,248,0.9)" },
            { offset: 1, color: "rgba(34,211,238,0.2)" },
          ]),
        },
        zlevel: 2,
      },
    ];
  }, [top10, typhoonPath]);

  const option = useMemo(() => {
    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 900,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(0, 5, 16, 0.88)",
        borderColor: "rgba(0,242,255,0.25)",
        textStyle: { color: "rgba(236,254,255,0.92)", fontFamily: "Orbitron, monospace" },
      },
      textStyle: { fontFamily: "Orbitron, monospace" },
      geo: {
        map: "china",
        roam: false,
        zoom: 1.05,
        itemStyle: {
          areaColor: "rgba(0,242,255,0.06)",
          borderColor: "rgba(0,242,255,0.22)",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: "rgba(181,108,255,0.12)",
            borderColor: "rgba(0,242,255,0.55)",
            borderWidth: 1.2,
          },
          label: { show: false },
        },
        label: { show: false },
      },
      visualMap: {
        show: false,
        min: 0,
        max: Math.max(...top10.map((x) => x.value), 1),
        inRange: {
          color: ["rgba(0,242,255,0.18)", "rgba(0,242,255,0.55)"],
        },
      },
      series,
    } as echarts.EChartsOption;
  }, [series, top10]);

  if (mapError) {
    return (
      <div
        className={className}
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(224, 231, 255, 0.8)",
        }}
      >
        地图加载失败：{mapError}
      </div>
    );
  }

  if (!mapReady) {
    return (
      <div
        className={className}
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(224, 231, 255, 0.8)",
        }}
      >
        地图加载中…
      </div>
    );
  }

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

