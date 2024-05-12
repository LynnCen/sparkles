/**
 * @Description Item
 */
import { FC } from 'react';
import { Row, Col } from 'antd';
import { useMethods } from '@lhb/hook';
import { colorStatus } from '../../../ts-config';
import { isNotEmpty } from '@lhb/func';
import cs from 'classnames';
import styles from '../index.module.less';
import { amountStr } from '@/common/utils/ways';

const ListItem: FC<any> = ({
  item,
  selectedRowKeys, // 选中项
  setSelectedRowKeys, // 设置选中项
  // isBranch, // 是否是分公司
  keywords, // 搜索关键词
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

  const methods = useMethods({
    handleCheckChange(id: number, e: any) {
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
      <Row align='middle'>
        <Col span={18}>
          {/* <Checkbox
            checked={selectedRowKeys.includes(item.planClusterId)}
            onChange={(e) => methods.handleCheckChange(item.planClusterId, e)}> */}
          <div className={cs('c-222 mr-20', styles.titCon)}>
            {methods.prominentStr(item.areaName)}
          </div>
          {/* </Checkbox> */}
        </Col>
        {/* <Col span={6} className='rt'>
          <Badge
            color={PlanedStatus[item.isPlaned || 0].color}
            text={PlanedStatus[item.isPlaned || 0].text} />
        </Col> */}
      </Row>
      <div
        className={cs('fs-12 mt-12', styles.labelCon)}
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
        <Col span={8}>
          <div className='c-666 fs-12'>
            益禾堂评分
          </div>
          <div className='c-222 font-weight-500 ff-medium mt-4'>
            {isNotEmpty(item?.totalScore) ? item.totalScore : '-'}
          </div>
        </Col>
        <Col span={8}>
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
  );
};

export default ListItem;
