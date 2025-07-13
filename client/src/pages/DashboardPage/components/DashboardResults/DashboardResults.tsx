import { useEffect, useState } from "react";
import Spinner from "../../../../components/Spinner";
import { useUrlsQuery } from "../../../../hooks/queries/useUrlsQuery";
import type { UrlSortField } from "../../../../types/Url";
import useTableQueryParams from "../../hooks/useTableQueryParams";
import SearchInput from "./SearchInput";
import UrlResultsTable from "./UrlResultsTable/UrlResultsTable";
import useDebouncedValue from "../../../../hooks/useDebouncedValue";
import { DEBOUNCE_TIME_IN_MS } from "../../../../lib/constants";
import PaginationControls from "../../../../components/PaginationControls";

const DashboardResults = () => {
  const { params, setPage, setSortBy, setSortOrder, setSearch, setLimit } =
    useTableQueryParams();

  const [searchValue, setSearchValue] = useState(params.search);
  const debouncedSearch = useDebouncedValue(searchValue, DEBOUNCE_TIME_IN_MS);

  useEffect(() => {
    setSearch(debouncedSearch);
    setPage(1); // Reset page when search changes
    // We don't want to trigger this effect on every render, only when debouncedSearch changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isPending, isError } = useUrlsQuery(params);

  if (isPending) {
    return (
      <div
        className="mt-6 flex justify-center"
        role="status"
        aria-live="polite"
      >
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 text-red-500 text-sm" role="alert">
        Failed to load results.
      </div>
    );
  }

  const handleSort = (key: UrlSortField) => {
    if (params.sortBy === key) {
      setSortOrder(params.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc"); // set default sort order to descending
      setPage(1); // reset to first page on new sort
    }
  };

  return (
    <section className="mt-8" aria-label="Analyzed URLs Table">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold pl-8">Analyzed URLs</h2>
        <div className="overflow-x-auto p-8 pt-4">
          <SearchInput
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
          />
          <UrlResultsTable
            urls={data.data}
            sortBy={params.sortBy}
            sortOrder={params.sortOrder}
            onSortChange={handleSort}
          />
          <PaginationControls
            currentPage={params.page}
            totalItems={data.meta.total}
            itemsPerPage={params.limit}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardResults;
