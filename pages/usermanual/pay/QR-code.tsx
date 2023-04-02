import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/payment-25.jpg";
import step2 from "../../../public/images/user/payment-26.jpg";
import step3 from "../../../public/images/user/Contacts-8.jpg";
import step4 from "../../../public/images/user/payment-28.jpg";
import step5 from "../../../public/images/user/payment-29.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("mobile-pay-qrcode-descript1"),
    },
    {
      title: t("mobile-pay-qrcode-descript2"),
    },
    {
      title: t("mobile-pay-qrcode-descript2-step1"),
      src: step1,
    },
    {
      title: t("mobile-pay-qrcode-descript2-step2"),
      src: step2,
    },
    {
      title: t("mobile-pay-qrcode-descript2-step3"),
      src: step3,
    },
    {
      title: t("mobile-pay-qrcode-descript2-step4"),
      src: step4,
    },
    {
      title: t("mobile-pay-qrcode-descript2-step5"),
    },
    {
      title: t("mobile-pay-qrcode-descript2-step5-descript"),
      src: step5,
    },
  ];
  return (
    <>
      <TDK title={`${t("mobile-pay-qrcode")} | ${t("user-mannual")}`} />
      <h2>{t("mobile-pay-qrcode")}</h2>
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
