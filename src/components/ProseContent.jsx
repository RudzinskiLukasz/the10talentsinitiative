export default function ProseContent({ content, className = "" }) {
  const paragraphs = typeof content === "string" ? content.split(/\n\n+/) : content;

  return (
    <div className={`prose-site space-y-4 text-base leading-relaxed text-fg-muted ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
