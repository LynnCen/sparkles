/**
 * @Description 商圈详情-机会点列表
 */

import { FC, useEffect, useRef, useState } from 'react';
import { Typography } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Table from '@/common/components/Data/V2Table';
import PointDetail from '@/common/components/business/ExpandStore/ChancePointDetail';
import styles from './index.module.less';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getDynamicDetail } from '@/common/api/expandStore/chancepoint';
import { analysisTableTitle } from '@/common/components/business/DynamicComponent/config';

const { Text } = Typography;

const PAGE_SIZE = 10;

const Chancepoint: FC<any> = ({
  clusterId,
  canViewDetail = true
}) => {
  const tableRef: any = useRef(null);
  const [filters, setFilters] = useState<any>({}); // 参数变化的时候会触发请求更新table表格
  const [column, setColumn] = useState<any>([]);
  const [chanceId, setChanceId] = useState<any>(0);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 机会点详情是否可见
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });
  const [refreshDetail, setRefreshDetail] = useState<number>(0);
  const [totalNum, setTotalNum] = useState<number>(0);

  useEffect(() => {
    clusterId && fetchColumns();
  }, [clusterId]);

  /**
   * @description 刷新本页
   */
  const handleRefreshCurrent = () => {
    (tableRef.current as any).onload(true);
  };

  const methods = useMethods({
    handleChance(id: number) {
      if (canViewDetail) {
        setChanceId(id);
        setDrawerVisible(true);
      }
    },
  });

  const fetchColumns = () => {
    const params: any = {
      page: 1,
      size: 1,
      modelClusterId: clusterId,
      dynamicTemplateType: 2, // 动态表头模版类型 ： 1：机会点， 2:选址地图商圈  默认1
    };
    getDynamicDetail(params).then((data) => {
      // 固定写死机会点名称，对应的开发经理，机会点状态
      let targetArray: any[] = [];
      if (data?.objectList && isArray(data?.objectList[0]?.columns) && data?.objectList[0]?.columns.length) {
        const res = data?.objectList[0]?.columns?.map((item) => {
          return {
            key: item.identification,
            title: item.propertyName,
            dragChecked: true,
            render: (value: string,) => renderColumn(value)
          };
        });
        targetArray = res || [];
      }
      const insertIndex = 0;
      (targetArray as any[]).splice(insertIndex, 0, ...preColumns);

      setColumn(targetArray || []);

      setTotalNum(data.totalNum || 0);

      setFilters({});
    });
  };

  /**
	 * @description 获取加载table表格数据。该函数依赖fitles变化自动触发
	 * @param params fitles和搜索框参数（当前页面只有keyword）
	 * @return table数据
	 */
  const loadData = async (params) => {
    params = {
      ...params,
      modelClusterId: clusterId,
      dynamicTemplateType: 2, // 动态表头模版类型 ： 1：机会点， 2:选址地图商圈  默认1
    };
    const data = await getDynamicDetail(params);
    let arr:any = {};
    const res = data?.objectList?.map((item) => {
      item?.columns?.map((i) => {
        const res = analysisTableTitle(i);
        arr = {
          ...arr,
          [i.identification]: res
        };
      });
      // 是否包含有动态配置的机会点名称
      return {
        id: item.id,
        // 固定写死项目
        name: item.name,
        accountName: item.accountName,
        statusName: item.statusName,
        // 动态表头项目
        ...arr,
      };
    });
    setTotalNum(data.totalNum || 0);
    return {
      dataSource: res,
      count: data.totalNum,
    };
  };

  // 渲染内容（针对动态表头的列）
  const renderColumn = (value: any) => {
    if (value?.isImg) {
      return <>
        { value?.component?.map((item) => {
          return <span className='mr-6 inline-block' dangerouslySetInnerHTML={{ __html: item }}></span>
          ;
        })}
      </>;
    }
    return isNotEmptyAny(value) ? value : '-';
  };

  // 最前面固定列：机会点名称，对应的开发经理，机会点状态
  const preColumns = [
    {
      key: 'name',
      title: '机会点名称',
      fixed: 'left',
      dragChecked: true,
      render: (value, record) => <Text
        style={{ width: 300, color: canViewDetail ? '#006aff' : '' }}
        ellipsis={{ tooltip: value }}
        onClick={() => methods.handleChance(record.id)}
      >
        <span className={canViewDetail ? 'pointer' : ''}>{value}</span>
      </Text>
      // canViewDetail ? (<Link onClick={() => methods.handleChance(record.id)}>{value}</Link>) : isNotEmptyAny(value) ? value : '-'
    },
    {
      key: 'accountName',
      title: '开发经理',
      dragChecked: true,
      render: (value: string) => isNotEmptyAny(value) ? value : '-'
    },
    {
      key: 'statusName',
      title: '机会点状态',
      dragChecked: true,
      render: (value: string) => isNotEmptyAny(value) ? value : '-'
    }
  ];

  return (
    totalNum ? <div className={cs(styles.chancepoint, 'mt-32')}>
      <V2Title divider type='H2' text={`商圈内机会点（${totalNum}）`}/>

      {isArray(column) && column.length ? <V2Table
        ref={tableRef}
        filters={filters}
        rowKey='id'
        defaultColumns={column}
        hideColumnPlaceholder
        onFetch={loadData}
        pageSize={PAGE_SIZE}
        pagination={totalNum > PAGE_SIZE}
        paginationConfig={{
          pageSizeOptions: [PAGE_SIZE],
          hideOnSinglePage: true,
        }}
        scroll={{ y: 550 }}
        className='mt-12'
        emptyRender={true}
      /> : <></>}

      <PointDetail
        pointId={chanceId}
        detailVisible={drawerVisible}
        setFormDrawerData={setFormDrawerData}
        setDetailVisible={setDrawerVisible}
        refreshDetail={refreshDetail}
        formDrawerData={formDrawerData}
        onSearch={handleRefreshCurrent}
        updateHandle={() => setRefreshDetail(refreshDetail + 1)}
      />
    </div> : <></>
  );
};

export default Chancepoint;
