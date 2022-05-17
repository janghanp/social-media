import type { NextPage, GetServerSideProps } from "next";
import { signIn, getSession } from "next-auth/react";

import { AiOutlineGithub } from "react-icons/ai";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
};

const Login: NextPage = () => {
  return (
    <div className="container mx-auto flex justify-center min-h-screen flex-col">
      <div className="max-w-md w-full mx-auto text-2xl">
        <div className="text-3xl font-bold text-primary mt-2 text-center">
          Log In
        </div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-primary">
        <button
          className="btn btn-outline w-full flex flex-row items-center justify-center"
          onClick={() => signIn("github")}
        >
          <AiOutlineGithub className="w-5 h-5 mr-3" />
          <span>Log in with github</span>
        </button>
        <div className="divider">OR</div>
        <form action="" className="space-y-10">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input type="text" className="input input-primary w-full" />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <input type="password" className="input input-primary w-full" />
          </div>

          <button className="btn btn-outline w-full">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
