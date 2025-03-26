"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import MarkdownEditor from "@/app/components/markdownEditor";
import {
  handleImageUpload,
  handleRemoveImage,
} from "@/app/components/imageHandle";

const CardEdit = ({
  question,
  setQuestion,
  answer,
  setAnswer,
  image,
  setImage,
  mimeType,
  setMimeType,
}: {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  mimeType: string | null;
  setMimeType: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <MarkdownEditor
        value={question}
        setValue={setQuestion}
        textareaRef={questionRef}
        qOrA="q"
      />
      <MarkdownEditor
        value={answer}
        setValue={setAnswer}
        textareaRef={answerRef}
        qOrA="a"
      />
      <label className="block mt-2">Upload new image:</label>
      <input
        type="file"
        accept="image/*"
        placeholder="Upload Image"
        onChange={(event) =>
          handleImageUpload(event, setImage, setMimeType, setError)
        }
      />
      {error && alert(error)}
      {image && mimeType && (
        <div className="mt-2">
          <Image
            src={`data:${mimeType};base64,${image}`}
            alt="Preview"
            className="max-w-full h-auto"
            layout="responsive"
            width={500}
            height={500}
          />
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => handleRemoveImage(setImage, setMimeType)}
          >
            Remove Image
          </button>
        </div>
      )}
    </>
  );
};

export default CardEdit;
