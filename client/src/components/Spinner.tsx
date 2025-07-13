import { LoaderCircle } from "lucide-react";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md";
};

const Spinner = ({ className = "", size = "md" }: SpinnerProps) => {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <span
      className={`inline-flex items-center animate-spin ${sizeClasses} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <LoaderCircle className="w-full h-full text-current" />
    </span>
  );
};

export default Spinner;
