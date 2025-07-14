import type { ReactNode } from "react";
import Spinner from "./Spinner";

const LoadingColumn = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) => {
  return isLoading ? <Spinner size="sm" className="text-gray-700" /> : children;
};

export default LoadingColumn;
