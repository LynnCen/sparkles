/**
 * @Description 机会点管理-列表
 */
import { FC, useEffect, useState } from 'react';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { Typography } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
// import styles from '../entry.module.less';
import { getDynamicDetail } from '@/common/api/expandStore/chancepoint';
import { analysisTableTitle } from '@/common/components/business/DynamicComponent/config';
const { Text } = Typography;

const List: FC<any> = ({
  mainHeight,
  filters,
  onClickDetail,
  setPermissions,
}) => {
  const [column, setColumn] = useState<any>([]);

  useEffect(() => {
    getDynamicDetail({}).then((data) => {
      setPermissions(data?.meta?.permissions);// 设置表头权限

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
      (targetArray as any[]).splice(insertIndex, 0, ...defaultColumns);

      setColumn(targetArray || []);
    });
  }, []);

  /**
	 * @description 获取加载table表格数据。该函数依赖fitles变化自动触发
	 * @param params fitles和搜索框参数（当前页面只有keyword）
	 * @return table数据
	 */
  const loadData = async (params) => {
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

    return {
      dataSource: res,
      count: data.totalNum,
    };
  };

  // 固定写死机会点名称，对应的开发经理，机会点状态
  const defaultColumns = [
    {
      key: 'name',
      title: '机会点名称',
      dragChecked: true,
      render: (value, record) => (
        // <span className={ styles.name } onClick={() => onClickDetail(record, 0)}>
        //   {value || '-'}
        // </span>
        <Text
          style={{ width: 300, color: '#2441b3' }}
          ellipsis={{ tooltip: value }}
          onClick={() => onClickDetail(record, 0)}
        >
          <span className='pointer'>{value || '-'}</span>
        </Text>
      )
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

  // 渲染内容
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

  // 在这里编写组件的逻辑和渲染
  return (
    (isArray(column) && column.length) ? <V2Table
      defaultColumns={column}
      onFetch={loadData}
      hideColumnPlaceholder={true}
      filters={filters}
      rowKey='id'
      // 64是分页模块的总大小， 42是table头部
      scroll={{ y: mainHeight - 64 - 42 - 56 }}
    /> : <></>
  );
};

export default List;
