/**
 * @Description 踩点信息组件
 */
import V2Table from '@/common/components/Data/V2Table';
import styles from '../index.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { isNotEmptyAny } from '@lhb/func';
import { FC } from 'react';
import { ModuleDetailsType } from '../type';

/** 踩点信息传参类型 */
interface CheckSpotModuleProps {
  data: ModuleDetailsType;
  [p: string]: any;
}

/** 踩点信息组件 */
const CheckSpotModule: FC<CheckSpotModuleProps> = ({ data }) => {

  /**
   * @description 获取加载table表格数据。
   * @return table数据
   */
  const loadData = async () => {
    const objectList = data?.checkSpotModule?.checkSpotDetails || [];
    return {
      dataSource: objectList,
      count: objectList.length,
    };
  };

  /** 表头 */
  const defaultColumns = [
    {
      key: 'checkDate',
      title: '踩点日期',
      dragChecked: true,
      render: (value) => value || '-',
    },
    {
      key: 'flowCount',
      title: '踩点人数',
      dragChecked: true,
      render: (value) => value || '-',
    },
    {
      key: 'deliveryReportUrl',
      title: '报告详情',
      dragChecked: true,
      width: 464,
      render: (value) => {
        return isNotEmptyAny(value) ? (
          <a className={styles.reportLink} href={value} target='_blank' rel='noopener noreferrer'>
            {value}
          </a>
        ) : (
          '-'
        );
      },
    },
  ];


  return (
    <div className={styles.stepOnInfo}>
      <TitleTips name={data.moduleTypeName} showTips={false} />
      <V2Table
        rowKey='deliveryReportUrl' // 设置一个每一行数据唯一的键值
        type='easy'
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        onFetch={loadData}
        pagination={false}
      />
    </div>
  );
};

export default CheckSpotModule;
