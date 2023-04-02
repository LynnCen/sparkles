import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import Androidstep1 from "../../../public/images/Q11.jpg";
import Androidstep2 from "../../../public/images/Q12.jpg";
import applestep1 from "../../../public/images/Q13.jpg";
import applestep2 from "../../../public/images/Q14.jpg";
import applestep3 from "../../../public/images/Q15.jpg";
import TDK from "../../../components/TDK/TDK";
import RenderContent from "../../../components/content/content";
const A: NextPage = () => {
  const { t } = useTranslation("faqmenu");
  const Androiddata = [
    {
      title: "err-newmessage-Android-step1",
      src: Androidstep1,
    },
    {
      title: "err-newmessage-Android-step2",
      src: Androidstep2,
    },
  ];
  const Appledata = [
    {
      title: "err-newmessage-apple-step1",
      src: applestep1,
    },
    {
      title: "err-newmessage-apple-step2",
      src: applestep2,
    },
    {
      title: "err-newmessage-apple-step3",
      src: applestep3,
    },
  ];
  return (
    <>
      <TDK title={`${t("err-newmessage")} | ${t("fa")}`} />
      <h2>{t("err-newmessage")}</h2>
      <h4>{t("err-newmessage-followstep")}</h4>
      <h4>{t("err-newmessage-notice")}</h4>
      <h4>{t("err-newmessage-Android")}</h4>
      {Androiddata.map((item, index) => {
        return <RenderContent title={item.title} src={item.src} key={index} />;
      })}
      <h4>{t("err-newmessage-apple")}</h4>
      {Appledata.map((item, index) => {
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
