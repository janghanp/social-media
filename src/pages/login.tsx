import { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';

import { AiOutlineGithub } from 'react-icons/ai';
import { AiOutlineGoogle } from 'react-icons/ai';
import { AiOutlineFacebook } from 'react-icons/ai';
import { AiOutlineWarning } from 'react-icons/ai';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {},
  };
};

const Login: NextPage = () => {
  const router = useRouter();

  const [signInError, setSignInError] = useState<string>('');

  useEffect(() => {
    const { error } = router.query;

    if (error) {
      setSignInError(
        'To confirm your identity, sign in with the same account you used originally.'
      );
    }
  }, [router.query]);

  return (
    <div className="container mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center">
      {signInError && (
        <div className="alert alert-warning fixed top-60 max-w-2xl shadow-lg">
          <div>
            <AiOutlineWarning className="h-6 w-6 flex-shrink-0 stroke-current" />
            <span>{signInError}</span>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-md text-2xl">
        <div className="mt-2 text-center text-3xl font-bold text-primary">
          Welcome
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-md border border-primary bg-white p-8 shadow-md">
        {/* auth providers group */}
        <div className="flex flex-col space-y-6">
          <button
            className="btn btn-outline flex w-full flex-row items-center justify-center"
            onClick={() => signIn('github', { callbackUrl: '/' })}
          >
            <AiOutlineGithub className="mr-3 h-5 w-5" />
            <span>Sign in with github</span>
          </button>
          <button
            className="btn btn-outline flex w-full flex-row items-center justify-center"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <AiOutlineGoogle className="mr-3 h-5 w-5" />
            <span>Sign in with google</span>
          </button>
          <button
            className="btn btn-outline flex w-full flex-row items-center justify-center"
            onClick={() => signIn('facebook', { callbackUrl: '/' })}
          >
            <AiOutlineFacebook className="mr-3 h-5 w-5" />
            <span>Sign in with facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
