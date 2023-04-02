import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/Contacts-9.jpg";
import step2 from "../../../public/images/Contacts-13.jpg";
import step3 from "../../../public/images/Contacts-14.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("contacts-add-remarks-more"),
    },
    {
      title: t("contacts-add-remarks-step1"),
      src: step1,
    },
    {
      title: t("contacts-add-remarks-step2"),
      src: step2,
    },
    {
      title: t("contacts-add-remarks-step3"),
      src: step3,
    },
  ];

  return (
    <>
      <TDK title={`${t("contacts-add-remarks")} | ${t("fa")}`} />
      <h2>{t("contacts-add-remarks")}</h2>
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
