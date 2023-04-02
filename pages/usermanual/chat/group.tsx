import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/chat-22.jpg";
import step2 from "../../../public/images/user/chat-23.jpg";
import step3 from "../../../public/images/user/chat-24.jpg";
import step4 from "../../../public/images/user/chat-25.jpg";
import step5 from "../../../public/images/user/chat-26.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("chat-group-a"),
    },
    {
      title: t("chat-group-a-step1"),
    },
    {
      title: t("chat-group-a-step1-descript"),
      src: step1,
    },
    {
      title: t("chat-group-a-step2"),
      src: step2,
    },
    {
      title: t("chat-group-a-step3"),
      src: step3,
    },
    {
      title: t("chat-group-a-step4"),
      src: step4,
    },
    {
      title: t("chat-group-b"),
    },
    {
      title: t("chat-group-b-descript1"),
    },
    {
      title: t("chat-group-b-descript2"),
    },
    {
      title: t("chat-group-b-descript3"),
    },
    {
      title: t("chat-group-b-descript3-way1"),
    },
    {
      title: t("chat-group-b-descript3-way1-descript"),
      src: step5,
    },
    {
      title: t("chat-group-b-descript3-way2"),
    },
    {
      title: t("chat-group-b-descript3-way2-step1"),
      src: step3,
    },
    {
      title: t("chat-group-b-descript3-way2-step2"),
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("chat-group")} | ${t("user-mannual")}`} />
      <h2>{t("chat-group")}</h2>
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
