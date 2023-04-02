import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");

  return (
    <>
      <TDK title={`${t("another-videoing")} | ${t("fa")}`} />
      <h2>{t("another-videoing")}</h2>
      <h4>{t("another-videoing-reply1")}</h4>
      <h4>{t("another-videoing-reply2")}</h4>
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
