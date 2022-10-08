import axios from 'axios';
import { Fragment } from 'react';
import useSWR from 'swr';
import { PropagateLoader } from 'react-spinners';

import { User } from '../types';
import Friend from './Friend';
import FriendshipList from './FriendshipList';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface Props {
  postAuthorId: string;
  status: string;
  closeFriendshipModal: () => void;
  toggleFriendship: (requesterId: string, receiverId: string, isFollowing: boolean) => void;
}

const FriendshipModal = ({
  postAuthorId,
  status,
  closeFriendshipModal,
  toggleFriendship,
}: Props) => {
  const { data: friendsList, error } = useSWR(
    `/api/friendship?status=${status}&postAuthorId=${postAuthorId}`,
    fetcher
  );

  const modalTitle = status === 'isFollowing' ? 'Following' : 'Followers';

  return (
    <>
      <div
        onClick={closeFriendshipModal}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
      ></div>

      <div className="fixed left-1/2 top-1/2 z-40 h-auto min-h-[500px] w-3/5 max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-5 shadow-lg md:w-11/12 lg:w-10/12 xl:w-[1150px]">
        <div className="flex w-full flex-col items-center justify-center">
          {error && <div className="text-red-500">failed to load...</div>}

          {!friendsList && !error ? (
            <div className="absolute top-1/2 -translate-y-1/2">
              <PropagateLoader color="gray" />
            </div>
          ) : (
            <>
              <div className="w-full border-b pb-3 text-center font-semibold normal-case">
                {modalTitle}
              </div>

              <FriendshipList>
                {friendsList.map((friend: User) => {
                  return (
                    <Fragment key={friend.id}>
                      <Friend
                        friend={friend}
                        closeFriendshipModal={closeFriendshipModal}
                        toggleFriendship={toggleFriendship}
                      />
                    </Fragment>
                  );
                })}
              </FriendshipList>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FriendshipModal;
