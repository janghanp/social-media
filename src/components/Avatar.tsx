import Image from 'next/image';
import { useRouter } from 'next/router';

interface Props {
  image: string;
  username: string;
  signout: () => {};
}

const Avatar = ({ image, username, signout }: Props) => {
  const router = useRouter();

  const blurDropdown = () => {
    document.getElementById('dropdown-menu')?.blur();
  };

  const editProfileHanlder = () => {
    blurDropdown();
    router.push('/profile');
  };

  const signoutHandler = () => {
    blurDropdown();
    signout();
  };

  return (
    <div id="dropdown" className="dropdown dropdown-end">
      <div tabIndex={0} className="avatar ml-5 mt-1 hover:cursor-pointer">
        <div className="w-8 rounded-full ring-primary transition duration-200 hover:ring">
          <Image src={image} alt="avatar" width={32} height={32} />
        </div>
      </div>
      <ul
        tabIndex={0}
        id="dropdown-menu"
        className="dropdown-content menu rounded-box w-52 border-2 border-primary bg-base-100 p-2 shadow"
      >
        <li>
          <div className="text-gray-500 hover:cursor-default">@{username}</div>
        </li>
        <li>
          <div onClick={editProfileHanlder}>Profile</div>
        </li>
        <li>
          <button onClick={signoutHandler}>Sign Out</button>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;
