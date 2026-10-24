import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminCodeEditorPage from "./AdminCodeEditorPage.jsx";

vi.mock("../../lib/siteFilesApi.js", () => ({
  fetchSiteFiles: vi.fn(),
  saveSiteFile: vi.fn(),
  revertSiteFile: vi.fn(),
  migrationHint: (message) => message || "Could not save the file.",
}));

import { fetchSiteFiles } from "../../lib/siteFilesApi.js";

describe("AdminCodeEditorPage", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    fetchSiteFiles.mockReset();
    fetchSiteFiles.mockResolvedValue({
      "custom.css": {
        path: "custom.css",
        content: "body { color: red; }",
        previous_content: "body {}",
        updated_at: "2026-10-24T12:00:00.000Z",
      },
    });
  });

  it("opens the theme file editor on Additional CSS", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/code"]}>
        <AdminCodeEditorPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: "Theme File Editor" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update File" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Revert" })).toBeEnabled();
    expect(screen.getByRole("heading", { name: "custom.css" })).toBeInTheDocument();
    expect(document.querySelector(".cm-content")?.textContent).toContain("color: red");
  });
});
