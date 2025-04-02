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
  const [inputFile, setInputFile] = useState<
    (EventTarget & HTMLInputElement) | null
  >(null);

  const handleError = (error: string | null) => {
    if (error) {
      alert(error);
      setError(null);
    }
  };

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
      <label className="block">Upload new image (max 1 MB):</label>
      <input
        type="file"
        accept="image/*"
        placeholder="Upload Image"
        onChange={(event) => {
          const target = event.target;
          setInputFile(target);
          handleImageUpload(event, setImage, setMimeType, setError);
          if (
            target.files &&
            target.files[0] &&
            target.files[0].size > 1024 * 1024
          ) {
            target.value = "";
            setInputFile(null);
          }
        }}
      />
      {error && handleError(error)}
      {image && mimeType && (
        <div className="mt-2">
          <Image
            src={`data:${mimeType};base64,${image}`}
            alt="Preview"
            className="max-w-96 max-h-96"
            layout="responsive"
            width={500}
            height={500}
          />
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              handleRemoveImage(setImage, setMimeType);
              if (inputFile) {
                inputFile.value = "";
              }
            }}
          >
            Remove Image
          </button>
        </div>
      )}
    </>
  );
};

export default CardEdit;
