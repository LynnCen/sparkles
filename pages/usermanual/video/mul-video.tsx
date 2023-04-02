import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/yinshipin-5.jpg";
import step2 from "../../../public/images/user/yinshipin-2.jpg";
import step3 from "../../../public/images/user/yinshipin-7.jpg";
import step4 from "../../../public/images/user/yinshipin-8.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("video-many-step1"),
    },
    {
      title: t("video-many-step2"),
      src: step1,
    },
    {
      title: t("video-many-step3"),
      src: step2,
    },
    {
      title: t("video-many-step4"),
    },
    {
      title: t("video-many-step5"),
      src: step3,
    },
    {
      title: t("video-many-step6"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("video-many")} | ${t("user-mannual")}`} />
      <h2>{t("video-many")}</h2>
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