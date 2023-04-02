import styles from "./footer.module.scss";

export const Footer = () => {
  const {
    footer_tmmprev,
    footer_tmmpicons,
    footer_tmm_facebook,
    footer_tmm_twwiter,
    footer_tmm_instagram,
    footer_tmmpright,
    footer_tmmpright_left,
  } = styles;
  return (
    <section className={styles.footer}>
      <div className={footer_tmmprev}>
        <div className={footer_tmmpicons}>
          <a className={footer_tmm_facebook} href="#"></a>
          <a
            className={footer_tmm_twwiter}
            href="https://twitter.com/TmmTmmEasy"
          ></a>
          <a
            className={footer_tmm_instagram}
            href="https://www.instagram.com/tmmtmm_official"
          ></a>
        </div>
      </div>
      <div className={footer_tmmpright}>
        <div className={footer_tmmpright_left}>
          Copyright &#169 2021 TMMTMM All rights reserved.
        </div>
        <div className={footer_tmmpright_left}>
          <a href="./static/app_assets/service_rules.html">
            TmmTmm Terms & Privacy Policy
          </a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
