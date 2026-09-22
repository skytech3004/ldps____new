
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  Code,
  Code2,
  Eraser,
  Highlighter,
  ImagePlus,
  Indent,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Outdent,
  Palette,
  Quote,
  Redo,
  Rows3,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  enableImages?: boolean;
  uploadPage?: string;
  uploadSection?: string;
}

interface ToolbarButtonProps {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

function ToolbarButton({
  title,
  onClick,
  active = false,
  disabled = false,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`min - w - [34px] h - [34px] px - 2 rounded - lg flex items - center justify - center transition - all ${active
          ? "bg-[#F7B801] text-[#08152e] shadow-md"
          : "text-white/80 hover:bg-white/10 hover:text-white"
        } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"} `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-white/15 mx-1" />;
}

function MenuBar({
  editor,
  enableImages,
  onImageUpload,
  uploadingImage,
}: {
  editor: any;
  enableImages?: boolean;
  onImageUpload: () => void;
  uploadingImage: boolean;
}) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  if (!editor) return null;

  function addLink() {
    const currentHref = editor.getAttributes("link").href || "";

    setLinkUrl(currentHref);
    setShowLinkInput(true);
  }

  function applyLink() {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: linkUrl.trim(),
          target: "_blank",
          rel: "noopener noreferrer",
        })
        .run();
    }

    setShowLinkInput(false);
    setLinkUrl("");
  }

  function insertTable() {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  }

  const colors = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div className="relative bg-[#0c1833] border-b border-white/10 text-white select-none rounded-t-xl">
      <div className="flex flex-wrap items-center gap-1 px-3 py-2">
        {/* Undo / Redo */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo size={17} />
        </ToolbarButton>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Inline Code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Clear Formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <Eraser size={17} />
        </ToolbarButton>

        <Divider />

        {/* Heading */}
        <select
          title="Heading"
          value={
            editor.isActive("heading")
              ? String(editor.getAttributes("heading").level)
              : "paragraph"
          }
          onChange={(event) => {
            const value = event.target.value;

            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6,
                })
                .run();
            }
          }}
          className="h-[34px] bg-[#081a3a] border border-white/10 rounded-lg px-2 text-sm text-white outline-none cursor-pointer"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Ordered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Task List"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare size={18} />
        </ToolbarButton>

        <ToolbarButton
          title="Decrease Indent"
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        >
          <Outdent size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Increase Indent"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        >
          <Indent size={17} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Align Left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Align Center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Align Right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={17} />
        </ToolbarButton>

        <Divider />

        {/* Block */}
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Code Block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={17} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title="Add / Edit Link"
          active={editor.isActive("link")}
          onClick={addLink}
        >
          <LinkIcon size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Remove Link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink size={17} />
        </ToolbarButton>

        {/* Text color */}
        <div className="relative">
          <ToolbarButton
            title="Text Color"
            active={showTextColor}
            onClick={() => {
              setShowTextColor(!showTextColor);
              setShowHighlight(false);
            }}
          >
            <Palette size={17} />
          </ToolbarButton>

          {showTextColor && (
            <div className="absolute top-10 left-0 z-50 bg-[#0c1833] border border-white/10 rounded-xl p-2 shadow-2xl flex gap-1 flex-wrap w-[180px]">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowTextColor(false);
                  }}
                  className="w-7 h-7 rounded-md border border-white/20 cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <ToolbarButton
            title="Highlight"
            active={showHighlight}
            onClick={() => {
              setShowHighlight(!showHighlight);
              setShowTextColor(false);
            }}
          >
            <Highlighter size={17} />
          </ToolbarButton>

          {showHighlight && (
            <div className="absolute top-10 left-0 z-50 bg-[#0c1833] border border-white/10 rounded-xl p-2 shadow-2xl flex gap-1 flex-wrap w-[180px]">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setShowHighlight(false);
                  }}
                  className="w-7 h-7 rounded-md border border-white/20 cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <ToolbarButton
          title="Superscript"
          active={editor.isActive("superscript")}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperscriptIcon size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Subscript"
          active={editor.isActive("subscript")}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon size={17} />
        </ToolbarButton>

        <Divider />

        {/* Table */}
        <ToolbarButton title="Insert Table" onClick={insertTable}>
          <TableIcon size={17} />
        </ToolbarButton>

        {editor.isActive("table") && (
          <>
            <ToolbarButton
              title="Add Row"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Rows3 size={17} />
            </ToolbarButton>

            <ToolbarButton
              title="Delete Row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <Rows3 size={17} />
            </ToolbarButton>

            <ToolbarButton
              title="Delete Table"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <TableIcon size={17} />
            </ToolbarButton>
          </>
        )}

        {/* Image */}
        {enableImages !== false && (
          <>
            <Divider />

            <ToolbarButton
              title="Insert Image"
              disabled={uploadingImage}
              onClick={onImageUpload}
            >
              {uploadingImage ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <ImagePlus size={17} />
              )}
            </ToolbarButton>
          </>
        )}
      </div>

      {/* Link popup */}
      {showLinkInput && (
        <div className="absolute z-50 left-3 top-full mt-1 bg-[#0c1833] border border-white/10 rounded-xl p-3 shadow-2xl flex gap-2">
          <input
            autoFocus
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyLink();
              }

              if (event.key === "Escape") {
                setShowLinkInput(false);
              }
            }}
            placeholder="https://example.com"
            className="w-[260px] h-9 rounded-lg bg-[#081a3a] border border-white/10 px-3 text-sm text-white outline-none"
          />

          <button
            type="button"
            onClick={applyLink}
            className="px-3 h-9 rounded-lg bg-[#F7B801] text-[#08152e] font-bold"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  enableImages = true,
  uploadPage = "home",
  uploadSection = "gallery",
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),

      Underline,

      TextStyle,

      Color.configure({
        types: ["textStyle"],
      }),

      Highlight.configure({
        multicolor: true,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-[#F7B801] underline",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right", "justify"],
      }),

      Subscript,

      Superscript,

      TaskList,

      TaskItem.configure({
        nested: true,
      }),

      Table.configure({
        resizable: true,
      }),

      TableRow,

      TableHeader,

      TableCell,

      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),

      CharacterCount.configure({
        limit: 100000,
      }),

      Image.configure({
        allowBase64: false,
        inline: false,
        HTMLAttributes: {
          class:
            "rounded-xl shadow-lg max-w-full h-auto mx-auto cursor-pointer",
        },
      }),
    ],

    content: value || "",

    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none text-slate-200 focus:outline-none p-4 min-h-[300px] max-h-[600px] overflow-y-auto bg-[#081a3a] font-medium text-sm leading-relaxed " +
          "[&_ul]:list-disc [&_ul]:pl-5 " +
          "[&_ol]:list-decimal [&_ol]:pl-5 " +
          "[&_h1]:text-3xl [&_h1]:font-black " +
          "[&_h2]:text-2xl [&_h2]:font-bold " +
          "[&_h3]:text-xl [&_h3]:font-bold " +
          "[&_h4]:text-lg [&_h4]:font-bold " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-[#F7B801] [&_blockquote]:pl-4 [&_blockquote]:italic " +
          "[&_a]:text-[#F7B801] [&_a]:underline " +
          "[&_img]:rounded-xl [&_img]:shadow-lg [&_img]:max-w-full [&_img]:h-auto " +
          "[&_table]:border-collapse [&_table]:w-full " +
          "[&_td]:border [&_td]:border-white/20 [&_td]:p-2 " +
          "[&_th]:border [&_th]:border-white/20 [&_th]:p-2 [&_th]:bg-white/10 " +
          "[&_code]:bg-black/30 [&_code]:rounded [&_code]:px-1 " +
          "[&_pre]:bg-black/40 [&_pre]:rounded-xl [&_pre]:p-4 " +
          "[&_.is-editor-empty:first-child::before]:text-white/30 " +
          "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] " +
          "[&_.is-editor-empty:first-child::before]:float-left " +
          "[&_.is-editor-empty:first-child::before]:pointer-events-none",
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();

    if (value !== currentHTML) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  async function uploadImageFile(file: File) {
    const formData = new FormData();

    formData.set("file", file);
    formData.set("page", uploadPage);
    formData.set("section", uploadSection);
    formData.set("title", file.name || "Editor Image");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Upload failed.");
    }

    return String(data.upload?.src ?? "");
  }

  async function insertImage(src: string) {
    if (!editor || !src) return;

    editor
      .chain()
      .focus()
      .setImage({
        src,
        alt: "Editor image",
      })
      .run();
  }

  async function handleImageUpload() {
    if (!editor) return;

    const choice = window.prompt(
      "Type 1 to upload an image, or 2 to insert an image URL."
    );

    if (choice === "1") {
      fileInputRef.current?.click();
      return;
    }

    if (choice === "2") {
      const url = window.prompt("Enter image URL:");

      if (url?.trim()) {
        await insertImage(url.trim());
      }
    }
  }

  async function handleFileSelected(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !editor) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select a valid image file.");
      return;
    }

    try {
      setUploadingImage(true);

      const src = await uploadImageFile(file);

      if (src) {
        await insertImage(src);
      } else {
        throw new Error("Upload completed but no image URL was returned.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Image upload failed.";

      window.alert(message);
    } finally {
      setUploadingImage(false);
    }
  }

  if (!editor) {
    return (
      <div className="w-full min-h-[350px] rounded-xl bg-[#081a3a] border border-white/10 flex items-center justify-center">
        <Loader2 className="animate-spin text-white/60" />
      </div>
    );
  }

  const words = editor.storage.characterCount?.words?.() ?? 0;
  const characters =
    editor.storage.characterCount?.characters?.() ?? 0;

  return (
    <div className="w-full text-white bg-[#081a3a] rounded-xl overflow-hidden shadow-inner border border-white/10 flex flex-col">
      <MenuBar
        editor={editor}
        enableImages={enableImages}
        onImageUpload={handleImageUpload}
        uploadingImage={uploadingImage}
      />

      <div className="flex-1 w-full">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-white/10 bg-[#0c1833] text-xs text-white/40">
        <span>Words: {words}</span>
        <span>Characters: {characters}</span>
      </div>

      {enableImages !== false && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />
      )}
    </div>
  );
}
```
