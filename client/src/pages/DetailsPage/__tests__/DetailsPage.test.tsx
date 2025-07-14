import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { type UseQueryResult } from "@tanstack/react-query";
import DetailsPage from "../DetailsPage";
import * as hooks from "../../../hooks/queries/useUrlDetailsQuery";
import type { UrlDetailResponse } from "../../../lib/types";

vi.mock("../../../hooks/queries/useUrlDetailsQuery");

const mockData: UrlDetailResponse = {
  id: 1,
  address: "http://example.com",
  status: "done",
  pageTitle: "Test Page",
  htmlVersion: "HTML5",
  hasLoginForm: true,
  headings: { h1: 1, h2: 2 },
  linksInternal: 5,
  linksExternal: 3,
  brokenLinks: [
    {
      id: 1,
      urlId: 1,
      urlResultId: 1,
      link: "http://broken.com",
      statusCode: 404,
    },
  ],
};

describe("DetailsPage", () => {
  beforeEach(() => {
    vi.mocked(hooks.useUrlDetailsQuery).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as UseQueryResult<UrlDetailResponse, Error>);
  });

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={["/urls/1"]}>
        <Routes>
          <Route path="/urls/:id" element={<DetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

  it("renders metadata and headings", () => {
    renderPage();
    expect(screen.getByText(/Test Page/i)).toBeInTheDocument();
    expect(screen.getByText(/HTML5/i)).toBeInTheDocument();
    expect(screen.getByText(/h1/i)).toBeInTheDocument();
  });

  it("renders broken links table", () => {
    renderPage();
    expect(screen.getByText("http://broken.com")).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
