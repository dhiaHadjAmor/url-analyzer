export interface UrlResult {
  pageTitle: string;
  htmlVersion: string;
  linksInternal: number;
  linksExternal: number;
  brokenLinks: Array<{ href: string; statusCode: number }>;
  hasLoginForm: boolean;
  headingLevels: Record<string, number>;
}

export type UrlStatus = "queued" | "running" | "done" | "error";

export interface UrlEntry {
  id: number;
  address: string;
  status: UrlStatus;
  created_at: number;
  result: UrlResult | null;
}

export interface UrlsResponse {
  data: UrlEntry[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export type UrlSortField = keyof UrlEntry | keyof UrlResult;

export type SortOrder = "asc" | "desc";
