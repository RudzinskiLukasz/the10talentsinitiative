import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProseContent from "./ProseContent.jsx";

describe("ProseContent", () => {
  it("renders plain paragraphs from content", () => {
    render(<ProseContent content={"Hello\n\nWorld"} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("renders rich text, image, video, and safe embed", () => {
    const { container } = render(
      <ProseContent
        blocks={[
          {
            type: "rich",
            content: "Bold hello",
            doc: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "Bold ", marks: [{ type: "bold" }] },
                    { type: "text", text: "hello" },
                  ],
                },
              ],
            },
          },
          { type: "image", src: "https://example.com/a.jpg", alt: "Photo" },
          { type: "video", src: "https://example.com/a.mp4" },
          {
            type: "embed",
            provider: "youtube",
            url: "https://www.youtube.com/watch?v=abc123",
            embedUrl: "https://www.youtube.com/embed/abc123",
          },
        ]}
      />
    );

    expect(container.querySelector("strong")).toHaveTextContent("Bold");
    expect(screen.getByAltText("Photo")).toBeInTheDocument();
    expect(container.querySelector("video")).toHaveAttribute(
      "src",
      "https://example.com/a.mp4"
    );
    expect(container.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abc123"
    );
  });

  it("rejects unsafe embed URLs", () => {
    const { container } = render(
      <ProseContent
        blocks={[
          {
            type: "embed",
            provider: "evil",
            embedUrl: "https://evil.example/embed/1",
          },
        ]}
      />
    );
    expect(container.querySelector("iframe")).toBeNull();
  });
});
