import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full border-b border-primary shadow-lg fixed top-0">
      <div className="container mx-auto">
        <div className="navbar bg-base-100">
          {/* left */}
          {/* logo */}
          <Link href={"/"}>
            <div className="flex-1">
              <div className="btn btn-ghost normal-case text-xl">Logo</div>
            </div>
          </Link>

          {/* right */}
          <div className="flex-none">
            <Link href={"/login"}>
              <div className="btn btn-ghost">log in</div>
            </Link>
            <Link href={"/signup"}>
              <div className="btn btn-outline ml-5">sign up</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
