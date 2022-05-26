import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
// import axios from "axios";
import { HiOutlineUpload } from "react-icons/hi";

import Preview from "./Preview";

export interface CustomFile extends File {
  preview: string;
}

const DropZone = () => {
  const [files, setFiles] = useState<CustomFile[]>([]);
  // const [progress, setProgress] = useState<number>(0);

  const onDropHandler = useCallback(async (acceptedFiles: File[]) => {
    //set preview images
    setFiles((prevState) => {
      const newAddedFiles = acceptedFiles.map((file) => {
        return Object.assign(file, { preview: URL.createObjectURL(file) });
      });

      return [...prevState, ...newAddedFiles];
    });

    //Make a http request for creating a signedURL
    // const { data } = await axios.post("/api/getSignedUrl", {
    //   type: acceptedFiles[0].type,
    // });

    //Make a put http request for uploading a file data to the amazon s3
    // const response = await axios.put(data.uploadURL, acceptedFiles[0], {
    //   headers: {
    //     "Content-type": acceptedFiles[0].type,
    //     "Access-Control-Allow-Otigin": "*",
    //   },
    //   onUploadProgress: (p) => {
    //     const completedProgress = Math.floor((p.loaded / p.total) * 100);
    //
    //     setProgress(completedProgress);
    //   },
    // });

    // console.log(process.env.NEXT_PUBLIC_AWS_BUCKET_URL + "/" + data.Key);
    // console.log(response);
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
      <section className="relative mt-5 hover:cursor-pointer hover:bg-black/10 transition duration-200 rounded-lg">
        <div className={dragAreaClasses} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 py-5">
            <HiOutlineUpload className="w-6 h-6 text-gray-500" />
            <p className="text-base text-primary text-center">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </div>
      </section>
      {files.length > 0 && <Preview files={files} setFiles={setFiles} />}
    </>
  );
};

export default DropZone;
