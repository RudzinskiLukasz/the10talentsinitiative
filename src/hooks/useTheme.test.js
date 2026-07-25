import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme.js";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.removeAttribute("data-theme-variant");
  });

  it("reads the theme already applied on the document", () => {
    document.documentElement.setAttribute("data-theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("toggles theme and persists choice to localStorage", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("ttt-theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("ttt-theme")).toBe("dark");
  });

  it("updates theme-color meta tag when theme changes", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", "#0d0820");
    document.head.appendChild(meta);

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(meta.getAttribute("content")).toBe("#f7f3ec");
  });

  it("keeps multiple hook instances in sync when toggling", () => {
    const a = renderHook(() => useTheme());
    const b = renderHook(() => useTheme());

    expect(a.result.current.theme).toBe("dark");
    expect(b.result.current.theme).toBe("dark");

    act(() => {
      a.result.current.toggleTheme();
    });

    expect(a.result.current.theme).toBe("light");
    expect(b.result.current.theme).toBe("light");
  });
});
