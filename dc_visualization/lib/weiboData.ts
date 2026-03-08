/**
 * 微博舆情 CSV 数据聚合，驱动 MapChart / TrendChart / EmotionLine / HierarchyBar
 * 数据列：发文热度、阶段、行业、省份、层级；另需 发布时间、转发数、评论数、点赞数
 */
const CSV_PATH = "/data/政务合并榜补全_杜苏芮_微博匹配.csv";

export type CsvRow = {
  发文热度?: string;
  阶段?: string;
  行业?: string;
  省份?: string;
  层级?: string;
  发布时间?: string;
  转发数?: string;
  评论数?: string;
  点赞数?: string;
  [k: string]: string | undefined;
};

/** 省份短名 -> 地图标准名（含 省/市/自治区 等） */
const PROVINCE_NORM: Record<string, string> = {
  北京: "北京市",
  上海: "上海市",
  天津: "天津市",
  重庆: "重庆市",
  广东: "广东省",
  江苏: "江苏省",
  浙江: "浙江省",
  福建: "福建省",
  山东: "山东省",
  河南: "河南省",
  安徽: "安徽省",
  江西: "江西省",
  湖北: "湖北省",
  湖南: "湖南省",
  广西: "广西壮族自治区",
  海南: "海南省",
  四川: "四川省",
  贵州: "贵州省",
  云南: "云南省",
  陕西: "陕西省",
  甘肃: "甘肃省",
  青海: "青海省",
  辽宁: "辽宁省",
  吉林: "吉林省",
  黑龙江: "黑龙江省",
  河北: "河北省",
  山西: "山西省",
  内蒙古: "内蒙古自治区",
  宁夏: "宁夏回族自治区",
  新疆: "新疆维吾尔自治区",
  西藏: "西藏自治区",
  台湾: "台湾省",
  香港: "香港特别行政区",
  澳门: "澳门特别行政区",
};

function normProvince(raw: string): string {
  const t = (raw || "").trim();
  if (!t) return "";
  return PROVINCE_NORM[t] ?? (t.endsWith("省") || t.endsWith("市") || t.endsWith("自治区") ? t : `${t}省`);
}

