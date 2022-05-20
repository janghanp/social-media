import type { NextPage, GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";

import { AiOutlineGithub } from "react-icons/ai";
import { AiOutlineGoogle } from "react-icons/ai";
import { AiOutlineFacebook } from "react-icons/ai";
import { AiOutlineWarning } from "react-icons/ai";

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
  const router = useRouter();

  const [signInError, setSignInError] = useState<string>("");

  useEffect(() => {
    const { error } = router.query;

    if (error) {
      setSignInError(
        "To confirm your identity, sign in with the same account you used originally."
      );
    }
  }, []);

  return (
    <div className="container max-w-4xl mx-auto flex justify-center items-center min-h-screen flex-col">
      {signInError && (
        <div className="fixed top-60 alert alert-warning shadow-lg max-w-2xl">
          <div>
            <AiOutlineWarning className="w-6 h-6 flex-shrink-0 stroke-current" />
            <span>{signInError}</span>
          </div>
        </div>
      )}
      <div className="max-w-md w-full mx-auto text-2xl">
        <div className="text-3xl font-bold text-primary mt-2 text-center">
          Welcome
        </div>
      </div>

      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-primary shadow-md">
        {/* auth providers group */}
        <div className="flex flex-col space-y-6">
          <button
            className="btn btn-outline w-full flex flex-row items-center justify-center"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <AiOutlineGithub className="w-5 h-5 mr-3" />
            <span>Sign in with github</span>
          </button>
          <button
            className="btn btn-outline w-full flex flex-row items-center justify-center"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <AiOutlineGoogle className="w-5 h-5 mr-3" />
            <span>Sign in with google</span>
          </button>
          <button
            className="btn btn-outline w-full flex flex-row items-center justify-center"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
          >
            <AiOutlineFacebook className="w-5 h-5 mr-3" />
            <span>Sign in with facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
