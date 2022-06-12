import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FormikHelpers, useFormik } from "formik";
import { HiOutlinePhotograph } from "react-icons/hi";
import axios from "axios";
import FadeLoader from "react-spinners/FadeLoader";

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
  const router = useRouter();

  const [isSubmited, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleDropZone, setToggleDropZone] = useState<boolean>(false);

  const copyObjectsInUse = async (files: CustomFile[], body: string) => {
    const fileInfos = files.map((file) => ({
      Key: file.Key,
      ratio: file.aspectInit?.value || 1,
    }));

    await axios.post("/api/post", {
      body,
      fileInfos,
    });
  };

  const stillUploading = (files: CustomFile[]) => {
    const loadings = files.map((file) => file.isUploading);

    return loadings.includes(true);
  };

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
      const { files, body } = values;

      setIsLoading(true);

      //If there is still a file uploading exit this function out and deligate submition to useEffect.
      if (stillUploading(files)) {
        setIsSubmitted(true);
        return;
      }

      //Process for when files are not uploading.
      await copyObjectsInUse(files, body);

      setIsLoading(false);
      setIsOpen(false);

      router.reload();
    },
  });

  useEffect(() => {
    const checkUploading = async () => {
      const { files, body } = formik.values;

      //Detect isUploading values and a user has clicked the post button When every value is false send http request.
      if (!stillUploading(files) && isSubmited) {
        await copyObjectsInUse(files, body);

        setIsLoading(false);
        setIsOpen(false);

        router.reload();
      }
    };

    checkUploading();
  }, [formik.values.files]);

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <>
      {/* Fade away background */}
      <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"></div>
      {/* FadeLoader When loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <FadeLoader
              loading={isLoading}
              color="#ffffff"
              height={15}
              width={5}
              radius={2}
              margin={2}
            />
          </div>
        </div>
      )}
      <div
        className={`fixed top-10 ${
          formik.values.files.length === 0 ? "bottom-auto" : "bottom-10"
        } left-1/2 z-40 w-[90%] -translate-x-1/2 overflow-y-auto rounded-md border-2 border-primary bg-white p-7 shadow-lg sm:w-[650px] sm:p-10`}
      >
        <h3 className="mb-5 text-xl font-bold sm:text-2xl">
          What's on your mind?
        </h3>
        <button
          onClick={cancelHandler}
          className={`btn btn-outline btn-circle btn-sm absolute right-5 top-5 border-2 ${
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
            } h-40 w-full text-lg`}
          ></textarea>
          {formik.errors.body && (
            <span className="text-sm text-red-500">{formik.errors.body}</span>
          )}
          {/* Drop zone */}
          {toggleDropZone && <DropZone formik={formik} />}

          <div className="mt-5">
            <HiOutlinePhotograph
              onClick={() => setToggleDropZone(true)}
              className="h-8 w-8 hover:cursor-pointer"
            />
          </div>
          <div className="mt-5 flex flex-row space-x-5">
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
    </>
  );
};

export default PostModal;
