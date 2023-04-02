import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/payment-1.jpg";
import step2 from "../../../public/images/user/payment-2.jpg";
import step3 from "../../../public/images/user/payment-3.jpg";
import step4 from "../../../public/images/user/payment-4.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("mobile-pay-password-descript"),
    },
    {
      title: t("mobile-pay-password-step1"),
      src: step1,
    },
    {
      title: t("mobile-pay-password-step2"),
      src: step2,
    },
    {
      title: t("mobile-pay-password-step3"),
      src: step3,
    },
    {
      title: t("mobile-pay-password-step4"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("mobile-pay-password")} | ${t("user-mannual")}`} />
      <h2>{t("mobile-pay-password")}</h2>
      {data.map((item, index) => {
        return <RenderContent title={item.title} src={item.src} key={index} />;
      })}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
