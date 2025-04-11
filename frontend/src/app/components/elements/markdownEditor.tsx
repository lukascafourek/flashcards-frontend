"use client";

import { handleChange } from "@/app/components/functions/inputValidation";

// This file contains the MarkdownEditor component, which is used to create a markdown editor for both questions and answers in the flashcard app.
// The component includes a textarea for input, a character limit counter, and handles the change event to update the state.

const MAX_CHAR_LIMIT = 510;

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
  return (
    <>
      <label className="block font-semibold text-gray-800">
        {qOrA === "q" ? "Question:" : "Answer:"}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value, setValue, MAX_CHAR_LIMIT)}
          className="w-full p-1 border rounded mb-2 resize"
          placeholder="Enter your text here..."
          style={{
            resize: "vertical",
            overflowWrap: "break-word",
            minHeight: "50px",
          }}
        />
      </label>
      <div className="text-sm text-gray-500 mb-2">
        {value.length}/{MAX_CHAR_LIMIT} characters
      </div>
    </>
  );
};

export default MarkdownEditor;
