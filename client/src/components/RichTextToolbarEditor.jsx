import React, { useEffect, useRef, useState } from "react";
import { toRichTextHtml } from "../utils/richText";

const TEXT_COLORS = ["#000000", "#c62828", "#1565c0", "#2e7d32", "#ef6c00"];
const HIGHLIGHT_COLORS = [
  "#fff59d",
  "#ffcc80",
  "#c8e6c9",
  "#bbdefb",
  "#e1bee7",
];

const RichTextToolbarEditor = ({
  value,
  onChange,
  minHeight = 120,
  toolbarClassName = "flex flex-wrap gap-1 bg-gray-200 p-1 print:hidden",
  editorClassName = "border border-black p-2 text-xs outline-none",
}) => {
  const editorRef = useRef(null);
  const rangeRef = useRef(null);
  const [textColor, setTextColor] = useState(TEXT_COLORS[0]);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextHtml = toRichTextHtml(value);
    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    if (editorRef.current.contains(range.commonAncestorContainer)) {
      rangeRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !rangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(rangeRef.current);
  };

  const syncHtml = () => {
    if (onChange) {
      onChange(editorRef.current?.innerHTML || "");
    }
  };

  const focusEditor = () => {
    editorRef.current?.focus();
    restoreSelection();
  };

  const runCommand = (command, commandValue = null) => {
    focusEditor();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, commandValue);
    saveSelection();
    syncHtml();
  };

  return (
    <div className="border border-black">
      <div className={toolbarClassName}>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("bold")}
          className="px-2 py-1 border border-black bg-white text-xs font-bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("italic")}
          className="px-2 py-1 border border-black bg-white text-xs italic"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("underline")}
          className="px-2 py-1 border border-black bg-white text-xs underline"
        >
          U
        </button>
        <span className="px-1 text-[11px] font-semibold text-slate-600">
          Text
        </span>
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setTextColor(color);
              runCommand("foreColor", color);
            }}
            className={`flex h-6 min-w-6 items-center justify-center border border-black bg-white px-1 text-[11px] font-bold ${
              textColor === color ? "ring-2 ring-blue-400" : ""
            }`}
            style={{ color }}
            title="Text color"
          >
            A
          </button>
        ))}
        <input
          type="color"
          value={textColor}
          onChange={(event) => {
            setTextColor(event.target.value);
            runCommand("foreColor", event.target.value);
          }}
          title="Custom text color"
          className="h-6 w-8 border border-black bg-white"
        />
        <span className="px-1 text-[11px] font-semibold text-slate-600">
          Highlight
        </span>
        {HIGHLIGHT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setHighlightColor(color);
              runCommand("hiliteColor", color);
            }}
            className={`h-6 w-6 border border-black ${
              highlightColor === color ? "ring-2 ring-blue-400" : ""
            }`}
            style={{ backgroundColor: color }}
            title="Highlight color"
          />
        ))}
        <input
          type="color"
          value={highlightColor}
          onChange={(event) => {
            setHighlightColor(event.target.value);
            runCommand("hiliteColor", event.target.value);
          }}
          title="Custom highlight color"
          className="h-6 w-8 border border-black bg-white"
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncHtml}
        onBlur={syncHtml}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onFocus={saveSelection}
        className={editorClassName}
        style={{ minHeight }}
      />
    </div>
  );
};

export default RichTextToolbarEditor;
