import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/chat-5.jpg";
import step2 from "../../../public/images/chat-6.jpg";
import step3 from "../../../public/images/chat-7.jpg";
import step4 from "../../../public/images/chat-8.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: "delete-err-message-step1",
      src: step1,
    },
    {
      title: "delete-err-message-step2",
    },
    {
      title: "delete-err-message-step2-multiport",
      src: step2,
    },
    {
      title: "delete-err-message-step2-multiport-remation",
      src: step3,
    },
    {
      title: "delete-err-message-step2-multiport-remation-name",
      src: step4,
    },
  ];
  return (
    <>
      <TDK title={`${t("delete-err-message")} | ${t("fa")}`} />
      <h2>{t("delete-err-message")}</h2>
      <h3>{t("update-see-message-update")}</h3>
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
