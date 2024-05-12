/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模块 */
import { FC, useEffect, useState } from 'react';
import { Modal, Spin, Typography } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import { expandModuleAdd, expandModules } from '@/common/api/storeTemplateConfig';
import V2Operate from '@/common/components/Others/V2Operate';
import { refactorPermissions } from '@lhb/func';

const { Text } = Typography;

const AddModuleOperate: FC<any> = ({ visible, setVisible, onSearch, id, tenantId, configuredTypes }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<any>({});

  const refresh = () => {
    setParams({});
  };

  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible, configuredTypes]);

  const onSubmit = () => {
    onCancel();
  };

  const onCancel = () => {
    setVisible(false);
  };

  const handleAdd = (record) => {
    setLoading(true);
    expandModuleAdd({ relationId: id, tenantId, moduleName: record.name, moduleType: record.type }).finally(() => {
      onSearch();
      setLoading(false);
    });

  };

  const loadData = async (params) => {
    const result: any = await expandModules(params);
    return {
      dataSource: result?.map(item => ({ ...item, disabled: configuredTypes.includes(item.type) })) || [],
      count: result?.length || 0,
    };
  };

  const columns = [
    {
      title: '模块名称',
      key: 'name',
      width: '200px',
      dragChecked: true,
    },
    {
      title: '操作',
      key: 'operate',
      width: '100px',
      dragChecked: true,
      render: (_, record) => {
        if (record.disabled) {
          return <Text disabled>添加</Text>;
        }
        return (
          <V2Operate
            onClick={() => handleAdd(record)}
            operateList={refactorPermissions([{ name: '添加', event: 'add' }])}
          />
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title='添加模块'
        open={visible}
        onOk={onSubmit}
        width={400}
        onCancel={onCancel}
        getContainer={false}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <V2Table
            onFetch={loadData}
            filters={params}
            rowKey='type'
            defaultColumns={columns}
            hideColumnPlaceholder
            emptyRender
            pagination={false}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default AddModuleOperate;
