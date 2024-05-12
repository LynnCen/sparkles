/**
 * @Description 集客点报表-全国统计
 */
import { FC, useEffect, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { isArray, isNotEmpty } from '@lhb/func';
import { statisticsTotal, statisticsList } from '@/common/api/expandStore/planspot';
import { Table } from 'antd';

/**
 * @description 列表中个数统计列的共通设置
 */
const countColConfig = {
  width: 150,
  render: (value) => isNotEmpty(value) ? value : '-'
};

interface StatisticsProps {
  mainHeight: any;
  style?: any;
}

const Statistics: FC<StatisticsProps> = ({
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  style,
}) => {
  const [total, setTotal] = useState<any>({});

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = async() => {
    const data = await statisticsTotal();
    setTotal(data || {});
  };

  /**
   * @description 获取加载table表格数据。该函数依赖filters变化自动触发
   * @param params filters和搜索框参数
   * @return table数据
   */
  const loadData = async (params) => {
    const { objectList, totalNum } = await statisticsList({
      ...params
    });
    return {
      dataSource: isArray(objectList) ? objectList : [],
      count: totalNum,
    };
  };

  const defaultColumns = [
    { key: 'name', title: '分公司名称', fixed: 'left' },
    { key: 'planBusinessCount', title: '规划商圈数', ...countColConfig },
    { key: 'spotPassBusinessCount', title: '集客点已通过商圈', ...countColConfig },
    { key: 'spotApprovalBusinessCount', title: '集客点审批中商圈', ...countColConfig },
    { key: 'spotNoInputBusinessCount', title: '未录入商圈', ...countColConfig },
    { key: 'spotApprovalCount', title: '审批中集客点数', ...countColConfig },
    { key: 'spotPassCount', title: '已通过集客点数', ...countColConfig },
    { key: 'spotRelationChancePointCount', title: '已关联机会点', ...countColConfig },
  ];

  /**
   * @description 总计栏
   */
  const renderSummary = () => {
    return (
      Object.keys(total)?.length > 0 ? <Table.Summary fixed='top'>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>{total.name}</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>{total.planBusinessCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{total.spotPassBusinessCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{total.spotApprovalBusinessCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{total.spotNoInputBusinessCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{total.spotApprovalCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{total.spotPassCount}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{total.spotRelationChancePointCount}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary> : <></>
    );
  };

  return (
    <>
      {
        Object.keys(total)?.length > 0 ? <div style={style || {}}>
          <V2Table
            defaultColumns={defaultColumns}
            onFetch={loadData}
            hideColumnPlaceholder={true}
            filters={{}}
            rowKey='id'
            // 64是分页模块的总大小， 42是table头部
            scroll={{ y: mainHeight - 64 - 42 - 64 }}
            pageSize={50}
            // emptyRender
            summary={renderSummary}
          />
        </div> : <></>
      }
    </>
  );
};

export default Statistics;
