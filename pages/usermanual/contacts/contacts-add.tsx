import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/user/Contacts-1.jpg";
import step2 from "../../../public/images/user/Contacts-2.jpg";
import step3 from "../../../public/images/user/Contacts-3.jpg";
import step4 from "../../../public/images/user/Contacts-4.jpg";
import step5 from "../../../public/images/user/Contacts-5.jpg";
import step6 from "../../../public/images/user/Contacts-6.jpg";
import step7 from "../../../public/images/user/Contacts-7.jpg";
import step8 from "../../../public/images/user/Contacts-8.jpg";
import step9 from "../../../public/images/user/Contacts-9.jpg";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");
  const data = [
    {
      title: t("contacts-add-a"),
    },
    {
      title: t("contacts-add-a-step1"),
    },
    {
      title: t("contacts-add-a-step1-descript"),
      src: step1,
    },
    {
      title: t("contacts-add-a-step2"),
      src: step2,
    },
    {
      title: t("contacts-add-a-step3"),
      src: step3,
    },
    {
      title: t("contacts-add-a-step4"),
      src: step4,
    },
    {
      title: t("contacts-add-b"),
    },
    {
      title: t("contacts-add-b-step1"),
    },
    {
      title: t("contacts-add-b-step1-descript"),
      src: step5,
    },
    {
      title: t("contacts-add-b-step2"),
      src: step6,
    },
    {
      title: t("contacts-add-b-step3"),
      src: step7,
    },
    {
      title: t("contacts-add-b-step4"),
    },
    {
      title: t("contacts-add-b-step4-descript"),
      src: step8,
    },
    {
      title: t("contacts-add-b-step5"),
    },
    {
      title: t("contacts-add-b-step5-descript"),
      src: step9,
    },
  ];
  return (
    <>
      <TDK title={`${t("contacts-add")} | ${t("user-mannual")}`} />
      <h2>{t("contacts-add")}</h2>
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
