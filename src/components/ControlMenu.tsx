import { useState } from 'react';

interface Props {
  type: 'post' | 'comment';
  isOwner: boolean;
  isOpen: boolean;
  isChild?: boolean;
  deleteHandler: () => {};
  editHandler?: () => {};
  setToggleControlMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlMenu = ({
  isChild,
  isOpen,
  isOwner,
  type,
  setToggleControlMenu,
  deleteHandler,
  editHandler,
}: Props) => {
  const [toggleConfirm, setToggleConfirm] = useState<boolean>(false);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        {toggleConfirm ? (
          <div className="h-auto w-4/5 max-w-md rounded-md  border border-primary bg-base-100 p-10 shadow-md">
            <div className="text-center text-lg font-semibold">
              Are you sure you want to delete this {type}?
            </div>
            <div className="mt-5 flex items-center justify-center gap-x-3">
              <button
                onClick={deleteHandler}
                className="btn btn-outline btn-warning"
              >
                yes
              </button>
              <button
                onClick={() => {
                  setToggleConfirm(false);
                  setToggleControlMenu(false);
                }}
                className="btn btn-outline"
              >
                no
              </button>
            </div>
          </div>
        ) : (
          <ul className="menu w-4/5 max-w-md rounded-md border border-primary bg-base-100 shadow-md">
            {isOwner && !isChild && (
              <li
                onClick={editHandler}
                className="border-b p-3 text-center transition duration-200 hover:cursor-pointer hover:bg-gray-200"
              >
                edit
              </li>
            )}
            <li
              onClick={() => setToggleConfirm(true)}
              className="border-b p-3 text-center font-semibold text-warning transition duration-200 hover:cursor-pointer hover:bg-gray-200"
            >
              delete
            </li>
            <li
              onClick={() => setToggleControlMenu(false)}
              className="p-3 text-center transition duration-200 hover:cursor-pointer hover:bg-gray-200"
            >
              cancel
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default ControlMenu;
