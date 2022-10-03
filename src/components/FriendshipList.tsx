interface Props {
  children: React.ReactNode;
}

const FriendshipList = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col gap-y-5 py-5">
      {children}
    </div>
  );
};

export default FriendshipList;
