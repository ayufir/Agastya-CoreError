// jnzvodbcp0d8b7vtrqxiehzp6hkkz1yp64b1qvmnsx4qcq3u
// TinyMCEEditor.jsx

// TinyMCEOnClickEditor.jsx

import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEOnClickEditor() {
  const [showEditor, setShowEditor] = useState(true);
  const [content, setContent] = useState(""); // 👈 Live content store
  const editorRef = useRef(null);

  return (
    <div className='max-w-3xl mx-auto my-8'>
      {/* {!showEditor && (
        <button
          onClick={() => setShowEditor(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded'
        >
          Show Editor
        </button>
      )} */}

      {showEditor && (
        <>
          <Editor
            apiKey='jnzvodbcp0d8b7vtrqxiehzp6hkkz1yp64b1qvmnsx4qcq3u' // 👈 ya empty string rakh do agar self-host karna hai
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue='<p>Start writing here...</p>'
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
          />

          {/* <button
            onClick={() => console.log(content)}
            className='mt-4 px-4 py-2 bg-green-600 text-white rounded'
          >
            Log Content
          </button> */}

          {/* <pre className='mt-4 p-2 bg-gray-100'>{content}</pre> */}
        </>
      )}
    </div>
  );
}
