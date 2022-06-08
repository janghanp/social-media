import Image from "next/image";

type Props = {
  image: string;
  signout: () => {};
};

const Avatar = ({ image, signout }: Props) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} className="avatar ml-5 mt-1 hover:cursor-pointer">
        <div className="w-8 rounded-full ring-primary transition duration-200 hover:ring">
          <Image src={image} alt="avatar" width={32} height={32} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 border-2 border-primary bg-base-100 p-2 shadow"
      >
        <li>
          <button onClick={() => signout()}>Sign Out</button>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;
