import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2Drawer from '@/common/components/Feedback/V2Drawer';

import { FC, useEffect, useState } from 'react';
import TaskFilter from './TaskFilter';
import { Button, message } from 'antd';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import ChooseUserModal from './ChooseUserModal';
import { post } from '@/common/request';
import { refactorPermissions } from '@lhb/func';

const Drawer: FC<any> = ({ open, setOpen, employeeId, onHomeSearch }) => {
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    console.log(111, params);
    setParams({ ...params, ...values });
  };
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>([]);

  const { ...methods } = useMethods({
    handleMigrate(record) {
      setSelected([record]);
      setVisible(true);
    },
    handleBatchMigrate() {
      if (selected.length === 0) {
        message.warn('请选择要迁移的任务！');
        return;
      }
      setVisible(true);
    },
  });

  const defaultColumns = [
    {
      title: '任务名称',
      key: 'taskName',
    },
    {
      title: '任务类型',
      key: 'taskTypeName',
    },
    {
      title: '任务状态',
      key: 'taskStatusName',
    },
    {
      title: '操作',
      key: 'operation',
      render: (value: any, record) => (
        <V2Operate
          operateList={refactorPermissions([{ name: '迁移', event: 'migrate' }])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];
  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/497/interface/api/51134
    const result: any = await post(
      '/yn/task/transfer/page',
      { ...params, employeeId },
      {
        isMock: false,
        mockId: 497,
        mockSuffix: '/api',
      }
    );
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  const onClose = () => {
    setOpen(false);
    setParams({});
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  return (
    <>
      <V2Drawer open={open} onClose={onClose} destroyOnClose>
        <V2Container
          style={{ height: 'calc(100vh - 48px)' }}
          emitMainHeight={(h) => setMainHeight(h)}
          extraContent={{
            top: (
              <div>
                <TaskFilter onSearch={onSearch} />
                <Button type='primary' className='mb-16' onClick={methods.handleBatchMigrate}>
                  批量分派
                </Button>
              </div>
            ),
          }}
        >
          <V2Table
            onFetch={loadData}
            filters={params}
            defaultColumns={defaultColumns}
            rowKey='id'
            // 64是分页模块的总大小， 62是table头部
            scroll={{ x: '100%', y: mainHeight - 64 - 20 }}
            hideColumnPlaceholder
            rowSelection={{
              type: 'checkbox',
              onChange: (_, selectedRows) => {
                setSelected(selectedRows);
              },
            }}
          />
        </V2Container>
      </V2Drawer>
      <ChooseUserModal
        visible={visible}
        setVisible={setVisible}
        employeeId={employeeId}
        selectedTask={selected}
        onTaskSearch={onSearch}
        onHomeSearch={onHomeSearch}
      />
    </>
  );
};
export default Drawer;
