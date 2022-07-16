import { useSwiper } from "swiper/react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

interface Props {
  currentIndex: number;
}

const SwiperPrevButton = ({ currentIndex }: Props) => {
  const swiper = useSwiper();

  return (
    <div
      onClick={() => swiper.slidePrev()}
      className={`btn-circle btn-ghost btn-sm absolute top-1/2 left-3 z-30 flex -translate-y-1/2 items-center justify-center bg-black/50 text-white hover:cursor-pointer hover:bg-black/30 ${
        currentIndex === 0 && "hidden"
      }`}
    >
      <MdOutlineArrowBackIosNew />
    </div>
  );
};

export default SwiperPrevButton;
