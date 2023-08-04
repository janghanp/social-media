import { useSwiper } from 'swiper/react';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

interface Props {
  currentIndex: number;
  fileLength: number;
}

const SwiperNextButton = ({ currentIndex, fileLength }: Props) => {
  const swiper = useSwiper();

  return (
    <div
      onClick={() => swiper.slideNext()}
      className={`btn-circle btn-ghost btn-sm absolute right-3 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center  bg-black/50 text-white hover:cursor-pointer hover:bg-black/30 ${
        currentIndex === fileLength - 1 && 'hidden'
      }`}
    >
      <MdOutlineArrowForwardIos />
    </div>
  );
};

export default SwiperNextButton;
