import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RenderContent from "../../../components/content/content";
import TDK from "../../../components/TDK/TDK";
import step1 from "../../../public/images/user/payment-9.jpg";
import step2 from "../../../public/images/user/payment-10.png";
import step3 from "../../../public/images/user/payment-7.png";
import step4 from "../../../public/images/user/payment-12.jpg";
const A: NextPage = (props) => {
    const { t } = useTranslation("user");
    const data1 = [
        {
            title: t("mobile-pay-redpacket-luckly-what-descript"),
        },
    ];
    const data2 = [
        {
            title: t("mobile-pay-redpacket-luckly-where-descript1"),
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-descript2"),
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-descript3"),
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-step1"),
            src: step1,
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-step2"),
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-step2-descript"),
            src: step2,
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-step3"),
            src: step3,
        },
        {
            title: t("mobile-pay-redpacket-luckly-where-step4"),
            src: step4,
        },
    ];
    return (
        <>
            <TDK title={`${t("mobile-pay-redpacket-luckly")} | ${t("user-mannual")}`} />
            <h2>{t("mobile-pay-redpacket-luckly")}</h2>
            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("mobile-pay-redpacket-luckly-what")}</h3>
            {data1.map((item, index) => {
                return <RenderContent title={item.title} key={index} />;
            })}
            <h3 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>{t("mobile-pay-redpacket-luckly-where")}</h3>
            {data2.map((item, index) => {
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
