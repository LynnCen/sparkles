// 相关协议
import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.less';
import { Space } from 'antd';
import V2FormCheckbox from '@/common/components/Form/V2FormCheckbox/V2FormCheckbox';
const Agreement: FC<any> = () => {
  return <div className={styles.agreement}>
    <Space wrap>
      <V2FormCheckbox name='agree' noStyle options={[{ label: '我已阅读并同意', value: 1 }]}></V2FormCheckbox>
      <Link to='/openweb/service' className={styles.agreeBtn}>《用户协议》</Link>
      <Link to='/openweb/privacy' className={styles.agreeBtn}>《隐私政策》</Link>
    </Space>
  </div>;
};

export default Agreement;
