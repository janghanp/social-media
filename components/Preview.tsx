import { memo } from "react";
import { CustomFile } from "./DropZone";

const Preview = ({ files }: { files: CustomFile[] }) => {
  return (
    <div className="relative -z-10 flex flex-col justify-center items-center">
      {files.map((file, index) => {
        const fileContent = (
          <>
            {file.type.includes("video") ? (
              <>
                <video>
                  <source src={file.preview} type={file.type} />
                </video>
              </>
            ) : (
              <>
                <img
                  src={file.preview}
                  alt={file.name}
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
              </>
            )}
          </>
        );

        return <div key={file.name + index}>{fileContent}</div>;
      })}
    </div>
  );
};

export default memo(Preview);
