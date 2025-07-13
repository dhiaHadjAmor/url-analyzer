import MetadataRow from "../../../components/MetadataRow";
import type { UrlDetailResponse } from "../../../lib/types";

type MetadataSectionProps = {
  data: UrlDetailResponse;
};

const MetadataSection = ({ data }: MetadataSectionProps) => {
  return (
    <section className="border rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Page Metadata</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <MetadataRow label="Page Title:" value={data.pageTitle} truncate />
        <MetadataRow label="HTML Version:" value={data.htmlVersion} />
        <MetadataRow
          label="Login Form:"
          value={data.hasLoginForm ? "Yes" : "No"}
        />
        <MetadataRow
          label="Status:"
          value={
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                data.status === "done"
                  ? "bg-green-100 text-green-800"
                  : data.status === "running"
                  ? "bg-yellow-100 text-yellow-800"
                  : data.status === "queued"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {data.status.toUpperCase()}
            </span>
          }
        />
      </div>
    </section>
  );
};

export default MetadataSection;
