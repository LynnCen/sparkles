import { useTranslation } from "next-i18next";
import type { NextPage, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TDK from "../../../components/TDK/TDK";
const A: NextPage = (props) => {
  const { t } = useTranslation("user");

  return (
    <>
      <TDK title={`${t("install")} | ${t("user-mannual")}`} />
      <h2>{t("install")}</h2>
      <h4 style={{ paddingLeft: "0", color: "#0d1324", fontWeight: 600 }}>
        {t("install-enviroment")}
      </h4>
      <h4>{t("install-enviroment-android")}</h4>
      <h4>{t("install-enviroment-apple")}</h4>
      <h4>{t("install-enviroment-windows")}</h4>
      <h4>{t("install-enviroment-mac")}</h4>
      <h4>
        {t("install-feedback")} <b>{t("install-feedback-email")}</b>
      </h4>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faqmenu", "user"])),
  },
});
export default A;
