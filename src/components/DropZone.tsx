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

    console.log('check formData');
    //inspect formData if it has a file in it.
    for (const pair of formData.entries()) {
      console.dir(pair[1]);
    }

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
        // console.log('reupload');
        // console.log({ fileToReUpload });

        const { Key, id } = await uploadFileToS3(fileToReUpload);

        console.log('Key: ', Key);
        console.log('id: ', id);

        console.log(formikFiles);

        const finalFiles = formikFiles.map((formikFile) => {
          URL.revokeObjectURL(formikFile.preview);

          const newFile = new File([formikFile], formikFile.name, { type: formikFile.type });

          if (formikFile.id === id) {
            return Object.assign(newFile, {
              id: formikFile.id,
              preview: URL.createObjectURL(newFile),
              zoomInit: formikFile.zoomInit,
              cropInit: formikFile.cropInit,
              aspectInit: formikFile.aspectInit,
              croppedImage: formikFile.croppedImage,
              croppedPreview: formikFile.croppedPreview,
              Key: Key,
            });
          }

          return Object.assign(newFile, {
            id: formikFile.id,
            preview: URL.createObjectURL(newFile),
            zoomInit: formikFile.zoomInit,
            cropInit: formikFile.cropInit,
            aspectInit: formikFile.aspectInit,
            croppedImage: formikFile.croppedImage,
            croppedPreview: formikFile.croppedPreview,
            Key: formikFile.Key,
          });
        });

        // formikFiles.forEach((formikFile) => {
        //   if (formikFile.id === id) {
        //     formikFile.Key = Key;
        //   }
        // });

        formikFilesRef.current = formikFiles;

        setFieldValue('files', finalFiles);
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

      const newFormkiFiles: CustomFile[] = formikFiles.map((formikFile) => {
        URL.revokeObjectURL(formikFile.preview);

        const newFile = new File([formikFile], formikFile.name, { type: formikFile.type });

        return Object.assign(newFile, {
          id: formikFile.id,
          preview: URL.createObjectURL(newFile),
          zoomInit: formikFile.zoomInit,
          cropInit: formikFile.cropInit,
          aspectInit: formikFile.aspectInit,
          croppedImage: formikFile.croppedImage,
          croppedPreview: formikFile.croppedPreview,
          Key: formikFile.Key,
        });
      });

      console.log({ newFormkiFiles });

      const newFiles = newFormkiFiles.concat(newAddedFiles);
      setFieldValue('files', newFiles);

      console.log({ newFiles });

      Promise.all(newAddedFiles.map((newAddedFile) => uploadFileToS3(newAddedFile)))
        .then((results) => {
          const deepCloendNewFiles: CustomFile[] = newFiles.map((newFile) => {
            //If it works make it a function to re-use in other components.
            URL.revokeObjectURL(newFile.preview);

            const finalFile = new File([newFile], newFile.name, { type: newFile.type });

            return Object.assign(finalFile, {
              id: newFile.id,
              preview: URL.createObjectURL(finalFile),
              Key: newFile.Key,
            });
          });

          // const newFilesWithKey = deepCloendNewFiles.map((deepClonedFile) => {
          //   if (!deepClonedFile.Key) {
          //     results.forEach((result) => {
          //       if (deepClonedFile.id === result.id) {
          //         deepClonedFile.Key = result.Key;
          //       }
          //     });
          //   }

          //   return deepClonedFile;
          // });

          console.log({ deepCloendNewFiles });

          const newFilesWithKey = deepCloendNewFiles.map((deepCloneFile) => {
            URL.revokeObjectURL(deepCloneFile.preview);

            const finalFile = new File([deepCloneFile], deepCloneFile.name, {
              type: deepCloneFile.type,
            });

            if (!deepCloneFile.Key) {
              const resultToUse = results.filter((result) => {
                return deepCloneFile.id === result.id;
              })[0];

              return Object.assign(finalFile, {
                id: deepCloneFile.id,
                preview: URL.createObjectURL(finalFile),
                Key: resultToUse.Key,
              });
            }

            return Object.assign(finalFile, {
              id: deepCloneFile.id,
              preview: URL.createObjectURL(finalFile),
            });
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

export default memo(DropZone);
