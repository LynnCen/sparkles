import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("about-withdrawal-reply"),
    },
  ];

  return (
    <>
      <TDK title={`${t("about-withdrawal")} | ${t("fa")}`} />
      <h2>{t("about-withdrawal")}</h2>
      {data.map((item, index) => {
        return <RenderContent title={item.title} key={index} />;
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
