import React, { useCallback, memo, useEffect, useRef } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import classNames from 'classnames';
import { FormikErrors } from 'formik';
import { HiOutlineUpload } from 'react-icons/hi';
import { v4 as uuidv4 } from 'uuid';

import { CustomFile, FormikValues } from '../types';
import axios from 'axios';

interface Props {
  error: string | string[] | FormikErrors<CustomFile>[] | undefined;
  formikFiles: CustomFile[];
  setIsStillUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
}

const DropZone = ({ error, formikFiles, setFieldValue, setIsStillUploading }: Props) => {
  const formikFilesRef = useRef<CustomFile[]>([]);

  const uploadFileToS3 = useCallback(async (customFile: CustomFile) => {
    const formData = new FormData();
    formData.append('file', customFile.croppedImage || customFile.image);
    const { data } = await axios.post('/api/upload', formData);

    return { Key: data.Key, id: customFile.id };
  }, []);

  //When finding a croppedImage re-upload that image.
  useEffect(() => {
    let idSet = new Set();

    const newFormikFilesIds = formikFiles.map((formikFile) => {
      const id = formikFile.id;
      idSet.add(id);
      return id;
    });

    const previousFormikFilesIds = formikFilesRef.current.map((formikFileRef) => {
      const id = formikFileRef.id;
      idSet.add(id);
      return id;
    });

    const reUpload = async () => {
      setIsStillUploading(true);

      const targetId = newFormikFilesIds.filter((newId) => {
        return !previousFormikFilesIds.includes(newId);
      })[0];

      const targetFile = formikFiles.find((formikFile) => formikFile.id === targetId);

      if (targetFile) {
        const { Key } = await uploadFileToS3(targetFile);

        formikFiles.forEach((formikFile) => {
          if (formikFile.id === targetId) {
            formikFile.Key = Key;
          }
        });

        formikFilesRef.current = formikFiles;
        setFieldValue('files', formikFiles);

        setIsStillUploading(false);
      }
    };

    if (
      //cropping an image.
      newFormikFilesIds.length === previousFormikFilesIds.length &&
      previousFormikFilesIds.length !== idSet.size
    ) {
      reUpload();
    } else {
      //adding or deleting an image.
      formikFilesRef.current = formikFiles;
    }
  }, [formikFiles, formikFilesRef, uploadFileToS3, setFieldValue, setIsStillUploading]);

  const onDropHandler = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) {
        return;
      }

      setIsStillUploading(true);

      const droppedFiles: CustomFile[] = acceptedFiles.map((acceptedFile) => {
        return {
          id: uuidv4(),
          preview: URL.createObjectURL(acceptedFile),
          image: acceptedFile,
        };
      });

      const newCustomFiles = [...formikFiles, ...droppedFiles];
      setFieldValue('files', newCustomFiles);

      Promise.all(droppedFiles.map((droppedFile) => uploadFileToS3(droppedFile)))
        .then((results) => {
          const clonedNewCustomFiles = newCustomFiles.map((newCustomFile) => {
            return {
              ...newCustomFile,
            };
          });

          const customFilesWithKey = clonedNewCustomFiles.map((clonedNewCustomFile) => {
            if (!clonedNewCustomFile.Key) {
              results.forEach((result) => {
                if (clonedNewCustomFile.id === result.id) {
                  clonedNewCustomFile.Key = result.Key;
                }
              });
            }

            return clonedNewCustomFile;
          });

          setFieldValue('files', customFilesWithKey);
          formikFilesRef.current = customFilesWithKey;
        })
        .catch((err) => {
          console.log('error occured while uploading files...');
        })
        .finally(() => {
          setIsStillUploading(false);
        });
    },
    [formikFiles, setFieldValue, setIsStillUploading, uploadFileToS3]
  );

  const fileSizeValidator = (file: File) => {
    if (file.size > 100000000) {
      return {
        code: 'size-too-large',
        message: 'The file size is too big. It should be less than 100MB.',
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    multiple: true,
    useFsAccessApi: false,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    onDrop: onDropHandler,
    validator: fileSizeValidator,
  });

  const dragAreaClasses = classNames({
    'border-2 border-dashed rounded-lg max-h-80 overflow-auto': true,
    'bg-gray-200': isDragActive,
    'border-warning': fileRejections.length > 0,
    'border-gray-500': fileRejections.length === 0,
    'border-red-500': error,
  });

  return (
    <>
      <section className="relative mt-5 rounded-lg transition duration-200 hover:cursor-pointer hover:bg-black/10">
        <div className={dragAreaClasses} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 py-5">
            <HiOutlineUpload className="h-6 w-6 text-gray-500" />
            <p className="text-center text-sm text-primary sm:text-base">
              Drag and drop some files here, or click to select files
            </p>
          </div>
        </div>
      </section>

      {error && <span className="text-red-500">{error as string}</span>}

      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-warning">{fileRejections[0].errors[0].message}</div>
      )}
    </>
  );
};

export default memo(DropZone);
