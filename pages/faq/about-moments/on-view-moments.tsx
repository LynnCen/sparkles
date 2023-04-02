import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/Moments-1.jpg";
import step2 from "../../../public/images/Moments-5.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("on-view-moments-step1"),
    },
    {
      title: t("on-view-moments-step1-detail1"),
    },
    {
      title: t("on-view-moments-step1-detail2"),
      src: step1,
    },
    {
      title: t("on-view-moments-step2"),
    },
    {
      title: t("on-view-moments-step2-detail1"),
    },
    {
      title: t("on-view-moments-step2-detail2"),
    },
    {
      title: t("on-view-moments-step2-detail3"),
    },
    {
      title: t("on-view-moments-step2-detail4"),
      src: step2,
    },
  ];

  return (
    <>
      <TDK title={`${t("on-view-moments")} | ${t("fa")}`} />
      <h2>{t("on-view-moments")}</h2>
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
