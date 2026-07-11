"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Undo, Redo 
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
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

export default function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm max-w-none text-slate-200 focus:outline-none p-4 min-h-[300px] max-h-[600px] overflow-y-auto bg-[#081a3a] font-medium text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-black [&_h2]:text-lg [&_h2]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-[#F7B801] [&_blockquote]:pl-4 [&_blockquote]:italic",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync value changes from outside (e.g. form edits)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className="w-full text-white bg-[#081a3a] rounded-xl overflow-hidden shadow-inner border border-white/10 flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1 w-full" />
    </div>
  );
}
