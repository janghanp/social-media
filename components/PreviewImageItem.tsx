import { useState, useEffect, memo } from "react";
import axios from "axios";
import { MdUploadFile, MdClose } from "react-icons/md";

import { CustomFile } from "./DropZone";

type Props = {
  file: CustomFile;
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
};

const PreviewImageItem = ({ file, setFiles }: Props) => {
  const [progress, setProgress] = useState<number>(0);






  // useEffect(() => {
  //   const uploadFile = async () => {
  //     const { data } = await axios.post("/api/getSignedUrl", {
  //       type: file.type,
  //     });
  //
  //     await axios.put(data.uploadURL, file, {
  //       headers: {
  //         "Content-type": file.type,
  //         "Access-Control-Allow-Otigin": "*",
  //       },
  //       onUploadProgress: (p) => {
  //         const completedProgress = Math.floor((p.loaded / p.total) * 100);
  //         setProgress(completedProgress);
  //       },
  //     });
  //
  //     //Update the state with an actual file url.
  //     setFiles((prevState) =>
  //       prevState.map((f) => {
  //         if (f === file) {
  //           f.Key = data.Key;
  //           f.uploaded = true;
  //
  //           return f;
  //         }
  //
  //         return f;
  //       })
  //     );
  //   };
  //
  //   uploadFile();
  // }, []);

  const deleteHandler = () => {
    URL.revokeObjectURL(file.preview);
    //Delete a file in the state but the file is actually alive in the bucket.
    //It is going to be deleted handling by tagging and the lifecyle rule on objects.
    setFiles((prevState) => prevState.filter((f) => f !== file));
  };

  let content;

  if (progress !== 100) {
    // loading preview
    content = (
      <div className="w-full h-80 bg-gray-200/50 flex flex-col space-y-2 justify-center items-center">
        <MdUploadFile className="w-10 h-10 text-gray-600/60" />
        <span className="text-gray-600">Uploading...</span>
        <progress
          className="progress process-info w-56 z-30"
          value={progress}
          max="100"
        ></progress>
      </div>
    );
  } else {
    content = (
      <>
        {file.type.includes("video") ? (
          <>
            <video className="w-full h-80 object-cover">
              <source src={file.preview} type={file.type} />
            </video>
          </>
        ) : (
          <>
            <img
              className="w-full h-80 object-cover"
              src={file.preview}
              alt={file.name}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div
        onClick={deleteHandler}
        className="btn btn-circle btn-sm absolute top-3 right-3 bg-black/50 hover:bg-black/30 border-none"
      >
        <MdClose />
      </div>
      {content}
    </>
  );
};

export default memo(PreviewImageItem);
