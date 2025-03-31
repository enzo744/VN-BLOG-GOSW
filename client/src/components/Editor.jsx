/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoNgNARATAdAzPCkQAY4HYCcBWAjCAFgOwJ1wA58C5sVtMRs5TyNap0okIBLAFyQowwXGFHixYgLqQAZuhQAjAMbpyEKUA==
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  Title,
  Underline,
  WordCount,
} from "ckeditor5";

import translations from "ckeditor5/translations/it.js";

import "ckeditor5/ckeditor5.css";

// import './App.css';

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = "GPL"; // or <YOUR_LICENSE_KEY>.

export default function Editor(props) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const editorWordCountRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "textPartLanguage",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "link",
            "insertTable",
            "blockQuote",
            "|",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Autosave,
          BalloonToolbar,
          BlockQuote,
          BlockToolbar,
          Bold,
          Essentials,
          Heading,
          Indent,
          IndentBlock,
          Italic,
          Link,
          Paragraph,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextPartLanguage,
          Title,
          Underline,
          WordCount,
        ],
        balloonToolbar: ["bold", "italic", "|", "link"],
        blockToolbar: [
          "bold",
          "italic",
          "|",
          "link",
          "insertTable",
          "|",
          "outdent",
          "indent",
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ]
        },
        initialData:props?.initialData || "", 
        language: "it",
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        menuBar: {
          isVisible: true,
        },
        placeholder: "Type or paste your content here!",
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },
        translations: [translations],
      },
    };
  }, [isLayoutReady]);

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {editorConfig && (
              <CKEditor
                onChange={props.onChange}
                onReady={(editor) => {
                  const wordCount = editor.plugins.get("WordCount");
                  editorWordCountRef.current.appendChild(
                    wordCount.wordCountContainer
                  );

                //   editorMenuBarRef.current.appendChild(
                //     editor.ui.view.menuBarView.element
                //   );
                }}
                onAfterDestroy={() => {
                  Array.from(editorWordCountRef.current.children).forEach(
                    (child) => child.remove()
                  );

                //   Array.from(editorMenuBarRef.current.children).forEach(
                //     (child) => child.remove()
                //   );
                }}
                editor={ClassicEditor}
                config={editorConfig}
              />
            )}
          </div>
        </div>
        <div
          className="editor_container__word-count"
          ref={editorWordCountRef}
        ></div>
      </div>
    </div>
  );
}
