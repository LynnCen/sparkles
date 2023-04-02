import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/Contacts-9.jpg";
import step2 from "../../../public/images/Contacts-10.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("how-delete-contacts-step1"),
    },
    {
      title: t("how-delete-contacts-step1-more"),
      src: step1,
    },
    {
      title: t("how-delete-contacts-step2"),
      src: step2,
    },
  ];

  return (
    <>
      <TDK title={`${t("how-delete-contacts")} | ${t("fa")}`} />
      <h2>{t("how-delete-contacts")}</h2>
      {data.map((item, index) => {
        return <RenderContent title={item.title} src={item.src} key={index} />;
      })}
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu"])),
  },
});
export default A;
