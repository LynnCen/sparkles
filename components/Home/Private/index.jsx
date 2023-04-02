import Wrapper from "../../common/Wrapper";
import private_icon from "../../../assets/images/private_icon.png";
import styles from "./style.module.less";

export default ({ t }) => (
  <Wrapper element={<div className={styles.function_part} />}>
    <div className={styles.content}>
      <img className={styles.tit} src={private_icon} alt="" />
      <h5>{t("Private")}</h5>
      <p>{t("Private-description")}</p>
    </div>
  </Wrapper>
);
