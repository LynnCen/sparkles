import getConfig from "next/config";
import QueueAnim from "rc-queue-anim";
import Wrapper from "../../common/Wrapper";
import Download from "../../../components/Home/Download";
import main_bg_icon1 from "../../../assets/images/main_bg_icon1.png";
import main_bg_icon2 from "../../../assets/images/main_bg_icon2.png";
import main_bg_icon3 from "../../../assets/images/main_bg_icon3.png";
import main_bg_icon4 from "../../../assets/images/main_bg_icon4.png";
import main_iphone1 from "../../../assets/images/main_iphone1.png";
import main_iphone2 from "../../../assets/images/main_iphone2.png";
import styles from "./style.module.less";

export default ({ t, linkObj }) => {
  return (
    <div className={styles.main_wrapper}>
      <div className={styles.bg_wrapper}>
        <img className={styles.ani_icon1} src={main_bg_icon1} />
        <img className={styles.ani_icon2} src={main_bg_icon2} />
        <img className={styles.ani_icon3} src={main_bg_icon3} />
        <img className={styles.ani_icon4} src={main_bg_icon4} />
      </div>
      <img className={styles.iphone1} src={main_iphone1} alt="" />
      <img className={styles.iphone2} src={main_iphone2} alt="" />
      <Wrapper element={<div className={styles.wrapper} />}>
        <div className={styles.content}>
          <QueueAnim
            component="div"
            type="bottom"
            duration={1500}
            interval={250}
            leaveReverse
            style={{marginBottom: 32}}
          >
            <h1
              className={styles.main_title}
              key="h1"
              dangerouslySetInnerHTML={{ __html: t("main-title") }}
            />
            <p className={styles.main_description} key="p">
              {t("main-description")}
            </p>
          </QueueAnim>
          <Download t={t} isShowTitle={false} linkObj={linkObj} />
        </div>
      </Wrapper>
    </div>
  );
};
