import { AlertCircle } from "lucide-react";
import type { ChangeEvent } from "react";

type InputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string | null;
  required?: boolean;
};

const Input = ({
  id,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
  required = false,
}: InputProps) => {
  return (
    <div className="w-full sm:w-96 flex flex-col">
      <label htmlFor={id} className="sr-only">
        {name}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-500 mt-1 flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
