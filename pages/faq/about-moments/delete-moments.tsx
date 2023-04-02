import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/Moments-1.jpg";
import step2 from "../../../public/images/Moments-2.jpg";
import step3 from "../../../public/images/Moments-3.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("delete-moments-step1"),
      src: step1,
    },
    {
      title: t("delete-moments-step2"),
      src: step2,
    },
    {
      title: t("delete-moments-step3"),
      src: step3,
    },
  ];

  return (
    <>
      <TDK title={`${t("delete-moments")} | ${t("fa")}`} />
      <h2>{t("delete-moments")}</h2>
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
