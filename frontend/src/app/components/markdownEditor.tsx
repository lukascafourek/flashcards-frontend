"use client";

import ReactMarkdown from "react-markdown";

const useMarkdownEditor = () => {
  const insertMarkdown = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    tag: string,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    setter((prev) => {
      const textarea = textareaRef.current!;
      const end = textarea.selectionEnd;
      const before = prev.substring(0, start);
      const after = prev.substring(end);
      return `${before}${tag}${prev.substring(start, end)}${tag}${after}`;
    });
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          start + tag.length;
      }
    }, 0);
  };
  return { insertMarkdown };
};

const MarkdownEditor = ({
  value,
  setValue,
  textareaRef,
  qOrA,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  qOrA: "q" | "a";
}) => {
  const { insertMarkdown } = useMarkdownEditor();
  return (
    <>
      <div className="flex space-x-2 mb-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded text-sm text-bold"
          onClick={() => insertMarkdown(setValue, "**", textareaRef)}
        >
          Bold
        </button>
        <button
          className="px-2 py-1 bg-gray-200 rounded text-sm text-italic"
          onClick={() => insertMarkdown(setValue, "_", textareaRef)}
        >
          Italic
        </button>
        <button
          className="px-2 py-1 bg-gray-200 rounded text-sm text-underline"
          onClick={() => insertMarkdown(setValue, "~~", textareaRef)}
        >
          Underline
        </button>
      </div>
      <label className="block font-semibold text-gray-800">
        {qOrA === "q" ? "Question:" : "Answer:"}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-1 border rounded mb-2 font-normal resize"
          style={{
            resize: "vertical",
            overflowWrap: "break-word",
            minHeight: "50px",
          }}
        />
      </label>
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Preview:</h3>
        <div className="border p-2 bg-gray-100 rounded">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default MarkdownEditor;
