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
      className={`btn-circle btn-ghost btn-sm absolute top-1/2 right-3 z-30 flex -translate-y-1/2 items-center justify-center bg-black/50 text-white hover:cursor-pointer hover:bg-black/30 ${
        currentIndex === fileLength - 1 && "hidden"
      }`}
    >
      <MdOutlineArrowForwardIos />
    </div>
  );
};

export default SwiperNextButton;
