import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import axios from "axios";
import { HiOutlineUpload } from "react-icons/hi";

import Preview from "./Preview";

export interface CustomFile extends File {
  preview: string;
}

const DropZone = () => {
  //To keep previous files from re-rendering.
  const filesRef = useRef<CustomFile[]>([]);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {},
    onDrop: onDropHandler,
  });

  const dragAreaClasses = classNames({
    "p-2 border-gray-500 border-2 border-dashed rounded-lg max-h-80 overflow-auto":
      true,
    "bg-gray-200": isDragActive,
  });

  return (
    <>
      <section className="mt-5 hover:cursor-pointer hover:bg-black/20 transition duration-200 rounded-lg">
        <div className={dragAreaClasses} {...getRootProps()}>
          <input {...getInputProps()} />
          {filesRef.current.length > 0 ? (
            <Preview files={filesRef.current} />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-5">
              <HiOutlineUpload className="w-6 h-6 text-gray-500" />
              <p className="text-base text-primary">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DropZone;
