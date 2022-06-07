import ReactDom from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { RiArrowGoBackFill } from "react-icons/ri";

import { CustomFile } from "./DropZone";

interface Props {
  file: CustomFile;
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
  imageCropModal: boolean;
  setImageCropModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageCropModal = ({
  setImageCropModal,
  file,
  setFiles,
  imageCropModal,
}: Props) => {
  return ReactDom.createPortal(
    <AnimatePresence exitBeforeEnter>
      {imageCropModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-1/2 left-1/2 w-[95%] lg:w-[1000px] min-h-screen -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-primary z-40 p-7 shadow-lg rounded-md"
        >
          <RiArrowGoBackFill
            className="2-8 h-8 hover:cursor-pointer hover:bg-blue-500"
            onClick={() => setImageCropModal(false)}
          />
          {JSON.stringify(file, null, 4)}
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("image-crop-portal")!
  );
};

export default ImageCropModal;
