import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { HiOutlinePhotograph } from "react-icons/hi";

import { PostValidationSchema } from "../lib/validation";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type formikValues = {
  body: string;
};

const PostModal = ({ setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik<formikValues>({
    initialValues: {
      body: "",
    },
    validationSchema: PostValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (
      values: formikValues,
      formikHelpers: FormikHelpers<formikValues>
    ) => {
      console.log("submit handler");
    },
  });

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  // const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();

  //   setIsLoading(true);

  //   await fetch("/api/post", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ body }),
  //   });

  //   setIsLoading(false);
  //   setIsOpen(false);
  //   router.push("/");
  // };

  return (
    <>
      {/* Fade away background */}
      <div className="fixed inset-0 bg-black/30 z-30"></div>

      <div className="absolute flex w-full mx-auto min-h-screen justify-center items-center">
        <div className="bg-white relative z-40 w-[400px] sm:w-[500px] h-[600px] p-7 sm:p-10 border-2 border-primary shadow-lg rounded-md">
          <h3 className="font-bold text-xl sm:text-2xl mb-5">
            What are you thinking about?
          </h3>
          <button
            onClick={cancelHandler}
            className="btn btn-sm btn-circle btn-outline absolute right-5 top-5"
            disabled={isLoading ?? "disabled"}
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
              } w-full h-56 text-lg`}
            ></textarea>
            {formik.errors.body && (
              <span className="text-red-500 text-sm">{formik.errors.body}</span>
            )}
            <div className="mt-5">
              <HiOutlinePhotograph className="h-8 w-8" />
            </div>
            <div className="flex flex-row space-x-5 mt-10">
              <button
                type="submit"
                className="btn btn-outline"
                disabled={isLoading ?? "disabled"}
              >
                Save
              </button>
              <button
                onClick={cancelHandler}
                className="btn btn-ghost"
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
