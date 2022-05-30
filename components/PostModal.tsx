import React, { useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { HiOutlinePhotograph } from "react-icons/hi";
import axios from "axios";

import { PostValidationSchema } from "../lib/validation";
import DropZone from "./DropZone";

import { CustomFile } from "./DropZone";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface formikValues {
  body: string;
  files: CustomFile[];
}

const PostModal = ({ setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleDropZone, setToggleDropZone] = useState<boolean>(false);

  const formik = useFormik<formikValues>({
    initialValues: {
      body: "",
      files: [],
    },
    validationSchema: PostValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (
      values: formikValues,
      _formikHelpers: FormikHelpers<formikValues>
    ) => {
      setIsLoading(true);

      const response = await axios.post("/api/post", {
        body: values.body,
        Keys: values.files.map((file) => file.Key),
      });

      setIsLoading(false);
      setIsOpen(false);
    },
  });

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <>
      {/* Fade away background */}
      <div className="fixed inset-0 bg-black/70 z-30"></div>

      <div className="absolute flex w-full mx-auto min-h-screen justify-center items-center">
        <div className="bg-white relative z-40 w-5/6 sm:w-[600px] h-auto p-7 sm:p-10 border-2 border-primary shadow-lg rounded-md">
          <h3 className="font-bold text-xl sm:text-2xl mb-5">
            What's on your mind?
          </h3>
          <button
            onClick={cancelHandler}
            className={`btn btn-sm btn-circle btn-outline border-2 absolute right-5 top-5 ${
              isLoading && "btn-disabled"
            }`}
          >
            ✕
          </button>
          <form onSubmit={formik.handleSubmit}>
            <textarea
              id="body"
              name="body"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.body}
              className={`textarea border-2 ${
                formik.errors.body ? "textarea-warning" : "textarea-primary"
              } w-full h-40 text-lg`}
            ></textarea>
            {formik.errors.body && (
              <span className="text-red-500 text-sm">{formik.errors.body}</span>
            )}
            {/* Drop zone */}
            {toggleDropZone && <DropZone formik={formik} />}

            <div className="mt-5">
              <HiOutlinePhotograph
                onClick={() => setToggleDropZone(true)}
                className="h-8 w-8 hover:cursor-pointer"
              />
            </div>
            <div className="flex flex-row space-x-5 mt-5">
              <button
                type="submit"
                className={`btn btn-outline border-2 ${
                  isLoading && "btn-disabled"
                }`}
                disabled={isLoading ?? "disabled"}
              >
                Post
              </button>
              <button
                onClick={cancelHandler}
                className={`btn btn-ghost ${isLoading && "btn-disabled"}`}
                disabled={isLoading ?? "disabled"}
              >
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
