import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../DashboardPage";
import * as queries from "../../../hooks/queries/useUrlsQuery";
import * as analyseHook from "../../../hooks/mutations/useAnalyseUrlMutation";
import * as deleteHook from "../../../hooks/mutations/useDeleteUrlsMutation";
import {
  QueryClient,
  QueryClientProvider,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { UrlEntry, UrlsResponse } from "../../../lib/types";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Potential refactor: create __mocks__ directory for mock data
const mockUrls: UrlEntry[] = [
  {
    id: 1,
    address: "http://example.com",
    status: "done",
    created_at: 123456,
    result: {
      pageTitle: "Example",
      htmlVersion: "HTML5",
      linksInternal: 10,
      linksExternal: 3,
      brokenLinks: [],
      hasLoginForm: false,
      headingLevels: { h1: 1, h2: 2 },
    },
  },
];

const renderDashboard = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(queries, "useUrlsQuery").mockReturnValue({
      data: { data: mockUrls, meta: { page: 1, limit: 10, total: 1 } },
      isPending: false,
      isError: false,
    } as UseQueryResult<UrlsResponse, Error>);

    vi.spyOn(analyseHook, "useAnalyseUrlMutation").mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<UrlEntry, Error, string>);

    vi.spyOn(deleteHook, "useDeleteUrlsMutation").mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<unknown, Error, number[]>);

    renderDashboard();
  });

  it("displays error for invalid URL input", async () => {
    const input = screen.getByPlaceholderText(/enter a website url/i);
    const button = screen.getByRole("button", { name: /analyze/i });

    fireEvent.change(input, { target: { value: "not a url" } });
    fireEvent.click(button);

    expect(
      await screen.findByText(/please enter a valid url/i)
    ).toBeInTheDocument();
  });

  it("start analyse after submitting a valid URL", async () => {
    const mutateMock = vi.fn();

    vi.spyOn(analyseHook, "useAnalyseUrlMutation").mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof analyseHook.useAnalyseUrlMutation>); // Cast as any to bypass type issues

    const input = screen.getByPlaceholderText(/enter a website url/i);
    const button = screen.getByRole("button", { name: /analyze/i });

    fireEvent.change(input, { target: { value: "http://valid.com" } });
    fireEvent.click(button);

    expect(mutateMock).toHaveBeenCalled();
  });

  it("disables bulk actions when no checkbox is selected", () => {
    expect(screen.getByRole("button", { name: /re-run/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /stop/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("deletes url after clicking delete", async () => {
    const deleteMock = vi.fn((_, { onSuccess }) => onSuccess?.());

    vi.spyOn(deleteHook, "useDeleteUrlsMutation").mockReturnValue({
      mutate: deleteMock,
      isPending: false,
    } as unknown as ReturnType<typeof deleteHook.useDeleteUrlsMutation>);

    const checkbox = screen.getAllByRole("checkbox")[1]; // skip "select all" checkbox
    fireEvent.click(checkbox);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalled();
    });
  });
});
