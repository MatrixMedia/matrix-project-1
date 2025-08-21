// npm or yarn use and after import  use
//import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/customcss.css";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/responsive.css";
import "../styles/landingPage.css";
import { QueryClientProviderWrapper } from "../QueryClient";
// import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
  }, []);

 

  return (
    <>
      <QueryClientProviderWrapper>
        <Head>
          {/* // Responsive meta tag */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="icon"
            href="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
          />
          {/* // bootstrap CDN */}
        </Head>
        <Component {...pageProps} />
      </QueryClientProviderWrapper>
    </>
  );
}

export default MyApp;
