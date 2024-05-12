/**
 * @Description 列表内容-cell item
 *
 */

import { FC, useMemo } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { isArray, isNotEmpty } from '@lhb/func';
import IconFont from '@/common/components/IconFont';
import { LabelType, typeLabelImgMap } from '../../../ts-config';

const ListItem: FC<any> = ({
  item,
  handleItem, // 点击商圈项
}) => {
  /**
   * @description 获取类型标签（A/B/C/D）的图片url，没有则返回空字符串
   * @return 图片url字符串
   */
  const typeLabelImg = useMemo(() => {
    const { labelTypeMap } = item;
    if (typeof labelTypeMap !== 'object') return '';

    const lblsType2: any[] = labelTypeMap[LabelType.NetPlan];
    if (!isArray(lblsType2) || !lblsType2.length) return '';
    return typeLabelImgMap.get(lblsType2[0].name);
  }, [item]);

  /**
   * @description 类型标签（A/B/C/D）以外的其他标签，没有则返回空数组
   * @return 字符串数组
   */
  const otherLabels = useMemo(() => {
    const { labelTypeMap } = item;
    if (typeof labelTypeMap !== 'object') return [];

    const systemLabels: any[] = labelTypeMap[LabelType.System];
    const customLabels: any[] = labelTypeMap[LabelType.Custom];
    return [
      ...(isArray(systemLabels) ? systemLabels.map(itm => itm.name) : []),
      ...(isArray(customLabels) ? customLabels.map(itm => itm.name) : []),
    ];
  }, [item]);

  /**
   * @description 显示与当前poi距离
   */
  const distanceStr = useMemo(() => {
    const distance = item.distance;
    if (!isNotEmpty(distance)) return '';

    if (distance >= 10000) {
      return `${(distance / 1000).toFixed(0)}km`;
    } else if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    } else {
      return `${distance}m`;
    }
  }, [item]);

  return (
    <div className={styles.listItem} onClick={() => handleItem(item)}>
      <div className={styles.titleRow}>
        <div className={cs(styles.titCon, 'fs-14 c-222 bold')}>
          {item.areaName}
        </div>
        <div className={cs('fs-14 bold', styles.score)}>
          {item.mainBrandsScore}分
        </div>
      </div>

      <div className={cs(styles.rankRow, 'mt-6')}>
        <div className={styles.rankRowLeft}>
          {typeLabelImg ? <div className={cs(styles.typeIcon, 'mr-4')}>
            <img src={typeLabelImg} width='100%' height='100%' />
          </div> : <></>}
          {item?.mainBrandsRank < 6 && item?.mainBrandsRank > 0 ? <span className='fs-12 c-666'>{item?.districtName || ''}{item?.firstLevelCategory || ''}排名第 <span className='c-006 bold'>{`${item?.mainBrandsRank || '-'}`}</span> 名</span> : <span className='fs-12 c-666'>{item?.firstLevelCategory || ''}商圈</span>}
        </div>
        {distanceStr ? <div className={styles.rankRowRight}>
          <IconFont iconHref='iconic_dizhi' className='mr-4 fs-10 c-666' />
          <span className='fs-12 c-666'>{distanceStr}</span>
        </div> : <></>}
      </div>

      {otherLabels.length ? <div className={cs(styles.labelRow, 'mt-12')}>
        {otherLabels.map((lbl:string, index: number) => <div key={index} className={styles.label}>{lbl}</div>)}
      </div> : <></>}
    </div>
  );
};

export default ListItem;
