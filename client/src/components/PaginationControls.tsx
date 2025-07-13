import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Button from "./Button";
import { PAGE_SIZE_OPTIONS } from "../lib/constants";

type Props = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const PaginationControls = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const canGoBack = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
    onPageChange(1); // Reset to first page when changing size
  };

  return (
    <div className="flex justify-center mt-6 items-center gap-4 text-sm relative">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(1)}
          disabled={!canGoBack}
          variant="icon"
          size="sm"
          ariaLabel="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
          variant="icon"
          size="sm"
          ariaLabel="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          variant="icon"
          size="sm"
          ariaLabel="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          variant="icon"
          size="sm"
          ariaLabel="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute right-0 flex items-center gap-2">
        <label htmlFor="page-size" className="text-gray-700 text-xs">
          Rows:
        </label>
        <select
          id="page-size"
          value={itemsPerPage}
          onChange={handlePageSizeChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;
