import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import axios from "axios";
import { SWRConfig } from "swr";

import Layout from "../components/Layout";
import "../styles/globals.css";

async function fetcher(url: string) {
  return axios.get(url).then((res) => res.data);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <SessionProvider refetchOnWindowFocus={false} session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </SWRConfig>
  );
}

export default MyApp;
