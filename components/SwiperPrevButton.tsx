import { RefObject } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

interface Props {
  prevRef: RefObject<HTMLDivElement>;
  currentIndex: number;
}

const SwiperPrevButton = ({ prevRef, currentIndex }: Props) => {
  return (
    <div
      ref={prevRef}
      className={`flex justify-center items-center btn-circle btn-sm btn-ghost absolute top-1/2 -translate-y-1/2 left-3 z-10 text-white bg-black/50 hover:bg-black/30 hover:cursor-pointer ${
        (currentIndex === 0 || !prevRef.current) && "hidden"
      }`}
    >
      <MdOutlineArrowBackIosNew />
    </div>
  );
};

export default SwiperPrevButton;
