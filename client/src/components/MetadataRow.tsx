import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  truncate?: boolean;
};

const MetadataRow = ({ label, value, truncate = false }: Props) => {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}</span>
      <div
        className={truncate ? "truncate" : ""}
        title={truncate ? String(value) : undefined}
      >
        {value ?? "N/A"}
      </div>
    </div>
  );
};

export default MetadataRow;
