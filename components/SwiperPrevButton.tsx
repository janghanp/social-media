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
      className={`btn btn-circle btn-sm btn-ghost absolute top-32 left-3 z-10 text-white bg-black/50 hover:bg-black/30 ${
        (currentIndex === 0 || !prevRef.current) && "hidden"
      }`}
    >
      <MdOutlineArrowBackIosNew />
    </div>
  );
};

export default SwiperPrevButton;
