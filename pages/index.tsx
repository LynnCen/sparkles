import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Layout from "../components/layout/layout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from 'next/router'
import { useEffect } from "react";
const Home: NextPage = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.push('/usermanual')
  }, [])
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            ""
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={""} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-sacle=1, maximum-scale=1"
        />
      </Head>
      <h1>TMMTMM</h1>
    </div>
  );
};
export const getStaticProps = async ({ ctx, locale }) => {


  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
    },
  };
};
export default Home;
