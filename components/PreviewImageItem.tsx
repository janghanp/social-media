import { useState, memo } from "react";
import { MdClose, MdOutlineImageSearch } from "react-icons/md";

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

  console.log("previewimage item render");

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
        className="btn btn-circle btn-sm absolute top-3 right-3 bg-black/50 hover:bg-black/30 border-none z-10"
      >
        <MdClose />
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <div
          className="text-white bg-black/50 hover:bg-black/30 p-2 rounded-md hover:cursor-pointer flex flex-col justify-center items-center"
          onClick={() => setImageCropModal(true)}
        >
          <MdOutlineImageSearch className="w-8 h-8 text-center self-center stroke-0" />
          Edit
        </div>
      </div>
      {content}
    </>
  );
};

export default memo(PreviewImageItem);
