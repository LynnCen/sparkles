import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import step1 from "../../../public/images/Q2.jpg";
import step2 from "../../../public/images/Q5.jpg";
import RenderContent from "../../../components/content/content";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: "change-lan-step1",
      src: step1,
    },
    {
      title: "change-lan-step2",
      src: step2,
    },
  ];
  return (
    <>
      <TDK title={`${t("view-version")} | ${t("fa")}`} />
      <h2>{t("change-lan")}</h2>
      <h4>{t("change-lan-intrudce")}</h4>
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
