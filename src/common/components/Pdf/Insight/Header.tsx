import { FC } from 'react';
import styles from './entry.module.less';
import IconFont from '@/common/components/IconFont';

const Header: FC<any> = ({
  name,
  hasIndex,
  indexVal,
}) => {

  return (
    <div className={styles.headerCon}>
      {
        hasIndex
          ? (
            <div className={styles.indexCon}>
              <div className='color-white fs-36 bold'>
                {name}
              </div>
              <div className={styles.indexNum}>
                {indexVal}
              </div>
              <div className={styles.decorateCon}>
                <IconFont
                  iconHref='iconcaret-bottom'
                  className={styles.triangleRightArrow}/>
              </div>
            </div>
          ) : (
            <div className={styles.themeCon}>
              { name }
              <div className={styles.themePlaceholder}>
              </div>
            </div>
          )
      }
      <div className='rt fs-17 cOpaWhite'>
        ASSESSMENT REPORT
      </div>
    </div>
  );
};

export default Header;
