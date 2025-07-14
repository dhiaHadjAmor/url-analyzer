import type { ReactNode } from "react";
import type { UrlEntry, UrlResult, UrlStatus } from "../../../../../lib/types";
import Spinner from "../../../../../components/Spinner";
import Checkbox from "../../../../../components/Checkbox";
import LoadingColumn from "../../../../../components/LoadingColumn";

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

const isUrlLoading = (url: UrlEntry): boolean => {
  return url.status === "running" || url.status === "queued";
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
      <Checkbox
        checked={isSelected(url.id)}
        onClick={(e) => e.stopPropagation()}
        onChange={() => toggleSelection(url.id)}
      />
    ),
    renderHeader: () => (
      <Checkbox checked={isAllSelected} onChange={toggleHeader} />
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
        className={`flex px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[url.status] || "bg-gray-100 text-gray-700"
        } max-w-24`}
      >
        {(url.status === "running" || url.status === "queued") && (
          <Spinner size="sm" className="text-gray-700 mr-1" />
        )}
        {url.status?.toUpperCase() || "—"}
      </span>
    ),
  },
  {
    key: "pageTitle",
    label: "Page Title",
    sortable: true,
    className: "whitespace-nowrap lg:max-w-40 truncate",
    render: (url) => (
      <LoadingColumn isLoading={isUrlLoading(url)}>
        <span title={url.result?.pageTitle || ""}>
          {url.result?.pageTitle || "—"}
        </span>
      </LoadingColumn>
    ),
  },
  {
    key: "htmlVersion",
    label: "HTML Version",
    sortable: true,
    render: (url) => (
      <LoadingColumn isLoading={isUrlLoading(url)}>
        {url.result?.htmlVersion ?? "—"}
      </LoadingColumn>
    ),
  },
  {
    key: "linksInternal",
    label: "#Internal Links",
    sortable: false,
    render: (url) => (
      <LoadingColumn isLoading={isUrlLoading(url)}>
        {url.result?.linksInternal ?? 0}
      </LoadingColumn>
    ),
  },
  {
    key: "linksExternal",
    label: "#External Links",
    sortable: false,
    render: (url) => (
      <LoadingColumn isLoading={isUrlLoading(url)}>
        {url.result?.linksExternal ?? 0}
      </LoadingColumn>
    ),
  },
  {
    key: "brokenLinks",
    label: "#Broken Links",
    sortable: false,
    render: (url) => (
      <LoadingColumn isLoading={isUrlLoading(url)}>
        {url.result?.brokenLinks?.length ?? 0}
      </LoadingColumn>
    ),
  },
  {
    key: "hasLoginForm",
    label: "Login Form",
    sortable: false,
    render: (url) => (
      <LoadingColumn isLoading={isUrlLoading(url)}>
        {url.result?.hasLoginForm ? "Yes" : "No"}
      </LoadingColumn>
    ),
  },
];
