import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiCog, HiOutlineLogout, HiUserCircle } from 'react-icons/hi';

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

  const settingsHandler = () => {
    blurDropdown();
    router.push('/settings');
  };

  const profileHandler = () => {
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
          <div onClick={profileHandler}>
            <HiUserCircle className="h-5 w-5" />
            <span>Profile</span>
          </div>
        </li>
        <li>
          <div onClick={settingsHandler}>
            <HiCog className="h-5 w-5" />
            <span>Setttings</span>
          </div>
        </li>
        <li>
          <button onClick={signoutHandler}>
            <HiOutlineLogout className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;
