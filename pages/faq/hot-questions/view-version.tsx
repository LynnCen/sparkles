import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import step1 from "../../../public/images/Q1.jpg";
import step2 from "../../../public/images/Q2.jpg";
import step3 from "../../../public/images/Q3.jpg";
import RenderContent from "../../../components/content/content";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: "view-version-step1",
      src: step1,
    },
    {
      title: "view-version-step2",
      src: step2,
    },
    {
      title: "view-version-step3",
      src: step3,
    },
  ];
  return (
    <>
      <TDK title={`${t("view-version")} | ${t("fa")}`} />
      <h2>{t("view-version")}</h2>
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
