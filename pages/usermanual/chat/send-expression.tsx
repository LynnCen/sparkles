import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/chat-3.jpg";
import step2 from "../../../public/images/user/chat-4.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("chat-send-expression-step1"),
      src: step1,
    },
    {
      title: t("chat-send-expression-step2"),
      src: step2,
    },
  ];
  return (
    <>
      <TDK title={`${t("chat-send-expression")} | ${t("user-mannual")}`} />
      <h2>{t("chat-send-expression")}</h2>
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
