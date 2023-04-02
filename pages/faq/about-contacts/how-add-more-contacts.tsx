import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/Contacts-1.jpg";
import step2 from "../../../public/images/Contacts-2.jpg";
import step3 from "../../../public/images/Contacts-3.jpg";
import step4 from "../../../public/images/Contacts-4.jpg";
import step5 from "../../../public/images/Contacts-5.jpg";
import step6 from "../../../public/images/Contacts-6.jpg";
import step7 from "../../../public/images/Contacts-7.jpg";
import step8 from "../../../public/images/Contacts-8.jpg";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("how-add-more-contacts-a"),
    },
    {
      title: t("how-add-more-contacts-b"),
    },
    {
      title: t("how-add-more-contacts-step1"),
      src: step1,
    },
    {
      title: t("how-add-more-contacts-step2"),
      src: step2,
      moreSrc: step3,
    },
    {
      title: t("how-add-more-contacts-step3"),
      src: step4,
    },
    {
      title: t("how-add-more-contacts-c"),
    },
    {
      title: t("how-add-more-contacts-c-step1"),
      src: step5,
    },
    {
      title: t("how-add-more-contacts-c-step2"),
      src: step6,
    },
    {
      title: t("how-add-more-contacts-c-step3"),
    },
    {
      title: t("how-add-more-contacts-c-step3-more"),
      src: step7,
    },
    {
      title: t("how-add-more-contacts-c-step4"),
      src: step8,
    },
  ];

  return (
    <>
      <TDK title={`${t("how-add-more-contacts")} | ${t("fa")}`} />
      <h2>{t("how-add-more-contacts")}</h2>
      {data.map((item, index) => {
        return (
          <RenderContent
            title={item.title}
            src={item.src}
            key={index}
            moreSrc={item.moreSrc}
          />
        );
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
