import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';
import { v4 as uuidv4 } from 'uuid';

import { CustomFile, FormikValues } from '../types';
import { PostValidationSchema } from '../lib/validation';
import DropZone from './DropZone';
import usePreventScroll from '../hooks/usePreventScroll';
import Preview from './Preview';

interface Props {
  postId?: string;
  initialBody?: string;
  initialFiles?: { Key: string; ratio: number }[];
  setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostModal = ({ postId, initialFiles, initialBody, setIsPostModalOpen }: Props) => {
  const isEditing = initialFiles ? true : false;

  usePreventScroll();

  const router = useRouter();

  const [issubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStillUploading, setIsStillUploading] = useState<boolean>(false);

  const formik = useFormik<FormikValues>({
    initialValues: {
      body: initialBody || '',
      files: [],
    },
    validationSchema: PostValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => {
      const { files, body } = values;

      if (files.length === 0) {
        formikHelpers.setFieldError('files', 'You need to upload one photo at least.');
        return;
      }

      setIsLoading(true);

      if (isStillUploading) {
        setIsSubmitting(true);
        return;
      }

      if (isEditing) {
        await updatePost(postId!, files, body);
      } else {
        await copyObjectsInUse(files, body);
      }

      setIsLoading(false);
      setIsPostModalOpen(false);

      router.reload();
    },
  });

  //When submitting, check if there is still a file uploading.
  useEffect(() => {
    const checkUploading = async () => {
      const { files, body } = formik.values;

      if (!isStillUploading && issubmitting) {
        if (isEditing && postId) {
          await updatePost(postId, files, body);
        } else {
          await copyObjectsInUse(files, body);
        }

        setIsLoading(false);
        setIsPostModalOpen(false);

        router.reload();
      }
    };

    if (issubmitting) {
      checkUploading();
    }
  }, [
    postId,
    formik.values,
    issubmitting,
    router,
    isEditing,
    isStillUploading,
    setIsLoading,
    setIsPostModalOpen,
  ]);

  //When editing
  useEffect(() => {
    const setInitialFiles = async () => {
      Promise.all(
        initialFiles!.map(async (file) => await createFileValues(file.Key, file.ratio))
      ).then((files) => {
        formik.setFieldValue('files', files, false);
      });
    };

    if (isEditing && formik.values.files.length === 0) {
      setInitialFiles();
    }
  }, [initialFiles, isEditing, formik]);

  const copyObjectsInUse = async (files: CustomFile[], body: string) => {
    const fileInfos = files.map((file) => ({
      Key: file.Key,
      ratio: file.aspectInit?.value || 1,
    }));

    await axios.post('/api/post', {
      body,
      fileInfos,
    });
  };

  const updatePost = async (postId: string, files: CustomFile[], body: string) => {
    const fileInfos = files.map((file) => ({
      Key: file.Key,
      ratio: file.aspectInit?.value || 1,
    }));

    await axios.put('/api/post', { postId, body, fileInfos });
  };

  const createFileValues = async (Key: string, ratio: number) => {
    const blobImage = await fetch(`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${Key}`).then(
      (response) => response.blob()
    );

    const previewUrl = URL.createObjectURL(blobImage);

    return {
      id: uuidv4(),
      preview: previewUrl,
      Key,
      aspectInit: { value: ratio, text: ratio.toString() },
      type: blobImage.type,
    };
  };

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.preventDefault();
    setIsPostModalOpen(false);
  };

  return (
    <>
      <div
        onClick={cancelHandler}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
      ></div>
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
          formik.values.files.length === 0 ? 'bottom-auto' : 'bottom-10'
        } left-1/2 z-40 w-[90%] -translate-x-1/2 overflow-y-auto rounded-md border-2 border-primary bg-white p-7 shadow-lg sm:w-[650px] sm:p-10`}
      >
        <h3 className="mb-5 text-xl font-bold sm:text-2xl">What is on your mind?</h3>
        <button
          onClick={cancelHandler}
          className={`btn btn-outline btn-circle btn-sm absolute right-5 top-5 border-2 ${
            isLoading && 'btn-disabled'
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
              formik.errors.body ? 'textarea-warning' : 'textarea-primary'
            } h-40 w-full text-lg`}
          ></textarea>
          {formik.errors.body && <span className="text-sm text-red-500">{formik.errors.body}</span>}

          <DropZone
            error={formik.errors.files}
            formikFiles={formik.values.files}
            setFieldValue={formik.setFieldValue}
            setIsStillUploading={setIsStillUploading}
          />

          {formik.values.files.length > 0 && (
            <Preview
              formikFiles={formik.values.files}
              setFieldValue={formik.setFieldValue}
              isEditing={isEditing}
            />
          )}

          <div className="mt-5 flex flex-row space-x-5">
            <button
              type="submit"
              className={`btn btn-outline border-2 ${isLoading && 'btn-disabled'}`}
              disabled={isLoading ?? 'disabled'}
            >
              {isEditing ? 'Update' : 'Post'}
            </button>
            <button
              onClick={cancelHandler}
              className={`btn btn-ghost ${isLoading && 'btn-disabled'}`}
              disabled={isLoading ?? 'disabled'}
            >
              Cancel
            </button>
          </div>
        </form>
        <code>
          <pre>isStillUplading: {JSON.stringify(isStillUploading, null, 4)}</pre>
          <pre>{JSON.stringify(formik.values.files, null, 4)}</pre>
        </code>
      </div>
    </>
  );
};

export default PostModal;
