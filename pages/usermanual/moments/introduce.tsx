import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Moments-1.png";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("moments-intrudce-descript1"),
    },
    {
      title: t("moments-intrudce-descript2"),
    },
    {
      title: t("moments-intrudce-descript3"),
    },
    {
      title: t("moments-intrudce-descript4"),
    },
    {
      title: t("moments-intrudce-descript5"),
      src: step1,
      imageWidth: null,
      imageHeight: null,
    },
  ];
  return (
    <>
      <TDK title={`${t("moments-intrudce")} | ${t("user-mannual")}`} />
      <h2>{t("moments-intrudce")}</h2>
      {data.map((item, index) => {
        return (
          <RenderContent
            imageHeight={item.imageHeight}
            title={item.title}
            src={item.src}
            key={index}
            imageWidth={item.imageWidth}
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
