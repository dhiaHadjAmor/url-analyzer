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
  ariaLabel?: string;
  variant?: "primary" | "outline" | "icon" | "danger";
  size?: "sm" | "md";
};

const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  testId = "button",
  ariaLabel,
  variant = "primary",
  size = "md",
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none cursor-pointer rounded-md";

  const sizeStyles = size === "sm" ? "p-1.5 text-sm" : "px-5 py-2";

  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      disabled || isLoading
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white",

    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50",

    icon: "border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40",

    danger:
      disabled || isLoading
        ? "bg-red-300 cursor-not-allowed text-white"
        : "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
