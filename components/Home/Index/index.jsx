import { OverPack } from "rc-scroll-anim";
import QueueAnim from "rc-queue-anim";
import Wrapper from "../../common/Wrapper";
import encryption_icon from "../../../assets/images/encryption_icon.png";
import private_icon from "../../../assets/images/private_icon.png";
import communication_icon from "../../../assets/images/communication_icon.png";
import erase_icon from "../../../assets/images/erase_icon.png";
import styles from './style.module.less'

export default ({ t }) => (
    <Wrapper element={<div className={styles.wrapper} />}>
      <h2 dangerouslySetInnerHTML={{ __html: t("index-title") }} />
      <OverPack className={styles.overpack} always={false}>
        <QueueAnim component="ul" duration={1500} interval={250} leaveReverse>
          <li key="1">
            <img src={encryption_icon} />
            <p>{t("index-item1")}</p>
          </li>
          <li key="2">
            <img src={private_icon} />
            <p>{t("index-item2")}</p>
          </li>
          <li key="3">
            <img src={communication_icon} />
            <p>{t("index-item3")}</p>
          </li>
          <li key="4">
            <img src={erase_icon} />
            <p>{t("index-item4")}</p>
          </li>
        </QueueAnim>
      </OverPack>
    </Wrapper>
  );