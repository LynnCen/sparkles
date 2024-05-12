/**
 * @Description 标准版拓店任务-列表
 */
import { FC, useEffect, useRef, useState } from 'react';
import { isNotEmptyAny } from '@lhb/func';
import V2Table from '@/common/components/Data/V2Table';
import styles from '../entry.module.less';
import { TaskStatusColor } from '@/common/components/business/ExpandStore/ts-config';
import { DeleteOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { getExpansionCircleTaskList } from '@/common/api/expandStore/expansionCircleTask';

const List: FC<any> = ({
  mainHeight,
  filters,
  setFilters,
  tabActiveKey,
  onClickDetail,
  handlePermissions,
  deletePermission,
  setLoading,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<Number>>([]);
  const tabRef = useRef<string>();

  useEffect(() => {
    if (tabActiveKey) {
      setSelectedRowKeys([]);
    }
  }, [tabActiveKey]);

  useEffect(() => {
    console.log(filters);
    setSelectedRowKeys([]);
  }, [filters]);

  /**
   * @description 获取加载table表格数据。该函数依赖fitles变化自动触发
   * @param params fitles和搜索框参数（当前页面只有keyword）
   * @return table数据
   */
  const loadData = async (params: any) => {
    setLoading(true);
    const data = await getExpansionCircleTaskList({
      ...params,
      tab: +tabActiveKey, // table第一次请求时不依赖于外部filters参数，为了确保带上tab参数这里再次赋值
    });
    setLoading(false);
    handlePermissions(data?.meta?.permissions); // 设置权限
    return {
      dataSource: data.objectList,
      count: data.totalNum,
    };
  };
  const handleClick = (record) => {
    onClickDetail && onClickDetail(record, tabRef.current);
  };


  const defaultColumns = [
    {
      key: 'name',
      title: '任务名称',
      dragChecked: true,
      importWidth: true,
      width: 270,
      fixed: 'left',
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <span className={styles.name} onClick={() => handleClick(record,)}>
            {value}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      key: 'status',
      title: '任务状态',
      dragChecked: true,
      width: 88,
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <div className={styles.taskStatus}>
            <span
              className={styles.taskStatusIcon}
              style={{
                backgroundColor: TaskStatusColor[value],
              }}
            />
            {record.statusName}
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      key: 'chancePoints',
      title: '关联机会点数量',
      dragChecked: true,
      width: 160,
      importWidth: true,
      render: (value, record) => (isNotEmptyAny(value)
        ? (
          <span className={styles.name} onClick={() => onClickDetail && onClickDetail(record)}>
            {value.length}
          </span>
        )
        : '0'),
    },
    {
      key: 'targetArea',
      title: '目标城市',
      width: 120,
      dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'emergencyDegreeName',
      title: '紧急度',
      dragChecked: true,
      width: 80,
      importWidth: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'manager',
      title: '开发经理',
      width: 100,
      dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'createdAt',
      title: '创建时间',
      width: 100,
      dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'expectDropInDate',
      title: '期望落位日期',
      width: 120,
      dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'expectDropInDateCount',
      title: '距离期望落位日期',
      width: 150,
      dragChecked: true,
      render: (value) =>
        isNotEmptyAny(value) ? <span className={+value < 0 ? styles.expiredDate : ''}>{value}天</span> : '-',
    },
  ];

  const methods = useMethods({
    onSelectChange(selectedRowKeys: any) {
      setSelectedRowKeys(selectedRowKeys);
    },
    handleRemove() {
      V2Confirm({
        content: '确定删除当前已选择的拓店任务吗?',
        onOk: () => {
          post('/standard/task/delete', { ids: selectedRowKeys }, { mockSuffix: '/api', needHint: true })
            .then(() => {
              V2Message.success('删除成功');
              setFilters({ ...filters });
            })
            .finally(() => {
              setSelectedRowKeys([]);
            });
        },
      });
    },
  });

  return (
    <V2Table
      defaultColumns={defaultColumns}
      onFetch={loadData}
      hideColumnPlaceholder={true}
      filters={filters}
      rowSelection={
        deletePermission
          ? {
            selectedRowKeys,
            onChange: methods.onSelectChange,
            type: 'checkbox',
            fixed: true,
          }
          : null
      }
      rowSelectionOperate={[{ text: '删除', onClick: methods.handleRemove, icon: <DeleteOutlined /> }]}
      rowKey={(record) => record.id}
      scroll={{ y: mainHeight - 64 - 42 }}
      emptyRender={true}
    />
  );
};

export default List;
