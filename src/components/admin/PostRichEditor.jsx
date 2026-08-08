import { useCallback, useRef } from "react";
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Node, mergeAttributes } from "@tiptap/core";
import { blocksToTipTapDoc, parseVideoEmbed, tipTapDocToBlocks } from "../../lib/postBlocks.js";
import { uploadPostImage, uploadPostVideo } from "../../lib/postsApi.js";

function VideoView({ node, deleteNode }) {
  return (
    <NodeViewWrapper className="my-3 overflow-hidden rounded-xl border border-border bg-bg">
      <video
        src={node.attrs.src}
        poster={node.attrs.poster || undefined}
        controls
        className="max-h-64 w-full bg-black object-contain"
      />
      <div className="flex justify-end p-2">
        <button
          type="button"
          onClick={deleteNode}
          className="text-xs font-semibold text-red-400 hover:underline"
        >
          Remove video
        </button>
      </div>
    </NodeViewWrapper>
  );
}

function EmbedView({ node, deleteNode }) {
  return (
    <NodeViewWrapper className="my-3 overflow-hidden rounded-xl border border-border bg-bg">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          title={`${node.attrs.provider} embed`}
          src={node.attrs.embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-2 p-2">
        <span className="truncate text-xs text-fg-subtle">{node.attrs.url}</span>
        <button
          type="button"
          onClick={deleteNode}
          className="shrink-0 text-xs font-semibold text-red-400 hover:underline"
        >
          Remove
        </button>
      </div>
    </NodeViewWrapper>
  );
}

function ImageView({ node, updateAttributes, deleteNode }) {
  return (
    <NodeViewWrapper className="my-3 overflow-hidden rounded-xl border border-border bg-bg">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        className="max-h-64 w-full object-contain"
      />
      <div className="flex flex-wrap items-center gap-2 p-2">
        <input
          type="text"
          value={node.attrs.alt || ""}
          onChange={(e) => updateAttributes({ alt: e.target.value })}
          placeholder="Alt text"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-fg outline-none ring-ring focus:ring-1"
        />
        <button
          type="button"
          onClick={deleteNode}
          className="text-xs font-semibold text-red-400 hover:underline"
        >
          Remove
        </button>
      </div>
    </NodeViewWrapper>
  );
}

const EditorImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

const EditorVideo = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      poster: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes, { controls: "true" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
  addCommands() {
    return {
      setVideo:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

const EditorEmbed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      provider: { default: "youtube" },
      url: { default: "" },
      embedUrl: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-embed]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-embed": "true" }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(EmbedView);
  },
  addCommands() {
    return {
      setEmbed:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

function ToolbarButton({ active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-accent/20 text-accent"
          : "text-fg-muted hover:bg-surface-hover hover:text-fg"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

/**
 * Visual post body editor (TipTap). Emits blocks[] via onChange.
 */
export default function PostRichEditor({
  blocks,
  slug,
  onChange,
  onUploadingChange,
  onError,
}) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      EditorImage.configure({ inline: false, allowBase64: false }),
      EditorVideo,
      EditorEmbed,
      Placeholder.configure({
        placeholder: "Write your post… Use the toolbar for formatting and media.",
      }),
    ],
    content: blocksToTipTapDoc(blocks),
    editorProps: {
      attributes: {
        class:
          "post-rich-editor min-h-[280px] max-w-none px-4 py-3 text-sm leading-relaxed text-fg outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(tipTapDocToBlocks(ed.getJSON()));
    },
  });

  const setUploading = useCallback(
    (value) => onUploadingChange?.(value),
    [onUploadingChange]
  );

  const reportError = useCallback(
    (message) => onError?.(message),
    [onError]
  );

  async function handleImageFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    try {
      const url = await uploadPostImage(file, { slug: slug || "uploads" });
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch (err) {
      reportError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    try {
      const url = await uploadPostVideo(file, { slug: slug || "uploads" });
      editor.chain().focus().setVideo({ src: url }).run();
    } catch (err) {
      reportError(err.message || "Video upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleEmbed() {
    if (!editor) return;
    const raw = window.prompt("Paste a YouTube or Vimeo URL:");
    if (!raw) return;
    const embed = parseVideoEmbed(raw);
    if (!embed) {
      reportError("Only YouTube and Vimeo URLs are supported.");
      return;
    }
    editor.chain().focus().setEmbed(embed).run();
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) {
    return <p className="text-sm text-fg-muted">Loading editor…</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg">
      <div className="flex flex-wrap items-center gap-1 border-b border-border-subtle bg-surface px-2 py-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border-subtle" aria-hidden />
        <ToolbarButton onClick={() => imageInputRef.current?.click()}>
          Image
        </ToolbarButton>
        <ToolbarButton onClick={() => videoInputRef.current?.click()}>
          Video
        </ToolbarButton>
        <ToolbarButton onClick={handleEmbed}>Embed</ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoFile}
      />
    </div>
  );
}
