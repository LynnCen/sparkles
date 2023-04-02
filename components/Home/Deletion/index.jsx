import Wrapper from "../../common/Wrapper";
import erase_icon from "../../../assets/images/erase_icon.png";
import styles from "./style.module.less";

export default ({ t }) => (
  <Wrapper element={<div className={styles.function_part} />}>
    <div className={styles.content}>
      <img className={styles.tit} src={erase_icon} alt="" />
      <h5>{t("Deletion")}</h5>
      <p>{t("Deletion-description")}</p>
    </div>
  </Wrapper>
);
