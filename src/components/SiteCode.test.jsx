import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteCodeProvider, SiteCodeSlot } from "./SiteCode.jsx";

vi.mock("../lib/siteFilesApi.js", () => ({
  fetchSiteFiles: vi.fn(),
  SITE_FILES_UPDATED_EVENT: "ttt-site-files-updated",
}));

import { fetchSiteFiles } from "../lib/siteFilesApi.js";

function renderSlots(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <SiteCodeProvider>
        <SiteCodeSlot name="header" />
        <SiteCodeSlot name="page" />
        <SiteCodeSlot name="footer" />
      </SiteCodeProvider>
    </MemoryRouter>
  );
}

describe("SiteCode", () => {
  beforeEach(() => {
    fetchSiteFiles.mockReset();
    document.getElementById("site-custom-css")?.remove();
    document.getElementById("site-custom-js")?.remove();
    document.head.querySelectorAll("[data-site-code-head]").forEach((node) => node.remove());
  });

  it("renders saved header, page, and footer HTML on the matching route", async () => {
    fetchSiteFiles.mockResolvedValue({
      "custom.css": { path: "custom.css", content: ".banner { color: gold; }" },
      "header.html": { path: "header.html", content: "<p>Live banner</p>" },
      "footer.html": { path: "footer.html", content: "<p>Live footer note</p>" },
      "pages/home.html": { path: "pages/home.html", content: "<p>Home extra section</p>" },
      "pages/programs.html": {
        path: "pages/programs.html",
        content: "<p>Programs extra</p>",
      },
    });

    renderSlots("/");

    expect(await screen.findByText("Live banner")).toBeInTheDocument();
    expect(screen.getByText("Home extra section")).toBeInTheDocument();
    expect(screen.getByText("Live footer note")).toBeInTheDocument();
    expect(screen.queryByText("Programs extra")).not.toBeInTheDocument();
    expect(document.getElementById("site-custom-css")?.textContent).toContain(".banner");
  });

  it("leaves the page unchanged when no theme files are saved", async () => {
    fetchSiteFiles.mockResolvedValue({});
    const { container } = renderSlots("/contact");
    await vi.waitFor(() => expect(fetchSiteFiles).toHaveBeenCalled());
    expect(container.querySelector("[data-site-code]")).toBeNull();
    expect(document.getElementById("site-custom-css")).toBeNull();
  });
});
