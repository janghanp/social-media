import { memo } from 'react';
import Image from 'next/image';
import { MdClose, MdOutlineModeEdit } from 'react-icons/md';

import { CustomFile } from '../types';

interface Props {
  customFile: CustomFile;
  isEditing: boolean;
  deleteFileFromFormik: (customFile: CustomFile) => void;
  setImageToCrop: React.Dispatch<React.SetStateAction<CustomFile | undefined>>;
}

const PreviewImageItem = ({ customFile, deleteFileFromFormik, setImageToCrop }: Props) => {
  let width, height, px, py;

  if (customFile.aspectInit?.value === 1) {
    width = 564;
    height = 564;
    px = 'px-0';
    py = 'py-0';
  } else if (customFile.aspectInit && customFile.aspectInit.value < 1) {
    width = 451;
    height = 564;
    px = 'px-[10%]';
    py = 'py-0';
  } else if (customFile.aspectInit && customFile.aspectInit.value > 1) {
    width = 564;
    height = 317;
    px = 'px-0';
    py = 'py-[21.9%]';
  } else {
    width = 564;
    height = 564;
    px = 'px-0';
    py = 'py-0';
  }

  return (
    <>
      <div
        onClick={() => deleteFileFromFormik(customFile)}
        className="btn btn-circle btn-sm absolute right-3 top-3 z-10 border-none bg-black/50 hover:bg-black/30"
      >
        <MdClose />
      </div>
      <div
        className="absolute left-3 top-3 z-10 flex flex-row items-center justify-center rounded-md bg-black/50 p-2 text-white hover:cursor-pointer hover:bg-black/30"
        onClick={() => setImageToCrop(customFile)}
      >
        <MdOutlineModeEdit className="mr-1 h-6 w-6 self-center stroke-0 text-center" />
        <span>Edit</span>
      </div>
      <div className={`h-auto w-auto ${px} ${py} bg-white`}>
        <Image
          layout="intrinsic"
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
