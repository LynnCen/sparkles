import Wrapper from "../../common/Wrapper";
import encryption_icon from "../../../assets/images/encryption_icon.png";
import styles from "./style.module.less";

export default ({ t }) => (
  <Wrapper element={<div className={styles.function_part} />}>
    <div className={styles.content}>
      <img className={styles.tit} src={encryption_icon} alt="" />
      <h5>{t("Encryption")}</h5>
      <p>{t("Encryption-description")}</p>
    </div>
  </Wrapper>
);
