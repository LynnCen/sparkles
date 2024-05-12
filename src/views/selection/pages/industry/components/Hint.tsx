import {
  FC,
  useEffect,
  useState,
} from 'react';
import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';
import { getTenantInfo } from '@/common/api/system';


const Hint: FC = () => {
  const [hintInfo, setHintInfo] = useState<any>(null);

  useEffect(() => {
    getHintInfo();
  }, []);

  const getHintInfo = async () => { // 获取当前租户详情
    const data = await getTenantInfo();
    const { industryTipStatus, industryTip } = data || {};
    // 行业地图提示文案显示状态 1-显示 2-不显示
    if (industryTipStatus === 1 && industryTip) {
      setHintInfo(industryTip);
    }
  };

  return (
    <>
      {
        hintInfo && <div className={styles.hintCon}>
          <div className={cs('mr-10 fn-14 ft-space', styles.hintText)}>
            {hintInfo}
          </div>
          <div>
            <IconFont
              iconHref='iconic-closexhdpi'
              className='c-656 fn-12 pointer'
              onClick={() => setHintInfo(null)}/>
          </div>
        </div>
      }
    </>
  );
};

export default Hint;
