import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Contacts-13.jpg";
import step2 from "../../../public/images/user/yinshipin-2.jpg";
import step3 from "../../../public/images/user/yinshipin-3.jpg";
import step4 from "../../../public/images/user/yinshipin-4.png";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("video-single-step1"),
      src: step1,
    },
    {
      title: t("video-single-step2"),
    },
    {
      title: t("video-single-step2-descript"),
      src: step2,
    },
    {
      title: t("video-single-step3"),
      src: step3,
    },
    {
      title: t("video-single-step3-descript1"),
    },
    {
      title: t("video-single-step3-descript2"),
    },
    {
      title: t("video-single-step3-descript3"),
    },
    {
      title: t("video-single-step3-descript4"),
    },
    {
      title: t("video-single-step3-descript5"),
      src: step4,
      imageWidth: null,
      imageHeight: null,
    },
  ];
  return (
    <>
      <TDK title={`${t("video-single")} | ${t("user-mannual")}`} />
      <h2>{t("video-single")}</h2>
      {data.map((item, index) => {
        return (
          <RenderContent
            title={item.title}
            imageWidth={item.imageWidth}
            imageHeight={item.imageHeight}
            src={item.src}
            key={index}
          />
        );
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
