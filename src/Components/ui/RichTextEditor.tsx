import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import { PRIMARY } from "../../config/antdTheme";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  height = 500,
}) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start composing your professional document...",
      height: height,
      toolbarButtonSize: "middle",
      theme: "default",
      saveModeInCookie: false,
      spellcheck: true,
      link: {
        followOnHotkeys: true,
      },
      // GOD-MODE: Using extraButtons for custom MS Word style controls
      extraButtons: [
        {
          name: "plus",
          tooltip: "Increase Font Size",
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/><text x="2" y="18" font-family="Arial" font-size="12" font-weight="bold" stroke="none" fill="currentColor">A</text></svg>',
          exec: (editor: any) => {
            const current = editor.s.style("fontSize") || "14px";
            const newSize = (parseInt(current) || 14) + 2;
            editor.s.applyStyle({ fontSize: newSize + "px" });
          },
        },
        {
          name: "minus",
          tooltip: "Decrease Font Size",
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><text x="2" y="18" font-family="Arial" font-size="12" font-weight="bold" stroke="none" fill="currentColor">A</text></svg>',
          exec: (editor: any) => {
            const current = editor.s.style("fontSize") || "14px";
            const newSize = Math.max(8, (parseInt(current) || 14) - 2);
            editor.s.applyStyle({ fontSize: newSize + "px" });
          },
        },
      ],
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "plus",
        "minus",
        "fontsize",
        "font",
        "paragraph",
        "|",
        "brush",
        "|",
        "superscript",
        "subscript",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "image",
        "video",
        "file",
        "table",
        "link",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "symbol",
        "fullsize",
        "print",
        "|",
        "find",
        "selectall",
      ],
      list: {
        fontsize: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
      },
      askBeforePasteHTML: false,
      askBeforePasteFromWord: true,
      defaultActionOnPaste: "insert_as_html",
      width: "auto",
      minHeight: 300,
      maxHeight: 1500,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: true,
      allowResizeY: true,
      table: {
        allowEditing: true,
        allowCellSelection: true,
        allowMultiCellSelection: true,
      },
      uploader: {
        insertImageAsBase64URI: true,
      },
      style: {
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        fontSize: "14px",
      },
      commandToHotkeys: {
        bold: "ctrl+b",
        italic: "ctrl+i",
        underline: "ctrl+u",
        undo: "ctrl+z",
        redo: "ctrl+y",
        find: "ctrl+f",
      },
      cleanHTML: {
        fillEmptyParagraph: true,
        removeEmptyNodes: false,
      },
    }),
    [placeholder, height]
  );

  return (
    <div className="rich-text-editor-wrapper shadow-sm rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
      <JoditEditor
        ref={editor}
        value={value}
        config={config as any}
        onBlur={(newContent) => onChange(newContent)}
        onChange={() => {}}
      />
      <style>{`
        .rich-text-editor-wrapper .jodit-container {
          border: none !important;
        }
        .rich-text-editor-wrapper .jodit-toolbar__box {
          background-color: #ffffff !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 8px !important;
        }
        .rich-text-editor-wrapper .jodit-toolbar-button {
          border-radius: 6px !important;
          transition: all 0.2s !important;
        }
        .rich-text-editor-wrapper .jodit-toolbar-button:hover {
          background-color: #f1f5f9 !important;
        }
        .rich-text-editor-wrapper .jodit-status-bar {
          background-color: #f8fafc !important;
          border-top: 1px solid #f1f5f9 !important;
          padding: 6px 12px !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          color: #64748b !important;
        }
        .rich-text-editor-wrapper .jodit-wysiwyg {
          padding: 30px !important;
          background-color: #fff !important;
          line-height: 1.6 !important;
        }
        .rich-text-editor-wrapper:focus-within {
          border-color: ${PRIMARY} !important;
          box-shadow: 0 0 0 3px ${PRIMARY}20 !important;
        }
        /* Style to ensure custom SVG icons look correct */
        .jodit-toolbar-button_plus svg, .jodit-toolbar-button_minus svg {
           color: #1e293b !important;
           width: 14px;
           height: 14px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
