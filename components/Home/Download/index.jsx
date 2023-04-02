import getConfig from "next/config";
import download_google from "../../../assets/images/download_google.png";
import download_iOS from "../../../assets/images/download_iOS.png";
import download_APK from "../../../assets/images/icon_APk.png";
import download_Mac from "../../../assets/images/icon_mac.png";
import download_Windows from "../../../assets/images/icon_Windows.png";
import download_bg from "../../../assets/images/download_bg.png";
import styles from "./style.module.less";

const {
  publicRuntimeConfig: { downloadConfig },
} = getConfig();

export default ({ t, isShowTitle=true, linkObj }) => {
  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: !isShowTitle ? null :`url(${download_bg})` }}
    >
      <div style={{width: 484, margin: isShowTitle?'0 auto 50px':""}}>
        {isShowTitle && <h6>{t("download-title")}</h6>}
        <div className={styles.download_wrapper}>
          <a href={downloadConfig.google}>
            <img src={download_google} alt="download" />
          </a>
          <a href={downloadConfig.iOS}>
            <img src={download_iOS} alt="download" />
          </a>
        </div>
        <div className={styles.download_wrapper} style={{marginTop: 20}}>
          <a
            href={linkObj?.win}
          >
            <img src={download_Windows} alt="download" />
          </a>
          <a
            href={linkObj?.mac}
          >
            <img src={download_Mac} alt="download" />
          </a>
        </div>
        <div className={styles.download_wrapper} style={{marginTop: 20}}>
          <a
              href={linkObj?.apk || downloadConfig.APK}
          >
            <img src={download_APK} alt="download" />
          </a>
        </div>
      </div>
    </div>
  );
};
