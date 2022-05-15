const Navbar = () => {
  return (
    <div className="w-full border-b border-primary shadow-lg">
      <div className="container mx-auto">
        <div className="navbar bg-base-100">
          {/* left */}
          {/* logo */}
          <div className="flex-1">
            <div className="btn btn-ghost normal-case text-xl">Logo</div>
          </div>

          {/* right */}
          <div className="flex-none">
            <div className="btn btn-ghost">log in</div>
            <div className="btn btn-outline ml-5">sign up</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
