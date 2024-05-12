import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, message, Popconfirm, Row, Space, Table, Tooltip } from 'antd';
import { FC, Key, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { buttons } from '../../api';
import { useVisible } from '../../hooks';
import { buttonStore } from '../../store';
import { Permission } from '../../store/button';
import FormInModal from '@/common/components/formInModal';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';

// button列表相关接口
const { getListByMenuId, deleteItemById } = buttonStore;

const { useForm } = Form;


interface ButtonTableProps {
  menuId?: Key | null;
  treeData?: any
};

const columns = [
  {
    title: '按钮名称',
    dataIndex: 'name',
    algin: 'cnter',
  },
  {
    title: '按钮编码',
    dataIndex: 'encode',
    algin: 'cnter',
  },
  {
    title: '说明',
    dataIndex: 'desc',
    algin: 'cnter',
  }];

const ButtonTable: FC<ButtonTableProps> = (props) => {
  const { menuId, treeData } = props;
  const { visible, onHidden, onShow, } = useVisible(false);
  const [data, setData] = useState<Permission[]>([]);
  const [id, setId] = useState<number| null>(null);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const action: any = {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    render(_, record: any) {
      // 编辑
      const onEidtClick = () => {
        handleEditClick(record);
      };
      // 删除
      const onDeleteClick = () => {
        handleDeleteClick(record);
      };
      return (
        <Space>
          <Button type='link' onClick={onEidtClick}>编辑</Button>
          <Popconfirm
            title='此操作将永久删除该数据, 是否继续？'
            onConfirm={onDeleteClick}
            okText='确定'
            cancelText='取消'
          >
            <Button type='link'danger>删除</Button>
          </Popconfirm>
        </Space>
      );
    },
  };
  // 列表配置项
  // @ts-ignore
  const newCloums = [...columns, action];

  // 编辑按钮弹窗
  const handleEditClick = (data: Permission) => {
    const { id } = data;
    setId(id);
    setFieldsValue({ ...data, moduleId: menuId });
    onShow();
  };

  const handleDeleteClick = async (data: Permission) => {
    const { id } = data;
    const success = await deleteItemById(id);
    if (success) {
      message.success('删除成功');
      getList(menuId as number);
    } else {
      message.error('删除失败');
    }
  };

  // 新增按钮弹窗
  const handleAddClick = () => {
    setId(null);
    setFieldsValue({ moduleId: menuId });
    onShow();
  };

  const setFieldsValue = (values: any) => {
    form.setFieldsValue(values);
  };

  const onSubmit = (success: boolean) => {
    if (success) {
      message.success(menuId ? '修改成功' : '新增成功');
      getList(menuId as number);
      onHidden();
    } else {
      message.error('新增失败');
    }
  };


  const getList = async(menuId: number) => {
    if (!menuId) {
      return;
    }
    setLoading(true);
    const data = await getListByMenuId(menuId as number) || {};
    const rafId = requestAnimationFrame(() => {
      unstable_batchedUpdates(() => {
        setLoading(false);
        setData(data || []);
      });
    });
    return () => {
      cancelAnimationFrame(rafId);
    };
  };

  useEffect(() => {
    getList(menuId as number);
  }, [menuId]);

  return (
    <>
      <Card>
        <div className={styles.tableToolbar}>
          <div className={styles.tableToolbarContainer}>
            <div className={styles.tableToolbarLeft}>
              <div className={styles.tableToolbarTitle}>按钮列表</div>
            </div>
            <div className={styles.tableToolbarRight}>
              <Button type='primary' onClick={handleAddClick}>新增</Button>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <Table
            rowKey='id'
            sticky
            columns={newCloums}
            dataSource={data}
            loading={loading}
            pagination={false}/>
        </div>
      </Card>
      <FormInModal
        form={form}
        visible={visible}
        onSubmit={onSubmit}
        onCancelSubmit={onHidden}
        title={id ? '编辑按钮' : '新增按钮'}
        url={buttons.get(id ? 'update' : 'add') }
        proxyApi='/mirage'
        width={640}
        extraData={{ id }}
      >
        <V2Form>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormInput
                label='按钮名称'
                name='name'
                required/>
              <V2FormInput
                label='按钮编码'
                name='encode'
                disabled={!!id}
                required/>
            </Col>
            <Col span={12}>
              <V2FormTreeSelect
                label={(<> <Tooltip title='空代表添加到根结点'>
                  <QuestionCircleOutlined />
                </Tooltip>上级菜单</>)}
                treeData={treeData}
                name='moduleId'
                disabled={!!id}
                placeholder='请选择上级菜单'/>
              <V2FormTextArea
                label='说明'
                name='desc'
                maxLength={200}
                config={{ showCount: true }}/>
            </Col>
          </Row>
        </V2Form>
      </FormInModal>
    </>
  );
};

export default ButtonTable;
