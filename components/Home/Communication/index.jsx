import Wrapper from "../../common/Wrapper";
import communication_icon from "../../../assets/images/communication_icon.png";
import styles from "./style.module.less";

export default ({ t }) => (
  <Wrapper element={<div className={styles.function_part} />}>
    <div className={styles.content}>
      <img className={styles.tit} src={communication_icon} alt="" />
      <h5>{t("Communication")}</h5>
      <p>{t("Communication-description")}</p>
    </div>
  </Wrapper>
);
