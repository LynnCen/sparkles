/**
 * @Description Item
 */
import { FC } from 'react';
// Checkbox
// import { useMethods } from '@lhb/hook';
import { Tooltip } from 'antd';
import { colorStatus } from '../../../ts-config';
import { isNotEmpty } from '@lhb/func';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';
import styles from '../index.module.less';
import HighlightRow from '@/common/components/business/HighlightRow';

const ListItem: FC<any> = ({
  item,
  // selectedRowKeys, // 选中项
  // setSelectedRowKeys, // 设置选中项
  keywords, // 搜索关键词
}) => {
  // const methods = useMethods({
  //   handleCheckChange(id: number, e: any) {
  //     if (!e.target.checked && selectedRowKeys.includes(id)) { // 取消选中
  //       const keys: number[] = selectedRowKeys.filter(item => item !== id);
  //       setSelectedRowKeys(keys);
  //       return;
  //     }
  //     setSelectedRowKeys([...selectedRowKeys, id]);
  //   }
  //   prominentStr(str: string) { // 高亮显示
  //     if (keywords) {
  //       const matchedText = str.indexOf(keywords) > -1 ? keywords : '';
  //       const words = str.split(keywords);
  //       const pre = words[0];
  //       const cur = matchedText || '';
  //       const after = words[1];

  //       return <>
  //         <span>{pre}</span>
  //         <span className='c-006'>{cur}</span>
  //         <span>{after}</span>
  //       </>;
  //     }
  //     return str;
  //   },
  // });

  return (
    <div className={styles.listItemCon}>
      <div className={styles.titleRow}>
        {/* onClick={(e) => e.stopPropagation()} */}
        {/* <Checkbox
            checked={selectedRowKeys.includes(item.planClusterId)}
            onChange={(e) => methods.handleCheckChange(item.planClusterId, e)}>
            <div className={cs('c-222', styles.titCon)} title={item.areaName}>
              {methods.prominentStr(item.areaName)}
            </div>
          </Checkbox> */}
        {/* <div className={cs('c-222 fs-14', styles.titCon)} title={item.areaName}>
          {methods.prominentStr(item.areaName)}
        </div> */}
        <HighlightRow
          className={cs('c-222 fs-14', styles.titCon)}
          text={item.areaName}
          keywords={keywords}/>
        { isNotEmpty(item?.mainBrandsScore) ? <Tooltip placement='top' title='行业评分'>
          <div className={cs('fs-12 font-weight-500 ff-medium', styles.score)}>
            {item.mainBrandsScore}分
          </div>
        </Tooltip> : <div className='c-222 fs-12 font-weight-500 ff-medium'>-</div>}
      </div>

      <div className={cs('fs-12 mt-8', styles.infoRow)}>
        <div
          className={styles.labelCon}
          style={{
            color: colorStatus[item?.firstLevelCategoryId]?.color,
          }}>
          {item.firstLevelCategory}
        </div>
        <span className={cs('pl-10 pr-10', styles.divider)}>|</span>
        <IconFont iconHref='iconic_dizhi' style={{ width: '12px', height: '12px', color: '#999' }} />
        <span className={cs('c-666 pl-4', styles.address)}>{item.provinceName && (item.provinceName !== item.cityName) ? item.provinceName : ''}{item.cityName || ''}{item.districtName || ''}</span>
      </div>
    </div>
  );
};

export default ListItem;