function parseNum(s: string | undefined): number {
  if (s == null || s === "") return 0;
  const n = parseFloat(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** 从 2023/7/21 23:54 解析为 MM-DD */
function parseDateKey(s: string | undefined): string {
  if (!s || typeof s !== "string") return "";
  const m = s.match(/(\d{1,2})\/(\d{1,2})/);
  if (!m) return "";
  const [, month, day] = m;
  return `${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/** 阶段字段去「阶段」后缀 */
function normStage(raw: string | undefined): string {
  const t = (raw || "").trim();
  return t.replace(/阶段$/, "") || t;
}

/** 层级归类：中央级->中央, 省级->省级, 市级/县区级->市级 */
function normLevel(raw: string | undefined): "中央" | "省级" | "市级" {
  const t = (raw || "").trim();
  if (t.includes("中央")) return "中央";
  if (t.includes("省")) return "省级";
  return "市级";
}

export type Top10Province = { name: string; value: number };
export type TrendPoint = { date: string; count: number };
export type EmotionPoint = { date: string; score: number };
export type HierarchyDatum = {
  stage: "准备" | "响应" | "恢复";
  central: number;
  provincial: number;
  municipal: number;
};

export type WeiboChartData = {
  total: number;
  top10: Top10Province[];
  trend: TrendPoint[];
  emotion: EmotionPoint[];
  hierarchy: HierarchyDatum[];
};

/** 期望日期顺序（07-21 ~ 08-03） */
const DATE_ORDER = [
  "07-21", "07-22", "07-23", "07-24", "07-25", "07-26",
  "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03",
];

export async function loadWeiboChartData(): Promise<WeiboChartData> {
  // 在构建时或服务器端渲染时返回默认数据，避免静态生成卡住
  if (typeof window === 'undefined') {
    console.log('SSR/构建环境：返回默认数据');
    return getDefaultData();
  }

  console.log('客户端环境：开始加载CSV数据');
  let rows: CsvRow[];
  try {
    const res = await fetch(CSV_PATH);
    if (!res.ok) throw new Error(`${res.status}`);
    const text = await res.text();
    const { parse } = await import("papaparse");
    const parsed = parse<CsvRow>(text, { header: true, skipEmptyLines: true });
    rows = (parsed.data ?? []) as CsvRow[];
  } catch {
    return getDefaultData();
  }

  if (!rows.length) return getDefaultData();
  const total = rows.length;

  // Top10 省份（按发文数量）
  const provCount: Record<string, number> = {};
  for (const r of rows) {
    const prov = normProvince(r.省份 ?? "");
    if (!prov) continue;
    provCount[prov] = (provCount[prov] ?? 0) + 1;
  }
  const top10: Top10Province[] = Object.entries(provCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // 趋势：按日发文数量
  const dateCount: Record<string, number> = {};
  for (const d of DATE_ORDER) dateCount[d] = 0;
  for (const r of rows) {
    const key = parseDateKey(r.发布时间);
    if (key && key in dateCount) dateCount[key]++;
  }
  const trend: TrendPoint[] = DATE_ORDER.map((date) => ({
    date,
    count: dateCount[date] ?? 0,
  }));

  // 情感：用 点赞/(点赞+评论+转发+1) 作为正向参与度代理，按日平均后映射到约 -0.5~0.5
  const dateScores: Record<string, number[]> = {};
  for (const d of DATE_ORDER) dateScores[d] = [];
  for (const r of rows) {
    const key = parseDateKey(r.发布时间);
    if (!key || !(key in dateScores)) continue;
    const z = parseNum(r.点赞数);
    const c = parseNum(r.评论数);
    const f = parseNum(r.转发数);
    const total = z + c + f + 1;
    const ratio = z / total;
    dateScores[key].push(ratio);
  }
  const emotion: EmotionPoint[] = DATE_ORDER.map((date) => {
    const arr = dateScores[date] ?? [];
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const score = (avg - 0.5) * 2;
    return { date, score: Math.max(-1, Math.min(1, score)) };
  });

  // 层级占比：按阶段统计 中央/省级/市级 数量，再算百分比
  const stageOrder = ["准备", "响应", "恢复"] as const;
  const mat: Record<string, Record<string, number>> = {
    准备: { 中央: 0, 省级: 0, 市级: 0 },
    响应: { 中央: 0, 省级: 0, 市级: 0 },
    恢复: { 中央: 0, 省级: 0, 市级: 0 },
  };
  for (const r of rows) {
    const stage = normStage(r.阶段);
    const lv = normLevel(r.层级);
    if (stage in mat && lv in mat[stage]) mat[stage][lv]++;
  }
  const hierarchy: HierarchyDatum[] = stageOrder.map((stage) => {
    const c = mat[stage].中央 ?? 0;
    const p = mat[stage].省级 ?? 0;
    const m = mat[stage].市级 ?? 0;
    const total = c + p + m || 1;
    return {
      stage,
      central: Math.round((c / total) * 100),
      provincial: Math.round((p / total) * 100),
      municipal: Math.round((m / total) * 100),
    };
  });

  return { total, top10, trend, emotion, hierarchy };
}

function getDefaultData(): WeiboChartData {
  return {
    total: 60333,
    top10: [
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
    ],
    trend: DATE_ORDER.map((date, i) => ({
      date,
      count: [1200, 1600, 2100, 2600, 3300, 4100, 5200, 6800, 6200, 4800, 3900, 3000, 2400, 1900][i] ?? 1500,
    })),
    emotion: DATE_ORDER.map((date, i) => ({
      date,
      score: [0.18, 0.12, 0.05, -0.08, -0.22, -0.35, -0.48, -0.3, -0.1, 0.06, 0.14, 0.22, 0.16, 0.1][i] ?? 0,
    })),
    hierarchy: [
      { stage: "准备", central: 18, provincial: 32, municipal: 50 },
      { stage: "响应", central: 22, provincial: 38, municipal: 40 },
      { stage: "恢复", central: 16, provincial: 30, municipal: 54 },
    ],
  };
}
