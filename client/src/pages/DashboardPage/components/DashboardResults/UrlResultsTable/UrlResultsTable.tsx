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
import Checkbox from "../../../../../components/Checkbox";
import Spinner from "../../../../../components/Spinner";

type UrlResultsTableProps = {
  urls: UrlEntry[];
  sortBy: UrlSortField;
  sortOrder: SortOrder;
  onSortChange: (field: UrlSortField) => void;
  isSelected: (id: number) => boolean;
  toggleSelection: (id: number) => void;
  toggleHeader: () => void;
  isAllSelected: boolean;
  isFetching: boolean;
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
  isFetching,
}: UrlResultsTableProps) => {
  const navigate = useNavigate();

  const handleSort = (field: UrlSortField) => {
    onSortChange(field);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

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
    <>
      {/* potential refactoring: create DesktopTable and CardView components */}

      {/* Desktop table */}
      <table className="min-w-full table-fixed text-sm text-left text-gray-700 mt-4 hidden lg:table">
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
                  {sortBy === col.key &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
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
              className="hover:bg-gray-50 cursor-pointer"
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

      {/* Mobile/Tablet stacked cards */}
      <div className="lg:hidden mt-4 space-y-4">
        <div className="flex pl-4 items-center gap-2">
          <Checkbox checked={isAllSelected} onChange={toggleHeader} />
          <label>Select All</label>
        </div>
        {urls.map((url) => (
          <div
            key={url.id}
            className="bg-white rounded-lg shadow p-4 text-sm cursor-pointer flex flex-wrap gap-y-4"
            onClick={() => navigate(`${URLS_ROUTE}/${url.id}`)}
          >
            {columns.map((col) => (
              <div key={col.key} className="w-1/2 md:w-1/3 break-words">
                <div className="text-gray-500 font-medium">{col.label}</div>
                <div>{col.render(url)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default UrlResultsTable;
