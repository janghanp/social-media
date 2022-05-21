import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import { HiOutlineUpload } from "react-icons/hi";
import axios from "axios";

const DropZone = () => {
  const [fileUPload, setFileUpload] = useState(null);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    //Make a http request to store image to the amazon s3
    const response = await axios.post("/api/upload", formData, {
      onUploadProgress: (p) => {
        console.log(p);
      },
    });

    console.log(response);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dragAreaClasses = classNames({
    "p-5 border-gray-500 border-2 border-dashed rounded-lg": true,
    "bg-gray-200": isDragActive,
  });

  return (
    <section className="mt-10 hover:cursor-pointer hover:bg-gray-100 transition duration-200">
      <div className={dragAreaClasses} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <HiOutlineUpload className="w-6 h-6 text-gray-500" />
          <p className="text-base text-primary">
            Drag 'n' drop some files here, or click to select files
          </p>
        </div>
      </div>
    </section>
  );
};

export default DropZone;
