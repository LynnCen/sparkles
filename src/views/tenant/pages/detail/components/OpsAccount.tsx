// import { Button, Popconfirm, Space } from 'antd';
import { FC, useEffect, useState, MouseEventHandler, Key, ReactNode } from 'react';
import ActionTable from './table';
import { opsAccountStore } from '@/views/tenant/store';
import { unstable_batchedUpdates } from 'react-dom';
import FormInModal from '@/common/components/formInModal';
import { Form, message, Space, Button, Popconfirm } from 'antd';
import FormSelect from '@/common/components/Form/FormSelect';
import opsAccountMap from '../../api/opsAccount';
import { ButtonType } from 'antd/lib/button';
import useVisible from '@/common/hook/useVisible';
import { ColumnProps } from 'antd/lib/table';

const { getList, getUserListBykeyword, remove } = opsAccountStore;

export const debunce = (cb: Function) => {
  let rafId: any = null;
  const clear = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };
  (debunce as any).clear = clear;

  return (...args: any[]) => {
    if (rafId) {
      clear();
      return;
    }
    rafId = requestAnimationFrame(() => {
      cb.apply(this, args);
    });
  };

};

interface OpsAccountProps {
  tenantId: number
};

const columns = [
  {
    title: '序号',
    render(_: any, __: any, index: number) {
      return index + 1;
    },
    align: 'center'
  },
  {
    title: '账号',
    dataIndex: 'accountName',
    align: 'center',

  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '手机',
    dataIndex: 'mobile',
    align: 'center'
  },
  {
    title: '部门',
    dataIndex: 'department',
    algin: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    align: 'center'
  },
];

interface Action {
  name: string;
  onClick: MouseEventHandler;
  type: ButtonType;
  key: Key;
}

const renderActions = (actions: Action[]) => {
  return (
    <Space>
      {actions.map(action => {
        const { type, onClick, name, key } = action;
        return (
          <Button
            type={type}
            key={key}
            onClick={onClick}>
            {name}</Button>

        );
      })}
    </Space>
  );
};

// 根据map渲染不一样的操作组件
function renderDiffComponentByEvent(event: string, name: string, onClick: (actionType: string) => void) {
  const handleClick = () => {
    onClick(event);
  };

  const actionComponentMap = new Map<string, ReactNode>([
    [
      'tenant:removeSystemAccount', (
        <Popconfirm
          title='此操作将永久删除该数据, 是否继续？'
          key={event}
          onConfirm={handleClick}
          okText='确定'
          cancelText='取消'
        >
          <Button type='link' danger>{name}</Button>
        </Popconfirm>)
    ],
    // 授权下期才做 todo
    ['', (
      <Button
        key={event}
        type='link'
        onClick={handleClick}>
        {name}
      </Button>)
    ]
  ]);

  return actionComponentMap.get(event);
}



const OpsAccount: FC<OpsAccountProps> = ({ tenantId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [options, setOptions] = useState<{ label?: string, value?: number }[]>([]);
  const { onHidden, onShow, visible } = useVisible(false);
  const { clear } = debunce as any;
  const [actions, setActions] = useState<Action[]>([]);
  const [newCloumns, setNewCloumns] = useState<ColumnProps<any>[]>(columns as any);

  // 新增按钮
  const onAdd = () => {
    onShow();
  };

  // 移除按钮
  const onRemove = async (record: any) => {
    const { accountId } = record;
    const success = await remove(tenantId, accountId);
    if (success) {
      message.success('删除成功');
      getAccounts(tenantId);
    }
  };

  // 按钮操作map
  const onClickMap = new Map<string, Function>([
    ['tenant:createSystemAccount', onAdd],
    ['tenant:removeSystemAccount', onRemove]
  ]);

  // 按钮类型map
  const typeMap = new Map<string, ButtonType>([
    ['tenant:createSystemAccount', 'primary'],
  ]);

  // 提交新增运维
  const onSubmitForm = (success: boolean) => {
    if (success) {
      message.success('新增成功');
      onHidden();
      getAccounts(tenantId);
    }
  };

  // 搜索按钮
  const onSearch = debunce(async (keyword: string) => {
    const options = await getUserListBykeyword(keyword);
    setOptions(options);
  });

  // 获取运维列表
  const getAccounts = async (tenantId: number) => {
    if (!tenantId) {
      return;
    }

    setLoading(true);
    const result = await getList(tenantId) || {};
    const { objectList, permissions = [] } = result;

    // 处理action按钮
    const actions = permissions.map(action => {
      const { name, event } = action;
      return {
        name,
        type: typeMap.get(event as string),
        onClick: onClickMap.get(event as string),
        key: event,
      };
    });

    // 由于接口中返回才能进行判断组件的渲染
    // @ts-ignore
    const newCloumns = [...columns, {
      title: '操作',
      align: 'center',
      render: (_: any, record: any) => {
        const { permissions, ...restRecord } = record;
        const onActionClick = (actionType: string) => {
          const event = onClickMap.get(actionType);
          event?.(restRecord);
        };

        return (
          <Space>
            {
              permissions?.map(permission => {
                const { name, event } = permission;
                return renderDiffComponentByEvent(event, name, onActionClick);
              })
            }
          </Space>
        );
      }
    }];


    unstable_batchedUpdates(() => {
      setData(objectList);
      setLoading(false);
      setActions(actions as Action[]);
      setNewCloumns(newCloumns as any);
    });
  };


  useEffect(() => {
    getAccounts(tenantId);
  }, [tenantId]);

  useEffect(() => {
    onSearch('');
    return () => {
      clear?.();
    };
  }, []);

  return (
    <>
      <ActionTable
        actions={renderActions(actions)}
        columns={newCloumns as any}
        title='运维账号'
        dataSource={data}
        loading={loading}
      />
      <FormInModal
        title='新增运维账号'
        visible={visible}
        extraData={{ tenantId }}
        onCancelSubmit={onHidden}
        onSubmit={onSubmitForm}
        url={opsAccountMap.get('add')}
        proxyApi='/mirage'
      >
        <Form>
          <FormSelect
            name='employeeId'
            label='选择员工'
            options={options}
            config={{
              onSearch,
              allowClear: true,
              showSearch: true,
              filterOption: false,
            }}
            rules={[
              {
                required: true,
                message: '员工必须选',
              }
            ]}
          />
        </Form>
      </FormInModal>
    </>
  );
};

export default OpsAccount;
