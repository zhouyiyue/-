import Papa, { type ParseConfig, type ParseError, type ParseResult } from "papaparse";

export type ReadCsvOptions<T> = {
  /**
   * papaparse 配置（会与默认值合并）
   * - 默认：header=true, skipEmptyLines=true
   */
  papa?: Omit<ParseConfig<T>, "complete" | "error" | "download">;
  /**
   * 文件是否有表头（默认 true）。
   * - true：返回对象数组（key 来自表头）
   * - false：返回数组数组
   */
  header?: boolean;
};

export class CsvReadError extends Error {
  readonly filePath: string;
  readonly cause?: unknown;

  constructor(message: string, filePath: string, cause?: unknown) {
    super(message);
    this.name = "CsvReadError";
    this.filePath = filePath;
    this.cause = cause;
  }
}

/**
 * 通用 CSV 读取工具。
 * - 读取路径：默认从站点根路径的 `/data/<fileName>` 读取
 * - 解析：使用 papaparse（默认 header=true、skipEmptyLines=true）
 */
export async function readCsv<T = Record<string, string>>(
  fileName: string,
  options: ReadCsvOptions<T> = {},
): Promise<T[]> {
  const normalized = fileName.replace(/^\/+/, "");
  const filePath = normalized.startsWith("data/") ? `/${normalized}` : `/data/${normalized}`;

  let text: string;
  try {
    const res = await fetch(filePath);
    if (!res.ok) {
      throw new CsvReadError(`请求 CSV 失败（${res.status} ${res.statusText}）`, filePath);
    }
    text = await res.text();
  } catch (err) {
    if (err instanceof CsvReadError) throw err;
    throw new CsvReadError("请求 CSV 失败（网络异常）", filePath, err);
  }

  const header = options.header ?? true;
  const papaConfig: ParseConfig<T> = {
    header,
    skipEmptyLines: true,
    ...options.papa,
  } as ParseConfig<T>;

  const parsed: ParseResult<T> = Papa.parse<T>(text, papaConfig);
  if (parsed.errors?.length) {
    const brief = parsed.errors
      .slice(0, 3)
      .map((e: ParseError) => `${e.type}${typeof e.row === "number" ? `@row:${e.row}` : ""}`)
      .join(", ");
    throw new CsvReadError(`解析 CSV 失败（${brief}${parsed.errors.length > 3 ? "..." : ""}）`, filePath, parsed.errors);
  }

  return parsed.data as T[];
}

