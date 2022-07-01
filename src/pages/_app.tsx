import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import Layout from "../components/Layout";
import { UserProvider } from "../context/user";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
