import type {
  SortOrder,
  UrlEntry,
  UrlSortField,
} from "../../../../../types/Url";
import { ChevronDown, ChevronUp } from "lucide-react";
import { tableColumns } from "./tableColumns";
import TableCell from "../../../../../components/TableCell";
import { mapSortOrderToAria } from "../../../../../lib/utils";

type Props = {
  urls: UrlEntry[];
  sortBy: UrlSortField;
  sortOrder: SortOrder;
  onSortChange: (field: UrlSortField) => void;
};

const UrlResultsTable = ({ urls, sortBy, sortOrder, onSortChange }: Props) => {
  const handleSort = (field: UrlSortField) => {
    onSortChange(field);
  };

  if (urls.length === 0) {
    return (
      <div className="mt-6 text-gray-500 text-sm" role="note">
        No URLs analyzed yet.
      </div>
    );
  }

  return (
    <table className="min-w-full table-fixed text-sm text-left text-gray-700 mt-4">
      <thead className="bg-gray-100">
        <tr>
          {tableColumns.map((col) => (
            <th
              key={col.key}
              onClick={() => col.sortable && handleSort(col.key)}
              className={`px-4 py-2 font-medium cursor-pointer select-none ${
                col.sortable ? "hover:underline" : ""
              }`}
              scope="col"
              aria-sort={
                sortBy === col.key ? mapSortOrderToAria(sortOrder) : "none"
              }
            >
              <div className="flex items-center gap-1">
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <>
                    {sortOrder === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {urls.map((url) => (
          <tr
            key={url.id}
            className="border-b hover:bg-gray-50 transition"
            data-testid={`row-${url.id}`}
          >
            {tableColumns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.render(url)}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UrlResultsTable;
