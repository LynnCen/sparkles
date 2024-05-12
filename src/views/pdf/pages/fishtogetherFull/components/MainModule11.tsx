import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import Item from './Base/Item';
import { replaceEmpty } from '@lhb/func';
import { useMethods } from '@lhb/hook';
const MainModule11: FC<any> = ({
  number,
  res = {}
}) => {
  const methods = useMethods({
    renderCon() {
      const arr: string[] = [];
      if (res?.projSubmitOpeningRate) {
        arr.push(res.projSubmitOpeningRate);
      }
      if (res?.projSubmitExclusivityClause) {
        arr.push(res.projSubmitExclusivityClause);
      }
      if (res?.projSubmitProtectRights) {
        arr.push(res.projSubmitProtectRights);
      }
      return arr.length ? arr.join('、') : '-';
    }
  });
  return (
    <div className={cs(styles.mainModule, styles.mainModule11)}>
      <TopTitle number={number}>十一、其他附件</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <V2Title divider type='H3' text='其他' style={{ marginBottom: '10px' }}/>
        <Item className='mb-10' label='已入住品牌:'>{replaceEmpty(res?.projSubmitSignedBrand)}</Item>
        <Item className='mb-10' label='开铺率、排他条款、如品牌未到位如何保障权益:'>{methods.renderCon()}</Item>
        {/* <Item className='mb-10' label='项目承诺开业时满铺率达到85%，三个月内达到95%，如未达标，则租金减半至满足率达标:'>1</Item> */}
        <div className={styles.module11}>
          <div className={styles.module11Item}>
            <V2Title divider type='H3' text='CAD图纸' style={{ marginBottom: '10px' }}/>
            <div>{replaceEmpty(res?.projSubmitCadDrawings)}</div>
          </div>
          <div className={styles.module11Item}>
            <V2Title divider type='H3' text='招商楼书' style={{ marginBottom: '10px' }}/>
            <div>{replaceEmpty(res?.projSubmitInvestmentPromotionBuilding)}</div>
          </div>
        </div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule11;
