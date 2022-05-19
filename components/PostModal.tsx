import React, { useState } from "react";

import { HiOutlinePhotograph } from "react-icons/hi";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostModal = ({ isOpen, setIsOpen }: Props) => {
  const [body, setBody] = useState<string>("");

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ body }),
    });
  };

  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      {/* Fade away background */}
      <div className="fixed inset-0 bg-black/30 z-30"></div>

      <div className="absolute flex w-full  mx-auto min-h-screen justify-center items-center">
        <div className="bg-white relative z-40 w-[500px] h-[600px] p-10 border border-primary shadow-lg rounded-md">
          <h3 className="font-bold text-2xl mb-5">
            What are you thinking about?
          </h3>
          <span
            onClick={() => {
              setIsOpen(false);
            }}
            className="btn btn-sm btn-circle btn-outline absolute right-5 top-5"
          >
            ✕
          </span>
          <form>
            <textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setBody(e.target.value)
              }
              className="textarea textarea-primary w-full h-56 text-lg"
            ></textarea>
            <div className="mt-5">
              <HiOutlinePhotograph className="h-8 w-8" />
            </div>
            <div className="flex flex-row space-x-5 mt-10">
              <button onClick={submitHandler} className="btn btn-outline">
                Save
              </button>
              <button onClick={cancelHandler} className="btn btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostModal;
