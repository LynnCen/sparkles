import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/Payment-1.jpg";
import step2 from "../../../public/images/Payment-2.jpg";
import step3 from "../../../public/images/Payment-3.jpg";
import step4 from "../../../public/images/Payment-4.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("view-record-detail"),
    },
    {
      title: t("view-record-step1"),
      src: step1,
    },
    {
      title: t("view-record-step2"),
      src: step2,
    },
    {
      title: t("view-record-step3"),
      src: step3,
    },
    {
      title: t("view-record-step4"),
      src: step4,
    },
  ];

  return (
    <>
      <TDK title={`${t("view-record")} | ${t("fa")}`} />
      <h2>{t("view-record")}</h2>
      {data.map((item, index) => {
        return <RenderContent title={item.title} src={item.src} key={index} />;
      })}
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu"])),
  },
});
export default A;
