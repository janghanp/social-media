import { useState, memo } from "react";
import { MdClose, MdOutlineModeEdit } from "react-icons/md";

import { CustomFile } from "./DropZone";
import ImageCropModal from "./ImageCropModal";

type Props = {
  file: CustomFile;
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
};

const PreviewImageItem = ({ file, setFiles }: Props) => {
  const [imageCropModal, setImageCropModal] = useState<boolean>(false);

  const deleteHandler = () => {
    URL.revokeObjectURL(file.preview);
    setFiles((prevState) => prevState.filter((f) => f !== file));
  };

  const content = (
    <>
      {file.type.includes("video") ? (
        <>
          <video className="h-80 w-full object-cover">
            <source src={file.preview} type={file.type} />
          </video>
        </>
      ) : (
        <>
          <img
            className="h-80 w-full object-cover"
            src={file.croppedPreview || file.preview}
            alt={file.name}
          />
        </>
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
          className="absolute top-3 left-3 flex flex-row items-center justify-center rounded-md bg-black/50 p-2 text-white hover:cursor-pointer hover:bg-black/30"
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
