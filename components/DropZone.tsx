import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import classNames from "classnames";
import { FormikProps } from "formik";
import { HiOutlineUpload } from "react-icons/hi";

import { formikValues } from "./PostModal";
import Preview from "./Preview";

export interface CustomFile extends File {
  preview: string;
  uploaded: boolean;
  isUploading: boolean;
  type: string;
  croppedPreview?: string;
  croppedImage?: Blob;
  zoomInit?: number;
  cropInit?: { x: number; y: number };
  aspectInit?: { value: number; text: string };
  Key?: string;
}

interface Props {
  formik: FormikProps<formikValues>;
  isEditing: boolean;
}

const DropZone = ({ formik, isEditing }: Props) => {
  const firstRender = useRef<boolean>(true);

  const [files, setFiles] = useState<CustomFile[]>(formik.values.files);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      formik.setFieldValue("files", files, false);
    }
  }, [files]);

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
        code: "size-too-large",
        message: "The file size is too big. It should be less than 100MB.",
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      multiple: true,
      useFsAccessApi: false,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
        "image/webp": [".webp"],
        "video/*": [],
      },
      onDrop: onDropHandler,
      validator: fileSizeValidator,
    });

  const dragAreaClasses = classNames({
    "border-2 border-dashed rounded-lg max-h-80 overflow-auto": true,
    "bg-gray-200": isDragActive,
    "border-warning": fileRejections.length > 0,
    "border-gray-500": fileRejections.length === 0,
  });

  return (
    <>
      <section className="relative mt-5 rounded-lg transition duration-200 hover:cursor-pointer hover:bg-black/10">
        <div className={dragAreaClasses} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 py-5">
            <HiOutlineUpload className="h-6 w-6 text-gray-500" />
            <p className="text-center text-base text-primary">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </div>
      </section>
      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-warning">
          {fileRejections[0].errors[0].message}
        </div>
      )}
      {files.length > 0 && (
        <Preview files={files} setFiles={setFiles} isEditing={isEditing} />
      )}
    </>
  );
};

export default DropZone;
