import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import TDK from "../../components/TDK/TDK";
import { GetStaticProps } from 'next';
import { AppProps } from 'next/app';
import type { NextPage } from "next";

const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  return (
    <>
      <TDK title={t("user-mannual")} />
      <h1>{t("user-mannual")}</h1>
      <h2>{t("intrudce")}</h2>
      <h4 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>
        {t("name")}
        {t("TmmTmm")}
      </h4>
      <h4 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>
        {t("slogan")}
      </h4>
      <h4 style={{ paddingLeft: "0" }}>{t("slogan-description")}</h4>
      <h4 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>
        {t("brief")}
      </h4>
      <h4 style={{ paddingLeft: "0" }}>{t("brief-description")}</h4>
      <br />
      <h4 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>
        {t("Official-website")}
        <a href="https://tmmtmm.com.tr/">https://tmmtmm.com.tr/</a>
      </h4>
      <h4 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>
        {t("download-address")}
        <a href="https://tmmtmm.com.tr/download.html">
          https://tmmtmm.com.tr/download.html
        </a>
      </h4>
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
