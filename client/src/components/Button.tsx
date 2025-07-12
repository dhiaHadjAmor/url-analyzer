import React from "react";
import Spinner from "./Spinner";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  testId?: string;
};

const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  testId = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center cursor-pointer px-5 py-2 rounded-md font-medium transition-colors
        ${
          disabled || isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        ${className}`}
      disabled={disabled || isLoading}
      data-testid={testId}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
