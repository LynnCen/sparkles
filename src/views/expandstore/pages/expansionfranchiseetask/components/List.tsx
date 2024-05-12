/**
 * @Description 标准版拓店任务-列表
 */
import { FC, useEffect, useState } from 'react';
import { isNotEmptyAny } from '@lhb/func';
import { getExpansionTaskList } from '@/common/api/expandStore/expansiontask';
import V2Table from '@/common/components/Data/V2Table';
import styles from '../entry.module.less';
import { TaskStatusColor } from '@/common/components/business/ExpandStore/ts-config';
import { DeleteOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const List: FC<any> = ({
  mainHeight,
  filters,
  setFilters,
  tabActiveKey,
  onClickDetail,
  handlePermissions,
  deletePermission
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<Number>>([]);

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
    const data = await getExpansionTaskList({
      ...params,
      tab: +tabActiveKey, // table第一次请求时不依赖于外部filters参数，为了确保带上tab参数这里再次赋值
    });
    handlePermissions(data?.meta?.permissions);// 设置权限
    return {
      dataSource: data.objectList,
      count: data.totalNum,
    };
  };

  const defaultColumns = [
    {
      key: 'name',
      title: '任务名称',
      dragChecked: true,
      importWidth: true,
      width: 220,
      fixed: 'left',
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <span className={styles.name} onClick={() => onClickDetail && onClickDetail(record)}>
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
      width: 100,
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
        ) : '-';
      },
    },
    {
      key: 'taskTypeName',
      title: '任务类型',
      dragChecked: true,
      width: 200,
      importWidth: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'chancePointStatusName',
      title: '关联机会点状态',
      dragChecked: true,
      width: 200,
      importWidth: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'targetArea',
      title: '目标城市',
      dragChecked: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'firstArea',
      title: '第一意向区域',
      dragChecked: true,
      width: 200,
      importWidth: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'secondArea',
      title: '第二意向区域',
      dragChecked: true,
      width: 200,
      importWidth: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'manager',
      title: '开发经理',
      dragChecked: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'createdAt',
      title: '创建日期',
      dragChecked: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'expectDropInDate',
      title: '期望落位日期',
      dragChecked: true,
      render: value => (isNotEmptyAny(value) ? value : '-'),
    },
    {
      key: 'expectDropInDateCount',
      title: '距离期望落位日期',
      dragChecked: true,
      render: value => (isNotEmptyAny(value) ? <span className={(+value < 0) ? styles.expiredDate : ''}>{value}天</span> : '-'),
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
          post('/standard/task/delete', { ids: selectedRowKeys }, { mockSuffix: '/api', needHint: true }).then(() => {
            V2Message.success('删除成功');
            setFilters({ ...filters });
          }).finally(() => {
            setSelectedRowKeys([]);
          });
        },
      });
    }
  });

  // 在这里编写组件的逻辑和渲染
  return (
    <V2Table
      defaultColumns={defaultColumns}
      onFetch={loadData}
      hideColumnPlaceholder={true}
      filters={filters}
      rowSelection={deletePermission ? {
        selectedRowKeys,
        onChange: methods.onSelectChange,
        type: 'checkbox',
        fixed: true
      } : null}
      rowSelectionOperate={[
        { text: '删除', onClick: methods.handleRemove, icon: <DeleteOutlined /> },
      ]}
      rowKey={record => record.id}
      // 64是分页模块的总大小， 42是table头部，32是顶部标题行
      scroll={{ y: mainHeight - 64 - 42 }}
      emptyRender={true}
    />
  );
};

export default List;
