import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import RenderContent from "../../../components/content/content";
import step1 from "../../../public/images/yinshipin-4.jpg";
import step2 from "../../../public/images/yinshipin-5.jpg";
import Image from "next/image";
import type { NextPage, GetStaticProps } from "next";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const data = [
    {
      title: t("view-videoing-Android"),
      src: step1,
    },
    {
      title: t("view-videoing-apple"),
    },
  ];

  return (
    <>
      <TDK title={`${t("view-videoing")} | ${t("fa")}`} />
      <h2>{t("view-videoing")}</h2>
      {data.map((item, index) => {
        return <RenderContent title={item.title} src={item.src} key={index} />;
      })}
      <Image src={step2} width={240} height={300} />
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
