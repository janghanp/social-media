import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import { HiOutlineUpload } from 'react-icons/hi';

import { CustomFile, FormikValues } from '../types';
// import Preview from './Preview';

interface Props {
  formik: FormikProps<FormikValues>;
  isEditing: boolean;
}

const DropZone = ({ formik, isEditing }: Props) => {
  const firstRender = useRef<boolean>(true);

  //hoist up the state?
  const [files, setFiles] = useState<CustomFile[]>(formik.values.files);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      formik.setFieldValue('files', files, true);
      formik.setFieldTouched('files', true, true);
    }
  }, [files]);

  // useEffect(() => {
  //   if (isEditing && formik.values.files.length > 0) {
  //     setFiles(formik.values.files);
  //   }
  // }, [formik.values.files]);

  const onDropHandler = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) {
        return;
      }

      setFiles((prevState) => {
        const newAddedFiles = acceptedFiles.map((file) => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
            uploaded: false,
            isUploading: false,
          });
        });

        return [...prevState, ...newAddedFiles];
      });
    },
    []
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

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
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
    'border-red-500': formik.errors.files,
  });

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

      {formik.errors.files && (
        <span className="text-red-500">{formik.errors.files as string}</span>
      )}

      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-warning">
          {fileRejections[0].errors[0].message}
        </div>
      )}

      {/* {files.length > 0 && (
        <Preview files={files} setFiles={setFiles} isEditing={isEditing} />
      )} */}
    </>
  );
};

export default DropZone;
