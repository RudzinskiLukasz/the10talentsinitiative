function PostImage({ src, alt }) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        decoding="async"
        className="mx-auto w-full max-w-2xl object-contain"
      />
    </figure>
  );
}

function renderTextBlock(content, key) {
  const paragraphs =
    typeof content === "string" ? content.split(/\n\n+/) : [content];

  return paragraphs.map((paragraph, index) => (
    <p key={`${key}-${index}`}>{paragraph}</p>
  ));
}

export default function ProseContent({ content, blocks, className = "" }) {
  if (blocks?.length) {
    return (
      <div
        className={`prose-site space-y-4 text-base leading-relaxed text-fg-muted ${className}`}
      >
        {blocks.map((block, index) => {
          if (block.type === "image") {
            return <PostImage key={index} src={block.src} alt={block.alt} />;
          }
          return renderTextBlock(block.content, index);
        })}
      </div>
    );
  }

  const paragraphs = typeof content === "string" ? content.split(/\n\n+/) : content;

  return (
    <div className={`prose-site space-y-4 text-base leading-relaxed text-fg-muted ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
