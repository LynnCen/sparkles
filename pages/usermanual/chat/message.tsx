import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/chat-11.jpg";
import step2 from "../../../public/images/user/chat-12.jpg";
import step3 from "../../../public/images/user/chat-13.jpg";
import step4 from "../../../public/images/user/chat-14.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("chat-message-copy"),
    },
    {
      title: t("chat-message-copy-descript"),
    },
    {
      title: t("chat-message-forward"),
    },
    {
      title: t("chat-message-forward-descript1"),
    },
    {
      title: t("chat-message-forward-descript2"),
      src: step1,
    },
    {
      title: t("chat-message-reply"),
    },
    {
      title: t("chat-message-reply-descript"),
      src: step2,
    },
    {
      title: t("chat-message-delete"),
    },
    {
      title: t("chat-message-delete-descript1"),
    },
    {
      title: t("chat-message-delete-descript2"),
    },
    {
      title: t("chat-message-delete-descript3"),
      src: step3,
    },
    {
      title: t("chat-message-delete-descript4"),
    },
    {
      title: t("chat-message-delete-descript5"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("chat-message")} | ${t("user-mannual")}`} />
      <h2>{t("chat-message")}</h2>
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
