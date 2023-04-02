import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");

  return (
    <>
      <TDK title={`${t("video-limit")} | ${t("fa")}`} />
      <h2>{t("video-limit")}</h2>
      <h4>{t("video-limit-reply")}</h4>
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
