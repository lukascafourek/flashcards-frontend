"use client";

import { handleChange } from "@/app/components/inputValidation";

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
          className="w-full p-1 border rounded mb-2 font-normal resize"
          style={{
            resize: "vertical",
            overflowWrap: "break-word",
            minHeight: "50px",
          }}
        />
      </label>
      <div className="text-xs text-gray-500 mb-2">
        {value.length}/{MAX_CHAR_LIMIT} characters
      </div>
    </>
  );
};

export default MarkdownEditor;
