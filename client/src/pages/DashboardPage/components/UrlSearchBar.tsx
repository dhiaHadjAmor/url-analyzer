import React, { useState } from "react";
import { isValidUrl } from "../../../lib/utils";
import { useAnalyseUrlMutation } from "../../../queries/useAnalyseUrlMutation";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

const UrlSearchBar = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useAnalyseUrlMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = inputUrl.trim();

    if (!value) {
      setError("URL is required.");
      return;
    }

    if (!isValidUrl(value)) {
      setError("Please enter a valid URL (http or https).");
      return;
    }

    mutate(value, {
      onSuccess: () => {
        setInputUrl("");
      },
      onError: (err: Error) => {
        setError(err?.message || "Failed to analyze URL.");
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset error when user starts typing
    if (error) setError(null);

    setInputUrl(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start mb-6"
      aria-label="Submit a URL for analysis"
    >
      <div className="flex gap-x-4 mb-1 w-full items-start">
        <Input
          id="url-input"
          name="url"
          value={inputUrl}
          onChange={handleInputChange}
          placeholder="Enter a website URL…"
          error={error}
          required
        />
        <Button type="submit" isLoading={isPending}>
          Analyze
        </Button>
      </div>
    </form>
  );
};

export default UrlSearchBar;
