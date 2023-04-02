import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/payment-1.jpg";
import step2 from "../../../public/images/user/payment-4.jpg";
import step3 from "../../../public/images/user/payment-19.jpg";
import step4 from "../../../public/images/user/payment-20.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("mobile-pay-wallet-where"),
    },
    {
      title: t("mobile-pay-wallet-where-step1"),
      src: step1,
    },
    {
      title: t("mobile-pay-wallet-where-step2"),
    },
    {
      title: t("mobile-pay-wallet-where-step2-descript"),
      src: step2,
    },
    {
      title: t("mobile-pay-wallet-where-step3"),
    },
    {
      title: t("mobile-pay-wallet-where-step3-descript"),
      src: step3,
    },
    {
      title: t("mobile-pay-wallet-where-step4"),
    },
    {
      title: t("mobile-pay-wallet-where-step4-descript"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("mobile-pay-wallet")} | ${t("user-mannual")}`} />
      <h2>{t("mobile-pay-wallet")}</h2>
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
