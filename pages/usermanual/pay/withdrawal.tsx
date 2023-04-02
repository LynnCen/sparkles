import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/payment-30.jpg";
import step2 from "../../../public/images/user/payment-31.jpg";
import step3 from "../../../public/images/user/payment-32.jpg";
import step4 from "../../../public/images/user/payment-33.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("mobile-pay-withdrawal-step1"),
      src: step1,
    },
    {
      title: t("mobile-pay-withdrawal-step2"),
    },
    {
      title: t("mobile-pay-withdrawal-step2-descript"),
      src: step2,
    },
    {
      title: t("mobile-pay-withdrawal-step3"),
      src: step3,
    },
    {
      title: t("mobile-pay-withdrawal-step4"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("mobile-pay-withdrawal")} | ${t("user-mannual")}`} />
      <h2>{t("mobile-pay-withdrawal")}</h2>
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
