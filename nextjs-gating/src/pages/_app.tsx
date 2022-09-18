import "../styles/globals.css";
import type { AppProps } from "next/app";
import { fetchJson } from "~/utils";
import { SWRConfig } from "swr";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default CustomApp;
