import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/chat-29.jpg";
import step2 from "../../../public/images/user/chat-30.jpg";
import step3 from "../../../public/images/user/chat-31.jpg";
import step4 from "../../../public/images/user/Contacts-4.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("chat-nearby-descript"),
    },
    {
      title: t("chat-nearby-descript-step1"),
      src: step1,
    },

    {
      title: t("chat-nearby-descript-step2"),
      src: step2,
    },
    {
      title: t("chat-nearby-descript-step3"),
    },
    {
      title: t("chat-nearby-descript-step3-descript1"),
    },
    {
      title: t("chat-nearby-descript-step3-descript2"),
      src: step3,
    },
    {
      title: t("chat-nearby-descript-step4"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("chat-nearby")} | ${t("user-mannual")}`} />
      <h2>{t("chat-nearby")}</h2>
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
