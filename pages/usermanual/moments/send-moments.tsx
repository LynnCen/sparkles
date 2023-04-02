import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Moments-9.jpg";
import step2 from "../../../public/images/user/Moments-10.jpg";
import step3 from "../../../public/images/user/Moments-11.jpg";
import step4 from "../../../public/images/user/Moments-2.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("moments-send-step1"),
      src: step1,
    },
    {
      title: t("moments-send-step2"),
    },
    {
      title: t("moments-send-step2-descript1"),
    },
    {
      title: t("moments-send-step2-descript2"),
      src: step2,
    },
    {
      title: t("moments-send-step3"),
    },
    {
      title: t("moments-send-step3-descript1"),
    },
    {
      title: t("moments-send-step3-descript2"),
    },
    {
      title: t("moments-send-step3-descript3"),
    },
    {
      title: t("moments-send-step3-descript4"),
      src: step3,
    },
    {
      title: t("moments-send-step4"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("moments-send")} | ${t("user-mannual")}`} />
      <h2>{t("moments-send")}</h2>
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
