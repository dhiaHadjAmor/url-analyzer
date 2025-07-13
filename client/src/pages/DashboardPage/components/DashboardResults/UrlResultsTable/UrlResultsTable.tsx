import type {
  SortOrder,
  UrlEntry,
  UrlSortField,
} from "../../../../../lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import TableCell from "../../../../../components/TableCell";
import { mapSortOrderToAria } from "../../../../../lib/utils";
import { getTableColumns } from "./tableColumns";
import { URLS_ROUTE } from "../../../../../lib/routes";
import { useNavigate } from "react-router-dom";

type Props = {
  urls: UrlEntry[];
  sortBy: UrlSortField;
  sortOrder: SortOrder;
  onSortChange: (field: UrlSortField) => void;
  isSelected: (id: number) => boolean;
  toggleSelection: (id: number) => void;
  toggleHeader: () => void;
  isAllSelected: boolean;
};

const UrlResultsTable = ({
  urls,
  sortBy,
  sortOrder,
  onSortChange,
  isSelected,
  isAllSelected,
  toggleHeader,
  toggleSelection,
}: Props) => {
  const navigate = useNavigate();

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
  const columns = getTableColumns({
    isSelected,
    toggleSelection,
    toggleHeader,
    isAllSelected,
  });

  return (
    <table className="min-w-full table-fixed text-sm text-left text-gray-700 mt-4">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => col.sortable && handleSort(col.key)}
              className={`px-4 py-2 font-medium select-none ${
                col.sortable ? "hover:underline cursor-pointer" : ""
              }`}
              scope="col"
              aria-sort={
                sortBy === col.key ? mapSortOrderToAria(sortOrder) : "none"
              }
            >
              <div className="flex items-center gap-1">
                {col.renderHeader ? col.renderHeader() : col.label}
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
            onClick={() => navigate(`${URLS_ROUTE}/${url.id}`)}
            className="border-b hover:bg-gray-100  cursor-pointer transition"
            data-testid={`row-${url.id}`}
          >
            {columns.map((col) => (
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
