import { memo, useState, useCallback, useEffect } from 'react';
import ReactDom from 'react-dom';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import FadeLoader from 'react-spinners/FadeLoader';
import { v4 as uuidv4 } from 'uuid';

import { CustomFile } from '../types';
import getCroppedImg from '../lib/cropImage';
import { FormikErrors, FormikValues } from 'formik';

const aspectRatios = [
  { value: 1 / 1, text: '1/1' },
  { value: 4 / 5, text: '4/5' },
  { value: 16 / 9, text: '16/9' },
];

interface Props {
  customFile: CustomFile;
  formikFiles: CustomFile[];
  setImageToCrop: React.Dispatch<React.SetStateAction<CustomFile | undefined>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
}

const ImageCropModal = ({ customFile, formikFiles, setImageToCrop, setFieldValue }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(customFile.zoomInit || 1);
  const [crop, setCrop] = useState<Point>(customFile.cropInit || { x: 0, y: 0 });
  const [aspect, setAspect] = useState<{ value: number; text: string }>(
    customFile.aspectInit || aspectRatios[0]
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (customFile.aspectInit) {
      setAspect(customFile.aspectInit);
    }

    if (customFile.zoomInit) {
      setZoom(customFile.zoomInit);
    }

    if (customFile.cropInit) {
      setCrop(customFile.cropInit);
    }
  }, [customFile.aspectInit, customFile.zoomInit, customFile.cropInit]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onCrop = async () => {
    setIsLoading(true);

    const { croppedImageUrl, croppedImageFile }: any = await getCroppedImg(
      customFile.preview,
      croppedAreaPixels
    );

    const clonedFormikFiles = formikFiles.map((formikFile) => {
      return {
        ...formikFile,
      };
    });

    const newFormikFiles = clonedFormikFiles.map((deepClonedFormikFile) => {
      if (customFile.id === deepClonedFormikFile.id) {
        deepClonedFormikFile.id = uuidv4();
        deepClonedFormikFile.zoomInit = zoom;
        deepClonedFormikFile.cropInit = crop;
        deepClonedFormikFile.aspectInit = aspect;
        deepClonedFormikFile.croppedImage = croppedImageFile;
        deepClonedFormikFile.croppedPreview = croppedImageUrl;

        return deepClonedFormikFile;
      }

      return deepClonedFormikFile;
    });

    setFieldValue('files', newFormikFiles);

    setIsLoading(false);
    setImageToCrop(undefined);
  };

  const onReset = () => {
    const clonedFormikFiles = formikFiles.map((formikFile) => {
      return {
        ...formikFile,
      };
    });

    const newFormikFiles = clonedFormikFiles.map((deepClonedFormikFile) => {
      if (customFile.id === deepClonedFormikFile.id) {
        deepClonedFormikFile.id = uuidv4();
        deepClonedFormikFile.zoomInit = undefined;
        deepClonedFormikFile.cropInit = undefined;
        deepClonedFormikFile.aspectInit = undefined;
        deepClonedFormikFile.croppedPreview = undefined;
        deepClonedFormikFile.croppedImage = undefined;
        deepClonedFormikFile.Key = undefined;
        URL.revokeObjectURL(deepClonedFormikFile.croppedPreview!);

        return deepClonedFormikFile;
      }

      return deepClonedFormikFile;
    });

    setFieldValue('files', newFormikFiles);

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

  return ReactDom.createPortal(
    <>
      (
      <div className="fixed left-1/2 top-1/2 z-40 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-white p-7 shadow-lg">
        <Cropper
          image={customFile.preview}
          zoom={zoom}
          crop={crop}
          aspect={aspect.value}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />

        <div className="absolute bottom-10 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center justify-center gap-y-5">
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
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
