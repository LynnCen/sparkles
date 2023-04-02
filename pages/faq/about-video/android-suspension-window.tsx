import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/yinshipin-1.jpg";
import step2 from "../../../public/images/yinshipin-3.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("android-suspension-window-step1"),
      src: step1,
    },
    {
      title: t("android-suspension-window-step2"),
      src: step2,
    },
  ];

  return (
    <>
      <TDK title={`${t("android-suspension-window")} | ${t("fa")}`} />
      <h2>{t("android-suspension-window")}</h2>
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
