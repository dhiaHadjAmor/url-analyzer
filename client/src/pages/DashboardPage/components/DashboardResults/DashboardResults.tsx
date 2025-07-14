import { useEffect, useState } from "react";
import Spinner from "../../../../components/Spinner";
import { useUrlsQuery } from "../../../../hooks/queries/useUrlsQuery";
import type { BulkAction, UrlSortField } from "../../../../lib/types";
import useTableQueryParams from "../../hooks/useTableQueryParams";
import SearchInput from "./SearchInput";
import UrlResultsTable from "./UrlResultsTable/UrlResultsTable";
import useDebouncedValue from "../../../../hooks/useDebouncedValue";
import {
  DEBOUNCE_TIME_IN_MS,
  POLLING_INTERVAL,
} from "../../../../lib/constants";
import PaginationControls from "../../../../components/PaginationControls";
import useSelectedUrls from "../../hooks/useUrlSelection";
import BulkActionsBar from "./BulkActionsBar";
import { useDeleteUrlsMutation } from "../../../../hooks/mutations/useDeleteUrlsMutation";
import { useRerunUrlsMutation } from "../../../../hooks/mutations/useRerunUrlsMutation";
import { useStopUrlsMutation } from "../../../../hooks/mutations/useStopUrlsMutation";

const DashboardResults = () => {
  const { params, setPage, setSortBy, setSortOrder, setSearch, setLimit } =
    useTableQueryParams();

  const [searchValue, setSearchValue] = useState(params.search);
  const debouncedSearch = useDebouncedValue(searchValue, DEBOUNCE_TIME_IN_MS);
  const [enablePolling, setEnablePolling] = useState<number | false>(false);

  useEffect(() => {
    setSearch(debouncedSearch);
    setPage(1); // Reset page when search changes
    // We don't want to trigger this effect on every render, only when debouncedSearch changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isPending, isFetching, isError } = useUrlsQuery({
    params,
    enablePolling,
  });

  useEffect(() => {
    if (!data) return;
    const shouldPoll = data.data.some((url) =>
      ["queued", "running"].includes(url.status)
    );
    setEnablePolling(shouldPoll ? POLLING_INTERVAL : false);
  }, [data]);

  // TODO: use Jotai store (or similar) for URL selection to avoid prop drilling
  // This will allow us to manage selected URLs across components without passing props down
  const {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  } = useSelectedUrls();

  const { mutate: mutateDeleteUrls, isPending: isDeletingUrls } =
    useDeleteUrlsMutation();
  const { mutate: mutateRerunUrls, isPending: isRerunningUrls } =
    useRerunUrlsMutation();
  const { mutate: mutateStopUrls, isPending: isStoppingUrls } =
    useStopUrlsMutation();

  const handleBulkAction = (action: BulkAction) => {
    const ids = Array.from(selectedIds);

    switch (action) {
      case "rerun":
        mutateRerunUrls(ids, { onSuccess: () => clearSelection() });
        break;
      case "stop":
        mutateStopUrls(ids, { onSuccess: () => clearSelection() });
        break;
      case "delete":
        mutateDeleteUrls(ids, { onSuccess: () => clearSelection() });
        break;
    }
  };

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

  const handleHeaderToggle = () => {
    if (selectedIds.size > 0) {
      clearSelection();
    } else {
      selectAll(data.data.map((url) => url.id));
    }
  };

  const isStopActionDisabled = data.data
    .filter((url) => selectedIds.has(url.id))
    .some((url) => url.status !== "running" && url.status !== "queued");

  return (
    <section className="mt-8" aria-label="Analyzed URLs Table">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold pl-8">Analyzed URLs</h2>
        <div className="overflow-x-auto p-8 pt-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
            <SearchInput
              value={searchValue}
              onChange={(value) => setSearchValue(value)}
            />
            <BulkActionsBar
              selectedCount={selectedIds.size}
              onAction={handleBulkAction}
              isRerunning={isRerunningUrls}
              isStopping={isStoppingUrls}
              isDeleting={isDeletingUrls}
              isStopActionDisabled={isStopActionDisabled}
            />
          </div>
          <UrlResultsTable
            isFetching={isFetching}
            urls={data.data}
            sortBy={params.sortBy}
            sortOrder={params.sortOrder}
            onSortChange={handleSort}
            isSelected={isSelected}
            toggleSelection={toggleSelection}
            toggleHeader={handleHeaderToggle}
            isAllSelected={selectedIds.size === data.meta.total}
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
