import type { ReactNode } from "react";
import type { UrlEntry, UrlResult, UrlStatus } from "../../../../../lib/types";

export type UrlColumn = {
  key: keyof UrlEntry | keyof UrlResult | "checkbox";
  label: string;
  sortable: boolean;
  render: (url: UrlEntry) => ReactNode;
  renderHeader?: () => ReactNode;
  className?: string;
};

type TableColumnsProps = {
  isSelected: (id: number) => boolean;
  toggleSelection: (id: number) => void;
  toggleHeader: () => void;
  isAllSelected: boolean;
};

const statusColors: Record<UrlStatus, string> = {
  queued: "bg-gray-200 text-gray-800",
  running: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
};

export const getTableColumns = ({
  isSelected,
  toggleSelection,
  toggleHeader,
  isAllSelected,
}: TableColumnsProps): UrlColumn[] => [
  {
    key: "checkbox",
    label: "",
    sortable: false,
    render: (url) => (
      <input
        type="checkbox"
        checked={isSelected(url.id)}
        onChange={() => toggleSelection(url.id)}
        className="cursor-pointer"
      />
    ),
    renderHeader: () => (
      <input
        type="checkbox"
        checked={isAllSelected}
        onChange={toggleHeader}
        className="cursor-pointer"
      />
    ),
  },
  {
    key: "address",
    label: "Address",
    sortable: true,
    render: (url) => (
      <a
        href={url.address}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all hover:text-blue-800"
        title={url.address}
      >
        {url.address}
      </a>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (url) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[url.status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {url.status?.toUpperCase() || "—"}
      </span>
    ),
  },
  {
    key: "pageTitle",
    label: "Page Title",
    sortable: true,
    className: "whitespace-nowrap max-w-48 truncate",
    render: (url) => (
      <span title={url.result?.pageTitle || ""}>
        {url.result?.pageTitle || "—"}
      </span>
    ),
  },
  {
    key: "htmlVersion",
    label: "HTML Version",
    sortable: true,
    render: (url) => url.result?.htmlVersion ?? "—",
  },
  {
    key: "linksInternal",
    label: "#Internal Links",
    sortable: false,
    render: (url) => url.result?.linksInternal ?? 0,
  },
  {
    key: "linksExternal",
    label: "#External Links",
    sortable: false,
    render: (url) => url.result?.linksExternal ?? 0,
  },
  {
    key: "brokenLinks",
    label: "#Broken Links",
    sortable: false,
    render: (url) => url.result?.brokenLinks?.length ?? 0,
  },
  {
    key: "hasLoginForm",
    label: "Login Form",
    sortable: false,
    render: (url) => (url.result?.hasLoginForm ? "Yes" : "No"),
  },
];
