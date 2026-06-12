// src/components/RemarkEditor.jsx
import React, { useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const RemarkEditor = ({ value, onChange }) => {
  const [editorData, setEditorData] = useState(value || "");
  const editorRef = useRef();

  const getPlainText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className='w-full max-w-xl mx-auto p-4'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Remarks
      </label>
      <div className='border border-gray-300 rounded-md shadow-sm bg-white'>
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          config={{
            toolbar: [], // Hides formatting toolbar
            placeholder: "Write your remarks here...",
            removePlugins: [
              "Heading",
              "Bold",
              "Italic",
              "Link",
              "ImageUpload",
              "Table",
              "MediaEmbed",
              "CKFinderUploadAdapter",
              "EasyImage",
              "RealTimeCollaborativeComments",
              "RealTimeCollaborativeTrackChanges",
              "RealTimeCollaborativeRevisionHistory",
              "Comments",
              "TrackChanges",
              "TrackChangesData",
              "RevisionHistory",
              "Pagination",
              "WProofreader",
              "MathType",
              "SlashCommand",
              "Template",
              "DocumentOutline",
              "FormatPainter",
              "TableOfContents",
            ],
          }}
          onChange={(event, editor) => {
            const html = editor.getData();
            const plainText = getPlainText(html);
            setEditorData(html);
            if (onChange) onChange(plainText);
          }}
        />
      </div>
    </div>
  );
};

export default RemarkEditor;
