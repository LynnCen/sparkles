import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import Androidstep1 from "../../../public/images/Q16.jpg";
import Androidstep2 from "../../../public/images/Q17.jpg";
import Androidstep3 from "../../../public/images/Q25.jpg";
import Androidstep4 from "../../../public/images/Q26.jpg";
import applestep1 from "../../../public/images/Q20.jpg";
import applestep2 from "../../../public/images/Q28.jpg";
import applestep3 from "../../../public/images/Q29.jpg";
import TDK from "../../../components/TDK/TDK";
import RenderContent from "../../../components/content/content";
const A: NextPage = () => {
    const { t } = useTranslation("faqmenu");
    const Androiddata = [
        {
            title: "err-viewme-video-Android-step1",
            src: Androidstep1,
        },
        {
            title: "err-viewme-video-Android-step2",
            src: Androidstep2,
        },
        {
            title: "err-viewme-video-Android-step3",
            src: Androidstep3,
        },
        {
            title: "err-viewme-video-Android-step4",
            src: Androidstep4,
        },
    ];
    const Appledata = [
        {
            title: "err-viewme-video-apple-step1",
            src: applestep1,
        },
        {
            title: "err-viewme-video-apple-step2",
            src: applestep2,
        },
        {
            title: "err-viewme-video-apple-step3",
            src: applestep3,
        },
    ];
    return (
        <>
            <TDK title={`${t("err-viewme-video")} | ${t("fa")}`} />
            <h2>{t("err-viewme-video")}</h2>
            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("confim-author-video")}</h3>
            <h4>{t("err-viewme-video-Android")}</h4>
            {Androiddata.map((item, index) => {
                return <RenderContent title={item.title} src={item.src} key={index} />;
            })}
            <h4>{t("err-viewme-video-apple")}</h4>
            {Appledata.map((item, index) => {
                return <RenderContent title={item.title} src={item.src} key={index} />;
            })}

            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("err-video-work")}</h3>
            <h4>{t("err-video-work-step1")}</h4>
            <h4>{t("err-video-work-step2")}</h4>
        </>
    );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
    },
});
export default A;
