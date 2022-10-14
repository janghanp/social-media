import { useRef, useState } from 'react';
import { Pagination, Navigation, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FormikErrors } from 'formik';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { CustomFile, FormikValues } from '../types';
import PreviewImageItem from './PreviewImageItem';
import SwiperPrevButton from './SwiperPrevButton';
import SwiperNextButton from './SwiperNextButton';
import ImageCropModal from './ImageCropModal';

interface Props {
  isEditing: boolean;
  formikFiles: CustomFile[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
}

const Preview = ({ formikFiles, isEditing, setFieldValue }: Props) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imageToCrop, setImageToCrop] = useState<CustomFile>();

  const deleteFileFromFormik = (customFile: CustomFile) => {
    URL.revokeObjectURL(customFile.preview);
    const filteredCustomFiles = formikFiles.filter((formikFile) => formikFile !== customFile);
    setFieldValue('files', filteredCustomFiles);
  };

  return (
    <>
      <div className="mt-5 overflow-hidden">
        <Swiper
          effect="fade"
          allowTouchMove={false}
          modules={[Pagination, Navigation, EffectFade]}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current!,
            nextEl: nextRef.current!,
          }}
          pagination={{ clickable: true }}
          onSlideChange={(slide) => {
            setCurrentIndex(slide.activeIndex);
          }}
        >
          {formikFiles.map((formikFile, index) => (
            <SwiperSlide key={index}>
              <PreviewImageItem
                customFile={formikFile}
                isEditing={isEditing}
                deleteFileFromFormik={deleteFileFromFormik}
                setImageToCrop={setImageToCrop}
              />
            </SwiperSlide>
          ))}
          <SwiperPrevButton currentIndex={currentIndex} />
          <SwiperNextButton currentIndex={currentIndex} fileLength={formikFiles.length} />
        </Swiper>
      </div>

      {imageToCrop && (
        <ImageCropModal
          customFile={imageToCrop}
          formikFiles={formikFiles}
          setImageToCrop={setImageToCrop}
          setFieldValue={setFieldValue}
        />
      )}
    </>
  );
};

export default Preview;
