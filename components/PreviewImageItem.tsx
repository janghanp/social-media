import { useState, useEffect, memo } from "react";
import Image from "next/image";
import axios from "axios";
import { MdClose, MdOutlineModeEdit } from "react-icons/md";

import { CustomFile } from "./DropZone";
import ImageCropModal from "./ImageCropModal";

type Props = {
  file: CustomFile;
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
};

const PreviewImageItem = ({ file, setFiles }: Props) => {
  let width;
  let height;

  //Depending on the asepct value width and height should be different.
  switch (file.aspectInit?.value) {
    case 1 / 1:
      width = "w-[546px]";
      height = "h-[546px]";
      break;
    case 4 / 5:
      width = "w-[436px]";
      height = "h-[546px]";
      break;
    case 16 / 9:
      width = "w-[546px]";
      height = "h-[307px]";
      break;
    default:
      width = "w-[546px]";
      height = "h-[546px]";
  }

  useEffect(() => {
    const uploadFile = async () => {
      //Create a getSignedUrl.
      const { data } = await axios.post("/api/getSignedUrl", {
        type: file.type,
      });

      //Upload an image to the bucket(PUT method) with the url created above.
      await axios.put(data.uploadURL, file.croppedImage || file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Otigin": "*",
        },
      });

      //Update state.
      setFiles((prevState) =>
        prevState.map((f) => {
          if (f === file) {
            f.Key = data.Key;
            f.uploaded = true;

            return f;
          }

          return f;
        })
      );
    };

    uploadFile();
  }, [file.croppedImage]);

  const [imageCropModal, setImageCropModal] = useState<boolean>(false);

  const deleteHandler = () => {
    URL.revokeObjectURL(file.preview);
    setFiles((prevState) => prevState.filter((f) => f !== file));
  };

  const content = (
    <>
      {file.type.includes("video") ? (
        <>
          <video
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ${height} ${width} object-cover`}
          >
            <source src={file.preview} type={file.type} />
          </video>
        </>
      ) : (
        <div
          className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${height} ${width} object-cover`}
        >
          <Image
            src={file.croppedPreview || file.preview}
            layout="fill"
            objectFit="cover"
            alt={file.name}
          />
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Image crop modal */}
      <ImageCropModal
        imageCropModal={imageCropModal}
        setImageCropModal={setImageCropModal}
        file={file}
        setFiles={setFiles}
      />
      <div
        onClick={deleteHandler}
        className="btn btn-circle btn-sm absolute top-3 right-3 z-10 border-none bg-black/50 hover:bg-black/30"
      >
        <MdClose />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute top-3 left-3 z-10 flex flex-row items-center justify-center rounded-md bg-black/50 p-2 text-white hover:cursor-pointer hover:bg-black/30"
          onClick={() => setImageCropModal(true)}
        >
          <MdOutlineModeEdit className="mr-1 h-6 w-6 self-center stroke-0 text-center" />
          <span>Edit</span>
        </div>
      </div>
      {content}
    </>
  );
};

export default memo(PreviewImageItem);
