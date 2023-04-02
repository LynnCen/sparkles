import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Contacts-10.jpg";
import step2 from "../../../public/images/user/Contacts-11.jpg";
import step3 from "../../../public/images/user/Contacts-12.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("contacts-friends-step1"),
    },
    {
      title: t("contacts-friends-step1-descript"),
      src: step1,
    },
    {
      title: t("contacts-friends-step2"),
      src: step2,
    },
    {
      title: t("contacts-friends-step3"),
      src: step3,
    },
  ];
  return (
    <>
      <TDK title={`${t("contacts-friends")} | ${t("user-mannual")}`} />
      <h2>{t("contacts-friends")}</h2>
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
