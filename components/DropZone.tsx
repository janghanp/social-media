import React, { useCallback, useRef, useEffect, useState } from "react";
import { FileError, useDropzone } from "react-dropzone";
import classNames from "classnames";
import axios from "axios";
import { HiOutlineUpload } from "react-icons/hi";
import { BsFileEarmarkPlus } from "react-icons/bs";

import Preview from "./Preview";

export interface CustomFile extends File {
  preview: string;
}

const DropZone = () => {
  const [reset, setReset] = useState<boolean>(false);
  //To keep previous files from re-rendering.
  const filesRef = useRef<CustomFile[]>([]);

  useEffect(() => {}, [filesRef.current]);

  const onDropHandler = useCallback((acceptedFiles: File[]) => {
    const newAddedFiles: CustomFile[] = acceptedFiles.map((file: File) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    filesRef.current = [...filesRef.current, ...newAddedFiles];

    // setFiles([...files, ...newAddedFiles]);

    // const formData = new FormData();
    // formData.append("file", acceptedFiles[0]);

    //Make a http request to store image to the amazon s3
    // axios.post("/api/upload", formData).then((response) => {
    //   console.log(response);
    // });
  }, []);

  const fileSizeValidator = (file: File) => {
    if (file.size > 500000000) {
      return {
        code: "size-too-large",
        message: "The file size is too big. It should be less than 500MB.",
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
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
    "p-1 border-2 border-dashed rounded-lg max-h-80 overflow-auto": true,
    "bg-gray-200": isDragActive,
    "border-warning": fileRejections.length > 0,
    "border-gray-500": fileRejections.length === 0,
  });

  const previewCancelHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    filesRef.current = [];
    //force to re-render
    setReset(!reset);
  };

  return (
    <>
      <section className="relative mt-5 hover:cursor-pointer hover:bg-black/20 transition duration-200 rounded-lg">
        <div className={dragAreaClasses} {...getRootProps()}>
          {filesRef.current.length > 0 && (
            <>
              {/* Button for deleting preview images */}
              <div
                onClick={previewCancelHandler}
                className="btn btn-sm btn-circle btn-outline border-2 border-gray-500 text-gray-500 absolute z-20 right-5 top-5"
              >
                ✕
              </div>
              {/* Button for adding an image or a video */}
              <div className="inset-0 w-56 btn btn-outline border-gray-500 text-gray-500 absolute mx-auto my-auto">
                <BsFileEarmarkPlus className="w-6 h-6 mr-3" />
                <span>Add Photos/Videos</span>
              </div>
            </>
          )}
          <input {...getInputProps()} />
          {filesRef.current.length > 0 ? (
            <Preview files={filesRef.current} />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-5">
              <HiOutlineUpload className="w-6 h-6 text-gray-500" />
              <p className="text-base text-primary text-center">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          )}
        </div>
      </section>
      {fileRejections.map(({ file, errors }) => {
        return (
          <div
            key={file.name}
            className="text-sm text-warning text-center mt-5"
          >
            {errors[0].message}
          </div>
        );
      })}
    </>
  );
};

export default DropZone;
