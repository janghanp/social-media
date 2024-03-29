import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';
import { v4 as uuidv4 } from 'uuid';
import useEscClose from '../hooks/useEscClose';

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
  useEscClose({ close: () => setIsPostModalOpen(false) });

  const router = useRouter();

  const [issubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStillUploading, setIsStillUploading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

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

  //When editing initialzing existing files.
  useEffect(() => {
    const setInitialFiles = async () => {
      setIsInitializing(true);

      await Promise.all(
        initialFiles!.map(async (file) => await createCustomFile(file.Key, file.ratio))
      ).then((files) => {
        formik.setFieldValue('files', files, false);
      });

      setIsInitializing(false);
    };

    if (isEditing && formik.values.files.length === 0 && !isInitializing) {
      setInitialFiles();
    }
  }, [initialFiles, isEditing, setIsInitializing, formik, isInitializing]);

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

  const createCustomFile = async (Key: string, ratio: number) => {
    const blobImage = await fetch(`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${Key}`).then(
      (response) => {
        return response.blob();
      }
    );

    const blobToFile = new File([blobImage], Key, { type: `image/${Key.split('.')[1]}` });
    const previewUrl = URL.createObjectURL(blobImage);

    return {
      id: uuidv4(),
      image: blobToFile,
      preview: previewUrl,
      Key,
      aspectInit: { value: ratio, text: ratio.toString() },
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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pr-12">
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
          formik.values.files.length !== 0 || isInitializing ? 'bottom-10' : 'bottom-auto'
        } left-1/2 z-40 w-[98%] -translate-x-1/2 overflow-y-auto rounded-md border-2 border-primary bg-white p-7 shadow-lg sm:w-[650px] sm:p-10`}
      >
        <h3 className="mb-5 text-xl font-bold sm:text-2xl">What is on your mind?</h3>
        <button
          onClick={cancelHandler}
          className={`btn btn-circle btn-outline btn-sm absolute right-5 top-5 border-2 ${
            isLoading && 'btn-disabled'
          }`}
        >
          ✕
        </button>
        <form className="relative" onSubmit={formik.handleSubmit}>
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

          {isInitializing && (
            <div className="absolute left-1/2 z-30 -translate-x-1/2 pt-40">
              <div className="pr-12">
                <FadeLoader color="gray" />
              </div>
            </div>
          )}

          {formik.values.files.length > 0 && (
            <Preview
              formikFiles={formik.values.files}
              setFieldValue={formik.setFieldValue}
              isEditing={isEditing}
            />
          )}

          {!isInitializing && (
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
          )}
        </form>
      </div>
    </>
  );
};

export default PostModal;
