import { memo, useState, useCallback } from 'react';
import ReactDom from 'react-dom';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import FadeLoader from 'react-spinners/FadeLoader';
import produce from 'immer';

import { CustomFile } from '../types';
import getCroppedImg from '../lib/cropImage';
import { FormikErrors, FormikValues } from 'formik';

interface Props {
  file: CustomFile;
  formikFiles: CustomFile[];
  setImageToCrop: React.Dispatch<React.SetStateAction<CustomFile | undefined>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
}

const aspectRatios = [
  { value: 1 / 1, text: '1/1' },
  { value: 4 / 5, text: '4/5' },
  { value: 16 / 9, text: '16/9' },
];

const ImageCropModal = ({ file, formikFiles, setImageToCrop, setFieldValue }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(file.zoomInit || 1);
  const [crop, setCrop] = useState<Point>(file.cropInit || { x: 0, y: 0 });
  const [aspect, setAspect] = useState<{ value: number; text: string }>(aspectRatios[0]);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onReset = () => {
    // setFiles((prevState) => {
    //   const newFiles = prevState.map((f) => {
    //     if (f === file) {
    //       f.zoomInit = undefined;
    //       f.cropInit = undefined;
    //       f.aspectInit = undefined;
    //       f.croppedPreview = undefined;
    //       f.croppedImage = undefined;
    //       URL.revokeObjectURL(f.croppedPreview!);
    //       return f;
    //     } else {
    //       return f;
    //     }
    //   });
    //   return newFiles;
    // });

    const newFiles = produce(formikFiles, (draftState) => {
      draftState.forEach((draftStateFile) => {
        if (draftStateFile === file) {
          draftStateFile.zoomInit = undefined;
          draftStateFile.cropInit = undefined;
          draftStateFile.aspectInit = undefined;
          draftStateFile.croppedPreview = undefined;
          draftStateFile.croppedImage = undefined;
          URL.revokeObjectURL(draftStateFile.croppedPreview!);
        }
      });
    });

    setFieldValue('files', newFiles);

    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setAspect(aspectRatios[0]);
    setCroppedAreaPixels({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    });
    setImageToCrop(undefined);
  };

  const onCrop = async () => {
    setIsLoading(true);

    const { croppedImageUrl, croppedImageFile }: any = await getCroppedImg(
      file.preview,
      croppedAreaPixels
    );

    // setFiles((prevState) => {
    //   const newFiles = prevState.map((f) => {
    //     if (f === file) {
    //       f.zoomInit = zoom;
    //       f.cropInit = crop;
    //       f.aspectInit = aspect;
    //       f.croppedImage = croppedImageFile;
    //       f.croppedPreview = croppedImageUrl;
    //       return f;
    //     } else {
    //       return f;
    //     }
    //   });
    //   return newFiles;
    // });

    console.log(croppedImageFile);

    const newFiles = produce(formikFiles, (draftState) => {
      draftState.forEach((draftStateFile) => {
        if (draftStateFile === file) {
          draftStateFile.zoomInit = zoom;
          draftStateFile.cropInit = crop;
          draftStateFile.aspectInit = aspect;
          draftStateFile.croppedImage = croppedImageFile;
          draftStateFile.croppedPreview = croppedImageUrl;
        }
      });
    });

    setFieldValue('files', newFiles);

    setIsLoading(false);
    setImageToCrop(undefined);
  };

  return ReactDom.createPortal(
    <>
      (
      <div className="fixed top-1/2 left-1/2 z-40 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-white p-7 shadow-lg">
        <Cropper
          image={file.preview}
          zoom={zoom}
          crop={crop}
          aspect={aspect.value}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />

        <div className="absolute left-1/2 bottom-10 z-40 flex -translate-x-1/2 flex-col items-center justify-center gap-y-5">
          <div className="flex w-full items-center justify-center gap-x-5">
            <select
              className="select select-bordered select-xs max-w-xs"
              value={aspect.value}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setAspect({ value: +e.target.value, text: e.target.value });
              }}
            >
              {aspectRatios.map((ratio) => (
                <option key={ratio.text} value={ratio.value}>
                  {ratio.text}
                </option>
              ))}
            </select>
          </div>
          {!isLoading && (
            <div className="flex w-full items-center justify-center gap-x-10">
              <button
                className="btn btn-ghost bg-black/60 text-white hover:bg-black/30"
                onClick={onCrop}
              >
                crop
              </button>
              <button
                className="btn btn-ghost bg-black/60 text-white hover:bg-black/30"
                onClick={onReset}
              >
                reset
              </button>
              <button
                className="btn btn-ghost bg-black/60 text-white hover:bg-black/30"
                onClick={() => setImageToCrop(undefined)}
              >
                cancel
              </button>
            </div>
          )}
        </div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <FadeLoader
            loading={isLoading}
            color="#ffffff"
            height={15}
            width={5}
            radius={2}
            margin={2}
          />
        </div>
      </div>
      )
    </>,
    document.getElementById('image-crop-portal')!
  );
};

export default memo(ImageCropModal);
