import type { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <div className="container mx-auto border flex justify-center">
      {/* login card */}
      <div className="bg-base-100 border border-primary flex flex-col gap-y-5 justify-center items-center">
        {/* email input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email..."
            className="input input-bordered input-primary w-full"
          />
        </div>
        {/* password input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password..."
            className="input input-bordered input-primary w-full"
          />
        </div>
        <button className="btn btn-outline">Log in</button>
      </div>
    </div>
  );
};

export default Login;
