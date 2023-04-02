import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Contacts-13.jpg";
import step2 from "../../../public/images/user/Contacts-14.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("contacts-delete-step1"),
    },
    {
      title: t("contacts-delete-step1-descript"),
      src: step1,
    },
    {
      title: t("contacts-delete-step2"),
      src: step2,
    },
  ];
  return (
    <>
      <TDK title={`${t("contacts-delete")} | ${t("user-mannual")}`} />
      <h2>{t("contacts-delete")}</h2>
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
