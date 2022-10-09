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

  const uploadFileToS3 = useCallback(async (file: CustomFile) => {
    const formData = new FormData();
    formData.append('file', file.croppedImage || file);
    const { data } = await axios.post('/api/upload', formData);

    return { Key: data.Key, id: file.id };
  }, []);

  //When finding a croppedImage re-upload that image.
  useEffect(() => {
    const checkToReUpload = async () => {
      const refIds = formikFilesRef.current.map((formikFile) => formikFile.id);

      const fileToReUpload = formikFiles.filter((formikFile) => {
        return formikFile.id && !refIds.includes(formikFile.id);
      })[0];

      if (fileToReUpload) {
        console.log('reupload');
        const { Key, id } = await uploadFileToS3(fileToReUpload);

        formikFiles.forEach((formikFile) => {
          if (formikFile.id === id) {
            formikFile.Key = Key;
          }
        });

        formikFilesRef.current = formikFiles;
      }
    };

    if (formikFiles.length === formikFilesRef.current.length) {
      checkToReUpload();
    }
  }, [formikFiles, formikFilesRef, uploadFileToS3]);

  const onDropHandler = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) {
        return;
      }

      setIsStillUploading(true);

      const newAddedFiles: CustomFile[] = acceptedFiles.map((file) => {
        return Object.assign(file, {
          id: uuidv4(),
          preview: URL.createObjectURL(file),
        });
      });

      const newFiles = [...formikFiles, ...newAddedFiles];
      setFieldValue('files', newFiles);

      Promise.all(newAddedFiles.map((newAddedFile) => uploadFileToS3(newAddedFile)))
        .then((results) => {
          console.log({ results });

          const deepCloendNewFiles = newFiles.map((newFile) => {
            return {
              ...newFile,
            };
          });

          const newFilesWithKey = deepCloendNewFiles.map((deepClonedFile) => {
            if (!deepClonedFile.Key) {
              results.forEach((result) => {
                if (deepClonedFile.id === result.id) {
                  deepClonedFile.Key = result.Key;
                }
              });
            }

            return deepClonedFile;
          });

          setFieldValue('files', newFilesWithKey);
          formikFilesRef.current = newFilesWithKey;
        })
        .catch((err) => {
          console.log(err);
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

  console.log('Dropzone render');

  return (
    <>
      <section className="relative mt-5 rounded-lg transition duration-200 hover:cursor-pointer hover:bg-black/10">
        <div className={dragAreaClasses} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 py-5">
            <HiOutlineUpload className="h-6 w-6 text-gray-500" />
            <p className="text-center text-base text-primary">
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

export default memo(DropZone, (prevProps, nextProps) => {
  // if (prevProps.error === prevProps.error) {
  //   console.log(true);
  // }

  if (prevProps.formikFiles === nextProps.formikFiles) {
    console.log('same');
  } else {
    console.log('nope');
  }

  // if (prevProps.setFieldValue === prevProps.setFieldValue) {
  //   console.log(true);
  // }

  // if (prevProps.setIsStillUploading === prevProps.setIsStillUploading) {
  //   console.log(true);
  // }
  return false;
});
