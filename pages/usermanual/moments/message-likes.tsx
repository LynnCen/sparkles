import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Moments-12.png";
import step2 from "../../../public/images/user/Moments-13.jpg";
import step3 from "../../../public/images/user/Moments-14.jpg";
import step4 from "../../../public/images/user/Moments-15.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("moments-likes-step1"),
      src: step1,
    },
    {
      title: t("moments-likes-step2"),
      src: step2,
    },
    {
      title: t("moments-likes-step3"),
      src: step3,
    },
    {
      title: t("moments-likes-step4"),
    },
    {
      title: t("moments-likes-step4-descript"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("moments-likes")} | ${t("user-mannual")}`} />
      <h2>{t("moments-likes")}</h2>
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
