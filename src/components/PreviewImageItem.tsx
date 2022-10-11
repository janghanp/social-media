import { memo } from 'react';
import Image from 'next/image';
import { MdClose, MdOutlineModeEdit } from 'react-icons/md';

import { CustomFile } from '../types';
import { previewItemRatio } from '../lib/previewItemRatio';

interface Props {
  customFile: CustomFile;
  isEditing: boolean;
  deleteFileFromFormik: (customFile: CustomFile) => void;
  setImageToCrop: React.Dispatch<React.SetStateAction<CustomFile | undefined>>;
}

const PreviewImageItem = ({ customFile, deleteFileFromFormik, setImageToCrop }: Props) => {
  const { width, height, px, py } = previewItemRatio(customFile.aspectInit?.value);

  return (
    <>
      <div
        onClick={() => deleteFileFromFormik(customFile)}
        className="btn btn-circle btn-sm absolute top-3 right-3 z-10 border-none bg-black/50 hover:bg-black/30"
      >
        <MdClose />
      </div>
      <div
        className="absolute top-3 left-3 z-10 flex flex-row items-center justify-center rounded-md bg-black/50 p-2 text-white hover:cursor-pointer hover:bg-black/30"
        onClick={() => setImageToCrop(customFile)}
      >
        <MdOutlineModeEdit className="mr-1 h-6 w-6 self-center stroke-0 text-center" />
        <span>Edit</span>
      </div>
      <div className={`h-auto w-auto ${px} ${py} flex items-center justify-center bg-white`}>
        <Image
          layout="fixed"
          objectFit="cover"
          width={width}
          height={height}
          src={customFile.croppedPreview || customFile.preview}
          alt="image"
        />
      </div>
    </>
  );
};

export default memo(PreviewImageItem);
