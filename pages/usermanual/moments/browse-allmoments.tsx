import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Moments-2.jpg";
import step2 from "../../../public/images/user/Moments-3.jpg";
import step3 from "../../../public/images/user/Moments-4.jpg";
import step4 from "../../../public/images/user/Moments-5.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("moments-all-friends-step1"),
      src: step1,
    },
    {
      title: t("moments-all-friends-step2"),
    },
    {
      title: t("moments-all-friends-step2-descript"),
      src: step2,
    },
    {
      title: t("moments-all-friends-step3"),
      src: step3,
    },
    {
      title: t("moments-all-friends-step4"),
    },
    {
      title: t("moments-all-friends-step4-descript1"),
    },
    {
      title: t("moments-all-friends-step4-descript2"),
      src: step4,
    },
    ,
  ];
  return (
    <>
      <TDK title={`${t("moments-all-friends")} | ${t("user-mannual")}`} />
      <h2>{t("moments-all-friends")}</h2>
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
