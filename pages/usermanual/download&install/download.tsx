import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
// import { GetStaticProps } from 'next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Download-1.png";
import step2 from "../../../public/images/user/Download-2.png";
import step3 from "../../../public/images/user/Download-3.png";
import step4 from "../../../public/images/user/Download-4.png";
import step5 from "../../../public/images/user/Download-5.png";
import TDK from "../../../components/TDK/TDK";

const DownLoad: NextPage = () => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("download-a"),
    },
    {
      title: t("download-a-step1"),
      src: step1,
      moreSrc: step2,
      imageWidth: 240,
      imageHeight: 200,
    },
    {
      title: t("download-a-step2"),
      src: step3,
      moreSrc: step4,
      imageWidth: 240,
      imageHeight: 300,
    },
    {
      title: t("download-b"),
      src: step5,
      imageWidth: 240,
      imageHeight: 240,
    },
  ];
  return (
    <>
      <TDK title={`${t("download")} | ${t("user-mannual")}`} />
      <h2>{t("download")}</h2>
      {data.map((item, index) => {
        return (
          <RenderContent
            title={item.title}
            src={item.src}
            moreSrc={item.moreSrc}
            key={index}
            imageWidth={item.imageWidth}
            imageHeight={item.imageHeight}
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
export default DownLoad;
