/**
 * Safe React renderer for TipTap-like JSON and CMS blocks.
 * Never uses dangerouslySetInnerHTML — whitelist only.
 */

function renderMarks(text, marks, key) {
  let node = text;
  if (!Array.isArray(marks)) return <span key={key}>{node}</span>;

  for (const mark of marks) {
    if (mark.type === "bold") {
      node = <strong key={`${key}-b`}>{node}</strong>;
    } else if (mark.type === "italic") {
      node = <em key={`${key}-i`}>{node}</em>;
    } else if (mark.type === "code") {
      node = (
        <code
          key={`${key}-c`}
          className="rounded bg-surface px-1 py-0.5 text-[0.9em]"
        >
          {node}
        </code>
      );
    } else if (mark.type === "link" && mark.attrs?.href) {
      const href = String(mark.attrs.href);
      if (!/^https?:\/\//i.test(href) && !href.startsWith("/")) continue;
      node = (
        <a
          key={`${key}-a`}
          href={href}
          className="text-primary-soft underline underline-offset-2 hover:text-accent"
          rel="noopener noreferrer"
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {node}
        </a>
      );
    }
  }

  return <span key={key}>{node}</span>;
}

function renderInline(nodes, keyPrefix) {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.type === "text") {
      return renderMarks(node.text || "", node.marks, key);
    }
    if (node.type === "hardBreak") {
      return <br key={key} />;
    }
    return null;
  });
}

function renderListItems(items, keyPrefix, ordered) {
  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered
    ? "my-4 list-decimal space-y-2 pl-6"
    : "my-4 list-disc space-y-2 pl-6";

  return (
    <ListTag className={listClass} key={keyPrefix}>
      {(items || []).map((item, index) => (
        <li key={`${keyPrefix}-${index}`}>
          {(item.content || []).map((child, cIndex) =>
            renderRichNode(child, `${keyPrefix}-${index}-${cIndex}`)
          )}
        </li>
      ))}
    </ListTag>
  );
}

function renderRichNode(node, key) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="my-3">
          {renderInline(node.content, key)}
        </p>
      );
    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      const Tag = level === 3 ? "h3" : "h2";
      const className =
        level === 3
          ? "font-display mt-6 mb-2 text-xl font-semibold text-fg"
          : "font-display mt-8 mb-3 text-2xl font-semibold text-fg";
      return (
        <Tag key={key} className={className}>
          {renderInline(node.content, key)}
        </Tag>
      );
    }
    case "bulletList":
      return renderListItems(node.content, key, false);
    case "orderedList":
      return renderListItems(node.content, key, true);
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-4 border-l-4 border-accent/40 pl-4 text-fg-muted italic"
        >
          {(node.content || []).map((child, i) =>
            renderRichNode(child, `${key}-bq-${i}`)
          )}
        </blockquote>
      );
    case "horizontalRule":
      return <hr key={key} className="my-8 border-border" />;
    case "codeBlock":
      return (
        <pre
          key={key}
          className="my-4 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm"
        >
          <code>{plainFromNodes(node.content)}</code>
        </pre>
      );
    default:
      return null;
  }
}

function plainFromNodes(nodes) {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .map((n) => {
      if (n.type === "text") return n.text || "";
      return plainFromNodes(n.content);
    })
    .join("");
}

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

function PostVideo({ src, poster }) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <video
        src={src}
        poster={poster || undefined}
        controls
        playsInline
        className="mx-auto w-full max-w-2xl bg-black"
      />
    </figure>
  );
}

function PostEmbed({ embedUrl, provider, url }) {
  if (!embedUrl || !/^https:\/\/(www\.youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(embedUrl)) {
    return null;
  }

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          title={provider === "vimeo" ? "Vimeo video" : "YouTube video"}
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {url ? (
        <figcaption className="truncate px-3 py-2 text-xs text-fg-subtle">
          {url}
        </figcaption>
      ) : null}
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

function renderRichBlock(block, key) {
  const nodes = block.doc?.content;
  if (Array.isArray(nodes) && nodes.length) {
    return nodes.map((node, index) => renderRichNode(node, `${key}-${index}`));
  }
  return renderTextBlock(block.content || "", key);
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
          if (block.type === "video") {
            return (
              <PostVideo key={index} src={block.src} poster={block.poster} />
            );
          }
          if (block.type === "embed") {
            return (
              <PostEmbed
                key={index}
                embedUrl={block.embedUrl}
                provider={block.provider}
                url={block.url}
              />
            );
          }
          if (block.type === "rich") {
            return (
              <div key={index} className="space-y-1">
                {renderRichBlock(block, index)}
              </div>
            );
          }
          return (
            <div key={index} className="space-y-4">
              {renderTextBlock(block.content, index)}
            </div>
          );
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
