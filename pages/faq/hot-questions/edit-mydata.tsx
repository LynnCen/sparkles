import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import step1 from "../../../public/images/Q6.jpg";
import step2 from "../../../public/images/Q7.jpg";
import step3 from "../../../public/images/Q8.jpg";
import step4 from "../../../public/images/Q9.jpg";
import RenderContent from "../../../components/content/content";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: "edit-mydata-step1",
      src: step1,
    },
    {
      title: "edit-mydata-step2",
      src: step2,
    },
    {
      title: "edit-mydata-step3",
      src: step3,
    },
    {
      title: "edit-mydata-step4",
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("edit-mydata")} | ${t("fa")}`} />
      <h2>{t("edit-mydata")}</h2>
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
