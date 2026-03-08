export type StageKey = "prepare" | "response" | "recovery";

export interface StageRange {
  key: StageKey;
  name: string;
  /** 月-日（不含年份），如 07-21 */
  start: string;
  /** 月-日（不含年份），如 07-26 */
  end: string;
}

export const STAGE_RANGES: StageRange[] = [
  { key: "prepare", name: "准备阶段", start: "07-21", end: "07-26" },
  { key: "response", name: "响应阶段", start: "07-27", end: "07-29" },
  { key: "recovery", name: "恢复阶段", start: "07-30", end: "08-03" },
];

export interface CoreMetrics {
  /** 总数 */
  total: number;
  /** 地理标签数 */
  geoTags: number;
  /** 政务账号 */
  govAccounts: number;
}

export const CORE_METRICS: CoreMetrics = {
  total: 60333,
  geoTags: 34214,
  govAccounts: 1426,
};

