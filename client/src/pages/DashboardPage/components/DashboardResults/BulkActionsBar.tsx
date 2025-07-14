import { Trash2, RotateCcw, Pause } from "lucide-react";
import Button from "../../../../components/Button";
import type { BulkAction } from "../../../../lib/types";

type BulkActionsBarProps = {
  selectedCount: number;
  onAction: (action: BulkAction) => void;
  isRerunning?: boolean;
  isStopping?: boolean;
  isDeleting?: boolean;
  isStopActionDisabled?: boolean;
};

const BulkActionsBar = ({
  selectedCount,
  onAction,
  isDeleting,
  isRerunning,
  isStopping,
  isStopActionDisabled,
}: BulkActionsBarProps) => {
  const areActionsDisabled = selectedCount === 0;

  return (
    <div className="flex justify-between items-center  bg-gray-50 text-sm">
      <span className="hidden md:block mr-2">
        {selectedCount} Selected Row(s)
      </span>
      <div className="flex gap-2">
        <Button
          isLoading={isRerunning}
          disabled={areActionsDisabled}
          ariaLabel="Re-run selected URLs"
          variant="outline"
          size="sm"
          onClick={() => onAction("rerun")}
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Re-run
        </Button>
        <Button
          disabled={areActionsDisabled || isStopActionDisabled}
          ariaLabel="Stop selected URLs"
          isLoading={isStopping}
          variant="outline"
          size="sm"
          onClick={() => onAction("stop")}
        >
          <Pause className="w-4 h-4 mr-1" /> Stop
        </Button>
        <Button
          isLoading={isDeleting}
          disabled={areActionsDisabled}
          ariaLabel="Delete selected URLs"
          variant="danger"
          size="sm"
          onClick={() => onAction("delete")}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
