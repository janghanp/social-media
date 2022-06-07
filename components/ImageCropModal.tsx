import { memo, useState, useCallback } from "react";
import ReactDom from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

import { RiArrowGoBackFill } from "react-icons/ri";

import { CustomFile } from "./DropZone";
import getCroppedImg from "../lib/cropImage";

interface Props {
  file: CustomFile;
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
  imageCropModal: boolean;
  setImageCropModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const aspectRatios = [
  { value: 1 / 1, text: "1/1" },
  { value: 4 / 5, text: "4/5" },
  { value: 16 / 9, text: "16/9" },
];

const ImageCropModal = ({
  setImageCropModal,
  file,
  setFiles,
  imageCropModal,
}: Props) => {
  const [zoom, setZoom] = useState<number>(file.zoomInit || 1);
  const [crop, setCrop] = useState<Point>(file.cropInit || { x: 0, y: 0 });
  const [aspect, setAspect] = useState<{ value: number; text: string }>(
    aspectRatios[0]
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onReset = () => {
    setFiles((prevState) => {
      const newFiles = prevState.map((f) => {
        if (f === file) {
          f.zoomInit = undefined;
          f.cropInit = undefined;
          f.aspectInit = undefined;
          f.croppedPreview = undefined;

          URL.revokeObjectURL(f.croppedPreview!);

          return f;
        } else {
          return f;
        }
      });

      return newFiles;
    });

    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setAspect(aspectRatios[0]);
    setCroppedAreaPixels({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    });

    setImageCropModal(false);
  };

  const onCrop = async () => {
    const croppedImageUrl: any = await getCroppedImg(
      file.preview,
      croppedAreaPixels
    );

    //Set created croppedImageUrl into associated file.
    setFiles((prevState) => {
      const newFiles = prevState.map((f) => {
        if (f === file) {
          f.croppedPreview = croppedImageUrl;
          return f;
        } else {
          return f;
        }
      });

      return newFiles;
    });

    //Close modal.
    setImageCropModal(false);
  };

  return ReactDom.createPortal(
    <AnimatePresence exitBeforeEnter>
      {imageCropModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-1/2 left-1/2 w-[95%] lg:w-[1000px] h-full -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-primary z-40 p-7 shadow-lg rounded-md"
        >
          <RiArrowGoBackFill
            className="w-10 h-10 hover:cursor-pointer hover:bg-black/30 p-2 rounded-md transition duration-200 relative z-40 bg-black/60 text-white"
            onClick={() => setImageCropModal(false)}
          />
          {/* Image crop */}
          <Cropper
            image={file.preview}
            zoom={zoom}
            crop={crop}
            aspect={aspect.value}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />

          {/* Controls */}
          <div className="flex flex-col justify-center items-center w-full gap-y-5 absolute z-40 left-1/2 -translate-x-1/2  bottom-10 ">
            {/* Range */}
            <div className="w-full flex justify-center items-center gap-x-5">
              <input
                className="range range-xs w-1/3"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setZoom(+e.target.value);
                }}
              />
              {/* Ratios */}
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
            {/* Button groups */}
            <div className="flex justify-center items-center w-full gap-x-10">
              <button
                className="btn btn-ghost bg-black/60 hover:bg-black/30 text-white"
                onClick={() => setImageCropModal(false)}
              >
                cancel
              </button>
              <button
                className="btn btn-ghost bg-black/60 hover:bg-black/30 text-white"
                onClick={onReset}
              >
                reset
              </button>
              <button
                className="btn btn-ghost bg-black/60 hover:bg-black/30 text-white"
                onClick={onCrop}
              >
                crop
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("image-crop-portal")!
  );
};

export default memo(ImageCropModal);
