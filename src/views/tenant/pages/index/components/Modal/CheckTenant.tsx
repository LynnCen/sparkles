/* (批量)停用/恢复租户信息  */
import React from 'react';
import { ModalStatus } from '@/views/tenant/pages/index/ts-config';
import styles from './index.module.less';

interface IProps {
  type: string;
  list: string | any[];
}

const CheckTenant: React.FC<IProps> = ({ type, list }) => {
  return (
    <>
      {type === ModalStatus.ALL && Array.isArray(list) ? (
        <ul className={styles.tenantNameWrap}>
          {list.map((item: string, index: number) => (
            <li key={index}>-{item}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default CheckTenant;
