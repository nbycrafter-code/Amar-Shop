// components/TipTapEditor.tsx
"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Trash2,
  PlusSquare,
  MinusSquare,
  CornerDownLeft,
  Undo2,
  Redo2,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

// ─── Toolbar Button ──────────────────────────────────────────────────────────
const ToolbarBtn = ({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-md transition-all text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed ${
      active ? "bg-indigo-100 text-indigo-700" : ""
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

// ─── Main Editor ─────────────────────────────────────────────────────────────
const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = "লিখুন...",
  disabled = false,
  minHeight = "140px",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (reset form)
  React.useEffect(() => {
    if (editor && value === "") {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL লিখুন:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) return null;

  const isTableActive = editor.isActive("table");

  return (
    <div
      className={`tiptap-wrapper rounded-xl border border-gray-200 overflow-hidden bg-white ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
        {/* Undo / Redo */}
        <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Headings */}
        <ToolbarBtn
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Formatting */}
        <ToolbarBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn title="Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        {/* Horizontal Rule */}
        <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* ── Table Controls ──────────────────────────────────────────── */}
        <ToolbarBtn title="টেবিল যোগ করুন" active={isTableActive} onClick={insertTable}>
          <TableIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>

        {isTableActive && (
          <>
            {/* Add column */}
            <ToolbarBtn
              title="ডানে কলাম যোগ করুন"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <PlusSquare className="w-3.5 h-3.5" />
                <span>Col</span>
              </div>
            </ToolbarBtn>

            {/* Remove column */}
            <ToolbarBtn
              title="কলাম মুছুন"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <MinusSquare className="w-3.5 h-3.5" />
                <span>Col</span>
              </div>
            </ToolbarBtn>

            {/* Add row */}
            <ToolbarBtn
              title="নিচে সারি যোগ করুন"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <PlusSquare className="w-3.5 h-3.5" />
                <span>Row</span>
              </div>
            </ToolbarBtn>

            {/* Remove row */}
            <ToolbarBtn
              title="সারি মুছুন"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <MinusSquare className="w-3.5 h-3.5" />
                <span>Row</span>
              </div>
            </ToolbarBtn>

            {/* Merge / Split cells */}
            <ToolbarBtn
              title="সেল মার্জ / স্প্লিট করুন"
              onClick={() => editor.chain().focus().mergeOrSplit().run()}
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </ToolbarBtn>

            {/* Delete table */}
            <ToolbarBtn
              title="টেবিল মুছুন"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </ToolbarBtn>
          </>
        )}
      </div>

      {/* ── Editor Area ──────────────────────────────────────────────────── */}
      <style>{`
        .tiptap-wrapper .ProseMirror {
          min-height: ${minHeight};
          padding: 12px 14px;
          outline: none;
          font-size: 14px;
          line-height: 1.7;
          color: #111827;
        }
        .tiptap-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .tiptap-wrapper .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin: 10px 0 6px; }
        .tiptap-wrapper .ProseMirror h2 { font-size: 1.25rem; font-weight: 700; margin: 8px 0 5px; }
        .tiptap-wrapper .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 6px 0 4px; }
        .tiptap-wrapper .ProseMirror ul { list-style: disc; padding-left: 20px; margin: 4px 0; }
        .tiptap-wrapper .ProseMirror ol { list-style: decimal; padding-left: 20px; margin: 4px 0; }
        .tiptap-wrapper .ProseMirror li { margin: 2px 0; }
        .tiptap-wrapper .ProseMirror a { color: #6366f1; text-decoration: underline; }
        .tiptap-wrapper .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 12px 0; }
        .tiptap-wrapper .ProseMirror strong { font-weight: 700; }
        .tiptap-wrapper .ProseMirror em { font-style: italic; }
        .tiptap-wrapper .ProseMirror s { text-decoration: line-through; }
        /* ── Table Styles ── */
        .tiptap-wrapper .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .tiptap-wrapper .ProseMirror th {
          background: #f3f4f6;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          text-align: left;
        }
        .tiptap-wrapper .ProseMirror td {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          font-size: 13px;
          color: #111827;
          vertical-align: top;
        }
        .tiptap-wrapper .ProseMirror tr:nth-child(even) td { background: #f9fafb; }
        .tiptap-wrapper .ProseMirror .selectedCell::after {
          background: rgba(99, 102, 241, 0.15);
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
        .tiptap-wrapper .ProseMirror .column-resize-handle {
          background-color: #6366f1;
          bottom: -2px;
          pointer-events: none;
          position: absolute;
          right: -2px;
          top: 0;
          width: 3px;
        }
        .tiptap-wrapper .ProseMirror .tableWrapper {
          overflow-x: auto;
        }
      `}</style>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;