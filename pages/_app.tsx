import "../styles/globals.scss";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
const MyApp = React.forwardRef(function MyApp({ Component, pageProps = {}, router }: AppProps, ref) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
})

export const getStaticProps = async ({ ctx, router, locale }) => {
  return {
    pageProps: {
      ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
    },
  };
};
export default appWithTranslation(MyApp);
