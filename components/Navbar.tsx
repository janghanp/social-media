import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { HiOutlinePlus } from "react-icons/hi";

import Avatar from "./Avatar";
import PostModal from "./PostModal";

const Navbar = () => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="w-full border-b border-primary shadow-lg fixed top-0 bg-base-100 z-20">
        <div className="container max-w-4xl mx-auto">
          <div className="navbar justify-between bg-base-100 px-5 lg:px-0">
            {/* left */}
            <Link href={"/"}>
              <div className="normal-case text-xl font-semibold hover:cursor-pointer">
                Social Media
              </div>
            </Link>

            {/* right */}
            {session ? (
              <div className="flex flex-row justify-center items-center">
                <HiOutlinePlus
                  onClick={() => setIsOpen(true)}
                  className="w-8 h-8 hover:cursor-pointer"
                />
                <Avatar image={session.user.image} signout={signOut} />
              </div>
            ) : (
              <div className="flex flex-row">
                <Link href={"/login"}>
                  <div className="btn btn-ghost">log in</div>
                </Link>
                <Link href={"/signup"}>
                  <div className="btn btn-outline ml-5">sign up</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <PostModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;
