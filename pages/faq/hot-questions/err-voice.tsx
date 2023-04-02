import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import Androidstep1 from "../../../public/images/Q16.jpg";
import Androidstep2 from "../../../public/images/Q17.jpg";
import Androidstep3 from "../../../public/images/Q18.jpg";
import Androidstep4 from "../../../public/images/Q19.jpg";
import applestep1 from "../../../public/images/Q20.jpg";
import applestep2 from "../../../public/images/Q21.jpg";
import applestep3 from "../../../public/images/Q22.jpg";
import RenderContent from "../../../components/content/content";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = () => {
    const { t } = useTranslation("faqmenu");
    const Androiddata = [
        {
            title: "err-voice-Android-step1",
            src: Androidstep1,
        },
        {
            title: "err-voice-Android-step2",
            src: Androidstep2,
        },
        {
            title: "err-voice-Android-step3",
            src: Androidstep3,
        },
        {
            title: "err-voice-Android-step4",
            src: Androidstep4,
        },
    ];
    const Appledata = [
        {
            title: "err-voice-apple-stpe1",
            src: applestep1,
        },
        {
            title: "err-voice-apple-stpe2",
            src: applestep2,
        },
        {
            title: "err-voice-apple-stpe3",
            src: applestep3,
        },
    ];
    return (
        <>
            <TDK title={`${t("err-voice")} | ${t("fa")}`} />
            <h2>{t("err-voice")}</h2>
            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("confim-voice")}</h3>
            <h4>{t("err-voice-Android")}</h4>
            {Androiddata.map((item, index) => {
                return <RenderContent title={item.title} src={item.src} key={index} />;
            })}
            <h4>{t("err-voice-apple")}</h4>
            {Appledata.map((item, index) => {
                return <RenderContent title={item.title} src={item.src} key={index} />;
            })}
            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("where-voice")}</h3>
            <h4>{t("where-voice-define")}</h4>
            <h4>{t("where-voice-notice")}</h4>

            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("why-voice")}</h3>
            <h3>{t("why-voice-confirm")}</h3>
            <h4>{t("why-voice-step1")}</h4>
            <h4>{t("why-voice-step2")}</h4>
        </>
    );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
    },
});
export default A;
