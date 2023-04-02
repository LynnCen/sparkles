import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/yinshipin-1.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("videoing-change-step1"),
      src: step1,
    },
    {
      title: t("videoing-change-step2"),
    },
  ];

  return (
    <>
      <TDK title={`${t("videoing-change")} | ${t("fa")}`} />
      <h2>{t("videoing-change")}</h2>
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
