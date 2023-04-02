import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/chat1.png";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("chat-pages-brief-descript1"),
    },
    {
      title: t("chat-pages-brief-descript2"),
    },
    {
      title: t("chat-pages-brief-descript3"),
    },
    {
      title: t("chat-pages-brief-descript4"),
    },
    {
      title: t("chat-pages-brief-descript5"),
    },
    {
      title: t("chat-pages-brief-descript6"),
    },
    {
      title: t("chat-pages-brief-descript7"),
    },
    {
      title: t("chat-pages-brief-descript8"),
      src: step1,
      imageWidth: null,
      imageHeight: null,
    },
  ];
  return (
    <>
      <TDK title={`${t("chat-pages-brief")} | ${t("user-mannual")}`} />
      <h2>{t("chat-pages-brief")}</h2>
      {data.map((item, index) => {
        return (
          <RenderContent
            title={item.title}
            src={item.src}
            imageWidth={item.imageWidth}
            imageHeight={item.imageHeight}
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
