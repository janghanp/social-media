import { RefObject } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface Props {
  nextRef: RefObject<HTMLDivElement>;
  currentIndex: number;
  fileLength: number;
}

const SwiperNextButton = ({ nextRef, currentIndex, fileLength }: Props) => {
  return (
    <div
      ref={nextRef}
      className={` flex justify-center items-center btn-circle btn-sm btn-ghost absolute top-1/2 -translate-y-1/2 right-3 z-10 text-white bg-black/50 hover:bg-black/30 hover:cursor-pointer ${
        currentIndex === fileLength - 1 && "hidden"
      }`}
    >
      <MdOutlineArrowForwardIos />
    </div>
  );
};

export default SwiperNextButton;
