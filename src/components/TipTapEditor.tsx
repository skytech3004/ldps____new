"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImagePlus,
  Loader2,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  enableImages?: boolean;
  uploadPage?: string;
  uploadSection?: string;
}

const MenuBar = ({
  editor,
  enableImages,
  onImageUpload,
  uploadingImage,
}: {
  editor: any;
  enableImages?: boolean;
  onImageUpload: () => void;
  uploadingImage: boolean;
}) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: Bold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: Strikethrough,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: Quote,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-900 border-b border-white/10 text-white select-none">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            title={btn.title}
            className={`p-2 rounded-lg transition-colors cursor-pointer hover:bg-white/10 ${
              btn.isActive ? "bg-[#F7B801] text-slate-950 font-bold" : "text-white/80"
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}

      {enableImages !== false ? (
        <>
          <div className="w-[1px] h-6 bg-white/10 self-center mx-1" />
          <button
            type="button"
            onClick={onImageUpload}
            disabled={uploadingImage}
            title="Insert Image"
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 cursor-pointer inline-flex items-center gap-1"
          >
            {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          </button>
        </>
      ) : null}

      <div className="w-[1px] h-6 bg-white/10 self-center mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo"
        className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
        className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function TipTapEditor({
  value,
  onChange,
  placeholder,
  enableImages = true,
  uploadPage = "home",
  uploadSection = "gallery",
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl shadow-lg max-w-full h-auto mx-auto",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none text-slate-200 focus:outline-none p-4 min-h-[300px] max-h-[600px] overflow-y-auto bg-[#081a3a] font-medium text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-black [&_h2]:text-lg [&_h2]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-[#F7B801] [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
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

    return String(data.upload.src ?? "");
  }

  async function handleImageUpload() {
    if (!editor) return;

    const useFileUpload = window.confirm("Click OK to upload an image file, or Cancel to paste an image URL.");
    if (useFileUpload) {
      fileInputRef.current?.click();
      return;
    }

    const url = window.prompt("Enter image URL:");
    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;

    try {
      setUploadingImage(true);
      const src = await uploadImageFile(file);
      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed.";
      window.alert(message);
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="w-full text-white bg-[#081a3a] rounded-xl overflow-hidden shadow-inner border border-white/10 flex flex-col">
      <MenuBar
        editor={editor}
        enableImages={enableImages}
        onImageUpload={handleImageUpload}
        uploadingImage={uploadingImage}
      />
      <EditorContent editor={editor} className="flex-1 w-full" />
      {enableImages !== false ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />
      ) : null}
    </div>
  );
}
