import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import step2 from "../../../public/images/Q10.jpg";
import RenderContent from "../../../components/content/content";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  return (
    <>
      <TDK title={`${t("err-login")} | ${t("fa")}`} />
      <h2>{t("err-login")}</h2>
      <h4>{t("err-login-step1")}</h4>
      <RenderContent title={"err-login-step2"} src={step2} />
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
