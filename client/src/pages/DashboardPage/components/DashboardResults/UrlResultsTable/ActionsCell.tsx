import { RotateCcw, Square } from "lucide-react";
import Button from "../../../../../components/Button";

type ActionsCellProps = {
  urlId: number;
  status: string;
  onRerun: (id: number) => void;
  onStop: (id: number) => void;
};

const ActionsCell = ({ urlId, status, onRerun, onStop }: ActionsCellProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onRerun(urlId)}
        variant="icon"
        size="sm"
        disabled={status !== "done" && status !== "error"}
        ariaLabel="Rerun analysis"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => onStop(urlId)}
        variant="icon"
        size="sm"
        disabled={status !== "running"}
        ariaLabel="Stop analysis"
      >
        <Square className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ActionsCell;
