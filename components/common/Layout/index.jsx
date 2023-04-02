import { useCallback } from "react";
import Head from "next/head";
import { i18n, withTranslation, Link } from "../../../i18n";
import Wrapper from "../Wrapper";
import language_icon from "../../../assets/images/language_icon.png";
import bg from "../../../assets/images/bg.jpg";
import logo from "../../../assets/images/logo.png";
import twitter from "../../../assets/images/twitter.png";
import facebook from "../../../assets/images/facebook.png";
import instagram from "../../../assets/images/instagram.png";
import styles from "./style.module.less";

const PageHeader = withTranslation("common")(({ t }) => {
  const handleChange = useCallback((event) => {
    i18n.changeLanguage(event.target.value);
  }, []);
  return (
    <header className={styles.page_header}>
      <Wrapper element={<div className={styles.wrapper} />}>
        <Link href="/">
          <a className={styles.logo}>
            <img src={logo} alt="logo" />
          </a>
        </Link>
        <div className={styles.language_select_warpper}>
          <img src={language_icon} />
          <select value={i18n.language} onChange={handleChange}>
            <option value="zh">{t("header-language-zh")}</option>
            <option value="en">{t("header-language-en")}</option>
          </select>
        </div>
      </Wrapper>
    </header>
  );
});

const PageContent = (props) => {
  const { children } = props;
  return <section>{children}</section>;
};

const PageFooter = withTranslation("common")(({ t }) => {
  return (
    <footer className={styles.page_footer}>
      <Wrapper element={<div className={styles.row1} />}>
        <Link href="/">
          <a>
            <img src={logo} alt="logo" />
          </a>
        </Link>
        <ul>
          <li>
            <a href="https://twitter.com/TmmTmmEasy">
              <img src={twitter} alt="twitter" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={facebook} alt="facebook" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={instagram} alt="instagram" />
            </a>
          </li>
        </ul>
      </Wrapper>
      <Wrapper element={<div className={styles.row2} />}>
        <p>
          Contact us: <a href="mailto: info@tmmtmm.com.tr"> info@tmmtmm.com.tr</a>
        </p>
        <p>
          <a href="/static/app_assets/service_rules.html">
            TmmTmm Terms & Privacy Policy
          </a>
        </p>
      </Wrapper>
    </footer>
  );
});

const Layout = (props) => {
  const { children } = props;
  return (
    <article
      className={styles.layout}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Head>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </Head>
      <PageHeader />
      <PageContent>{children}</PageContent>
      <PageFooter />
    </article>
  );
};

export default Layout;
