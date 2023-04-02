import Wrapper from "../../common/Wrapper";
import footer_banner from "../../../assets/images/footer_banner.png";
import styles from "./style.module.less";

export default () => (
  <Wrapper element={<div className={styles.footer_banner} />}>
    <img src={footer_banner} />
  </Wrapper>
);
