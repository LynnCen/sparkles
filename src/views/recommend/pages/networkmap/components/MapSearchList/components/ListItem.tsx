/**
 * @Description Item
 */
import { FC } from 'react';
import { Row, Col, Checkbox, Badge } from 'antd';
import { useMethods } from '@lhb/hook';
import { colorStatus } from '../../../ts-config';
import { isNotEmpty } from '@lhb/func';
import cs from 'classnames';
import styles from '../index.module.less';
import { amountStr } from '@/common/utils/ways';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { getStorage, setStorage } from '@lhb/cache';

const ListItem: FC<any> = ({
  item,
  selectedRowKeys, // 选中项
  setSelectedRowKeys, // 设置选中项
  isBranch, // 是否是分公司
  keywords, // 搜索关键词
  isActive, // 是否生效中的公司
}) => {

  // const PlanedStatus = {
  //   0: {
  //     color: '#F23030',
  //     text: `${isBranch ? '未规划' : '未推荐'}`
  //   }, // 未规划
  //   1: {
  //     color: '#009963',
  //     text: `${isBranch ? '已规划' : '已推荐'}`
  //   }, // 已规划
  // };
  const planedStatus = (node:any) => {
    // 总部
    if (!isBranch) {
      if (node.parentCompanyPlanned) { // 总部是否推荐
        return {
          color: '#F23030',
          text: '已推荐'
        };
      } else {
        return {
          color: '#009963',
          text: '未推荐'
        };
      }
    }
    if (isBranch) {
      if (node?.isChildCompanyAddPlanned) {
        return {
          color: '#FF861D',
          text: '已添加'
        };
      }
      if (node.childCompanyPlanned) {
        return {
          color: '#F23030',
          text: '已规划'
        };
      } else {
        return {
          color: '#009963',
          text: '未规划'
        };
      }
    }
    return null;
  };
  const methods = useMethods({
    handleCheckChange(id: number, e: any) {
      // 第一次勾选时提示
      const val = getStorage('networkmapClusterCheckHint');
      if (!val) {
        V2Message.warning({
          content: '地图拖拽至其他城区，商圈列表中已选中商圈将取消选中',
          duration: 0,
        });
      }
      setStorage('networkmapClusterCheckHint', true);

      e.stopPropagation();
      if (!e.target.checked && selectedRowKeys.includes(id)) { // 取消选中
        const keys: number[] = selectedRowKeys.filter(item => item !== id);
        setSelectedRowKeys(keys);
        return;
      }
      setSelectedRowKeys([...selectedRowKeys, id]);
    },
    prominentStr(str: string) { // 高亮显示
      if (keywords) {
        const matchedText = str.indexOf(keywords) > -1 ? keywords : '';
        const words = str.split(keywords);
        const pre = words[0];
        const cur = matchedText || '';
        const after = words[1];

        return <>
          <span>{pre}</span>
          <span className='c-006'>{cur}</span>
          <span>{after}</span>
        </>;
      }
      return str;
    },
  });



  return (
    <div className={styles.listItemCon}>
      {isActive ? <></> : <div className={styles.leftCheck} onClick={(e) => methods.handleCheckChange(item.planClusterId, e)}>
        <Checkbox
          checked={selectedRowKeys.includes(item.planClusterId)}>
        </Checkbox>
      </div>}
      <div className={styles.rightInfo}>
        <Row align='middle' justify='space-between'>
          <div
            style={{
              width: isActive ? 220 : 192
            }}
            className={cs('c-222', isActive ? '' : 'ml-4', styles.titCon)}>
            {methods.prominentStr(item.areaName)}
          </div>

          <Badge
            className={styles.badge}
            color={planedStatus(item)?.color}
            text={planedStatus(item)?.text} />
        </Row>
        <div
          className={cs('fs-12 mt-10', styles.labelCon)}
          style={{
            // backgroundColor: colorStatus[item.firstLevelCategoryId].labelBg,
            color: colorStatus[item.firstLevelCategoryId].color,
          }}>
          <span>{item.firstLevelCategory}</span>
          <span className='pl-4 pr-4'>|</span>
          <span>{item.secondLevelCategory}</span>
        </div>
        <Row className='mt-10 ff-normal' justify='center'>
          <Col span={8}>
            <div className='c-666 fs-12'>
            奶茶行业评分
            </div>
            <div className='c-222 font-weight-500 ff-medium mt-4'>
              {isNotEmpty(item?.mainBrandsScore) ? item.mainBrandsScore : '-'}
            </div>
          </Col>
          <Col span={isActive ? 8 : 7}>
            <div className='c-666 fs-12'>
            益禾堂评分
            </div>
            <div className='c-222 font-weight-500 ff-medium mt-4'>
              {isNotEmpty(item?.totalScore) ? item.totalScore : '-'}
            </div>
          </Col>
          <Col span={isActive ? 8 : 9}>
            <div className='c-666 fs-12'>
            预测日营业额
            </div>
            <div className='c-222 font-weight-500 ff-medium mt-4'>
              {
                isNotEmpty(item?.lowSalesAmountPredict) && isNotEmpty(item?.upSalesAmountPredict) ? <>
                  {amountStr(item?.lowSalesAmountPredict)}-{amountStr(item?.upSalesAmountPredict)}
                </> : <>
                  {isNotEmpty(item?.lowSalesAmountPredict) ? amountStr(item?.lowSalesAmountPredict) : ''}
                  {
                    !isNotEmpty(item?.lowSalesAmountPredict) && !isNotEmpty(item?.upSalesAmountPredict) ? '-' : ''
                  }
                  {isNotEmpty(item?.upSalesAmountPredict) ? amountStr(item?.upSalesAmountPredict) : ''}
                </>
              }
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ListItem;
