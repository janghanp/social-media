import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { MdClose, MdOutlineModeEdit } from 'react-icons/md';

import { CustomFile } from '../types';
import ImageCropModal from './ImageCropModal';
import { previewItemRatio } from '../lib/previewItemRatio';

interface Props {
  file: CustomFile;
  isEditing: boolean;
  editInitialized: boolean;
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
}

const PreviewImageItem = ({
  file,
  isEditing,
  editInitialized,
  setFiles,
}: Props) => {
  const { width, height, px, py } = previewItemRatio(file.aspectInit!.value);

  const [imageCropModal, setImageCropModal] = useState<boolean>(false);

  useEffect(() => {
    const uploadFile = async () => {
      setFiles((prevState) =>
        prevState.map((f) => {
          if (f === file) {
            f.isUploading = true;

            return f;
          }

          return f;
        })
      );

      const formData = new FormData();
      formData.append('file', file.croppedImage || file);

      const { data } = await axios.post('/api/upload', formData);

      setFiles((prevState) =>
        prevState.map((f) => {
          if (f === file) {
            f.Key = data.Key;
            f.uploaded = true;
            f.isUploading = false;

            return f;
          }

          return f;
        })
      );
    };

    if (isEditing && !editInitialized) {
      return;
    } else {
      uploadFile();
    }
  }, [file.croppedImage]);

  const deleteHandler = () => {
    URL.revokeObjectURL(file.preview);
    setFiles((prevState) => prevState.filter((f) => f !== file));
  };

  return (
    <>
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
      <div
        className="absolute top-3 left-3 z-10 flex flex-row items-center justify-center rounded-md bg-black/50 p-2 text-white hover:cursor-pointer hover:bg-black/30"
        onClick={() => setImageCropModal(true)}
      >
        <MdOutlineModeEdit className="mr-1 h-6 w-6 self-center stroke-0 text-center" />
        <span>Edit</span>
      </div>
      <div className={`h-auto w-auto ${px} ${py} bg-white`}>
        <Image
          layout="responsive"
          objectFit="cover"
          width={width}
          height={height}
          src={file.croppedPreview || file.preview}
          alt="image"
        />
      </div>
    </>
  );
};

export default memo(PreviewImageItem);
