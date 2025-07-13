import { useState } from "react";

const useUrlSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectAll = (ids: number[]) => setSelectedIds(new Set(ids));

  return {
    selectedIds,
    toggleSelection,
    clearSelection,
    selectAll,
    isSelected: (id: number) => selectedIds.has(id),
  };
};

export default useUrlSelection;
