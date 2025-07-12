import { LoaderCircle } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <LoaderCircle
        className="animate-spin h-6 w-6 text-white"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;
