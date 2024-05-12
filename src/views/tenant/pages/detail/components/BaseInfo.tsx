import { Image } from 'antd';
import styles from './index.module.less';

const BaseInfo = ({ detail }) => {
  return (
    <div className={styles.basicContainer}>
      <ul>
        {
          (detail.licenses && detail.licenses.length) ? <li>
            <span className={styles.title}>营业执照：</span>
            <Image width={200} src={detail.licenses[0]} />
          </li> : null
        }
        {
          detail.logo ? <li>
            <span className={styles.title}>企业logo：</span>
            <Image width={200} src={detail.logo} />
          </li> : null
        }
        <li>
          <span className={styles.title}>组织机构代码：</span>
          <span>{detail.regNum}</span>
        </li>
        <li>
          <span className={styles.title}>租户简称：</span>
          <span>{detail.name}</span>
        </li>
        <li>
          <span className={styles.title}>管理员姓名：</span>
          <span>{detail.connector}</span>
        </li>
        <li>
          <span className={styles.title}>手机号：</span>
          <span>{detail.connectorMobile}</span>
        </li>
      </ul>
    </div>
  );
};

export default BaseInfo;
