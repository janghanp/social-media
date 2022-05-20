import Image from "next/image";

type Props = {
  image: string;
  signout: () => {};
};

const Avatar = ({ image, signout }: Props) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} className="avatar ml-5 hover:cursor-pointer mt-1">
        <div className="w-8 rounded-full hover:ring ring-primary">
          <Image src={image} alt="avatar" width={32} height={32} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border-2 border-primary"
      >
        <li>
          <button onClick={() => signout()}>Sign Out</button>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;