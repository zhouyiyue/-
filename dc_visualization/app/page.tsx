"use client";

import { useEffect, useMemo, useState } from "react";
import DataCard from "../components/DataCard";
import ScreenAdapter from "../components/ScreenAdapter";
import EmotionLine from "../components/charts/EmotionLine";
import HierarchyBar from "../components/charts/HierarchyBar";
import MapChart from "../components/charts/MapChart";
import TrendChart from "../components/charts/TrendChart";
import { loadWeiboChartData } from "../lib/weiboData";

function formatNow(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

export default function Home() {
  const [now, setNow] = useState(() => new Date());
  const [chartData, setChartData] = useState<Awaited<ReturnType<typeof loadWeiboChartData>> | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    loadWeiboChartData().then(setChartData);
  }, []);

  const nowText = useMemo(() => formatNow(now), [now]);
  const d = chartData;

  return (
    <ScreenAdapter>
      <div className="h-full w-full p-6">
        <header className="relative mb-5 overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-950/15 px-6 py-4 backdrop-blur-md shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_28px_rgba(34,211,238,0.14)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />
            <div className="absolute -right-28 -bottom-28 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
          </div>

          <div className="relative grid grid-cols-3 items-center gap-4">
            <div className="flex items-center gap-3 text-cyan-50/85">
              <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
              <span className="font-digital text-sm">{nowText}</span>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-200 drop-shadow-[0_0_14px_rgba(34,211,238,0.35)]">
                台风“杜苏芮”微博舆情分析大屏
              </h1>
              <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
            </div>

            <div className="flex items-center justify-end gap-3 text-cyan-50/85">
              <span className="font-digital text-sm">{nowText}</span>
              <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
            </div>
          </div>
        </header>

        <main className="grid h-[calc(100%-92px)] grid-cols-4 gap-5">
          <section className="col-span-1 flex flex-col gap-5">
            <DataCard title="核心指标">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-black/20 px-3 py-2">
                  <div className="text-xs text-cyan-50/70">总数</div>
                  <div className="font-digital mt-1 text-xl font-semibold text-cyan-50">
                    {d?.total ?? "—"}
                  </div>
                </div>
                <div className="rounded-lg bg-black/20 px-3 py-2">
                  <div className="text-xs text-cyan-50/70">地理标签数</div>
                  <div className="font-digital mt-1 text-xl font-semibold text-cyan-50">
                    34214
                  </div>
                </div>
                <div className="rounded-lg bg-black/20 px-3 py-2">
                  <div className="text-xs text-cyan-50/70">政务账号</div>
                  <div className="font-digital mt-1 text-xl font-semibold text-cyan-50">
                    1426
                  </div>
                </div>
                <div className="rounded-lg bg-black/20 px-3 py-2">
                  <div className="text-xs text-cyan-50/70">阶段</div>
                  <div className="mt-1 text-sm font-medium text-cyan-50/90">
                    准备 / 响应 / 恢复
                  </div>
                </div>
              </div>
            </DataCard>

            <DataCard title="阶段趋势（发文量）">
              <div className="h-56">
                <TrendChart className="h-full w-full" data={d?.trend} />
              </div>
            </DataCard>

            <DataCard title="地理分布">
              <div className="h-56 rounded-lg bg-black/20" />
            </DataCard>
          </section>

          <section className="col-span-2 flex flex-col gap-5">
            <DataCard title="舆情总览（主视图）" className="h-full">
              <div className="grid h-full grid-rows-[1fr_auto] gap-4">
                <div className="rounded-xl border border-cyan-300/15 bg-black/10 p-2">
                  <MapChart className="h-full w-full" top10={d?.top10} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-28 rounded-lg bg-black/20" />
                  <div className="h-28 rounded-lg bg-black/20" />
                  <div className="h-28 rounded-lg bg-black/20" />
                </div>
              </div>
            </DataCard>
          </section>

          <section className="col-span-1 flex flex-col gap-5">
            <DataCard title="情感波动（面积图）">
              <div className="h-56">
                <EmotionLine className="h-full w-full" data={d?.emotion} />
              </div>
            </DataCard>

            <DataCard title="热门话题">
              <div className="h-56 rounded-lg bg-black/20" />
            </DataCard>

            <DataCard title="账号层级占比（堆叠柱状图）">
              <div className="h-56">
                <HierarchyBar className="h-full w-full" data={d?.hierarchy} />
              </div>
            </DataCard>
          </section>
        </main>
      </div>
    </ScreenAdapter>
  );
}
