import { CustomFile } from "./DropZone";

const Preview = ({ files }: { files: CustomFile[] }) => {
  return (
    <div className="relative -z-10">
      {files.map((file, index) => {
        console.log(file.name + index);

        return (
          <div key={file.name + index}>
            <img
              src={file.preview}
              alt={file.name}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Preview;
