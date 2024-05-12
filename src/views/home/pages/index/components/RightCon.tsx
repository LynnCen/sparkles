import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';
import StoreNumber from './StoreNumber';
import StoreProportion from './StoreProportion';
import { getTenantInfo } from '@/common/api/system';
const RightCon: FC<any> = () => {
  const [tenantInfo, setTenantInfo] = useState<any>({});
  const storeList = [
    { label: '历史门店', number: 1186, icon: 'iconic_left_dianpu', color: '#E67B4B' },
    { label: '新开门店', number: 58, icon: 'iconic_kaidian', color: '#58B57D' },

  ];
  useEffect(() => {
    (async () => {
      const res = await getTenantInfo();
      setTenantInfo(res);
    })();
  }, []);
  return (
    <div className={styles.rightContainer}>
      <div className={styles.topSwitch}>
        <span>
          全国
        </span>
        <span className={styles.switch}>
          <IconFont iconHref='iconswitch' />
        </span>
      </div>

      <div className={styles.topAvatar}>
        {tenantInfo.logo ? <img src={tenantInfo.logo} alt='' /> : <img src='https://staticres.linhuiba.com/project-custom/locationpc/demo/ic_babyCare.png' alt='' />}
        <div className='bold mt-10'>
          {tenantInfo.name}
        </div>
      </div>

      <div className={styles.store}>
        {
          storeList.map((item, index) => (
            <div key={index} className={styles.storeCard}>
              <div className={styles.storeIcon}>
                <IconFont iconHref={item.icon} style={{ color: item.color }} />
              </div>
              <div className={styles.storeText}>
                <div className='bold'>
                  {item.number}
                </div>
                <div className={styles.storeLabel}>
                  {item.label}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <StoreNumber />
      <StoreProportion />
    </div>
  );
};
export default RightCon;
