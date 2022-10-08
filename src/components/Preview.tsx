import { useRef, useState, useEffect } from 'react';
import { Pagination, Navigation, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FormikErrors } from 'formik';
import produce from 'immer';

import { CustomFile, FormikValues } from '../types';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import PreviewImageItem from './PreviewImageItem';
import SwiperPrevButton from './SwiperPrevButton';
import SwiperNextButton from './SwiperNextButton';
import axios from 'axios';
import ImageCropModal from './ImageCropModal';

interface Props {
  formikFiles: CustomFile[];
  isEditing: boolean;
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
  const [editInitialized, setEditInitialized] = useState<boolean>(false);
  // const [isImageCropModalOpen, setIsImageCropModalOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<CustomFile>();

  useEffect(() => {
    if (isEditing) {
      setEditInitialized(true);
    }
  }, []);

  const uploadFileToS3 = async (file: CustomFile) => {
    //1. set isUploading to true.
    const newFiles = produce(formikFiles, (draftState) => {
      draftState.forEach((draftStateFile) => {
        if (draftStateFile === file) {
          draftStateFile.uploaded = false;
          draftStateFile.isUploading = true;
        }
      });
    });

    setFieldValue('files', newFiles);

    //2.upload the file to the bucket
    const formData = new FormData();
    formData.append('file', file.croppedImage || file);
    const { data } = await axios.post('/api/upload', formData);

    //3. update values of the corrsponding file.
    const anotherNewFiles = produce(formikFiles, (draftState) => {
      draftState.forEach((draftStateFile) => {
        if (draftStateFile === file) {
          draftStateFile.Key = data.Key;
          draftStateFile.uploaded = true;
          draftStateFile.isUploading = false;
        }
      });
    });

    setFieldValue('files', anotherNewFiles);
  };

  const deleteFileFromFormik = (file: CustomFile) => {
    URL.revokeObjectURL(file.preview);

    const filteredFiles = formikFiles.filter((formikFile) => formikFile !== file);

    setFieldValue('files', filteredFiles);
  };

  return (
    <>
      <div className="mt-5 box-content h-auto w-auto overflow-hidden rounded-md border border-primary">
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
          {formikFiles.map((file, index) => (
            <SwiperSlide key={index}>
              <PreviewImageItem
                file={file}
                isEditing={isEditing}
                editInitialized={editInitialized}
                deleteFileFromFormik={deleteFileFromFormik}
                uploadFileToS3={uploadFileToS3}
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
          file={imageToCrop}
          formikFiles={formikFiles}
          setImageToCrop={setImageToCrop}
          setFieldValue={setFieldValue}
        />
      )}
    </>
  );
};

export default Preview;
