/**
 * @Description 拓店任务类型配置
 */
import { FC, useEffect, useState } from 'react';
import { Button, Form, Spin, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import EditTask from './components/EditType';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';
import styles from './index.module.less';
import {
  getTaskTemplateDetail,
  getTaskTemplateList,
  taskTemplateSave,
  taskTypeDelete,
  taskTypeList,
} from '@/common/api/location';
import V2Title from '@/common/components/Feedback/V2Title';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

interface Props {
  tenantId: string | number;
  mainHeight: number;
}

const TaskType: FC<Props> = ({ tenantId, mainHeight }) => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({});
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState<number>(0);
  const [codes, setCodes] = useState<any>([]);
  const [showTypeConfig, setShowTypeConfig] = useState<boolean>(false);

  const methods = useMethods({
    handleAdd() {
      setRecord({});
      setVisible(true);
    },
    handleUpdate(record) {
      setRecord(record);
      setVisible(true);
    },
    handleDelete(record) {
      V2Confirm({
        content: '是否删除该类型？',
        onSure(modal: any) {
          taskTypeDelete({ tenantId, id: record.id }).then(() => {
            V2Message.success('删除成功');
            modal.destroy();
            onRefresh();
          });
        },
      });
    },
  });


  const onRefreshAll = () => {
    setRefresh(refresh + 1);
  };

  /**
   * @description 新增/编辑/删除后触发列表刷新
   */
  const onRefresh = () => {
    setFilters({});
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存配置
      taskTemplateSave({ tenantId, taskTemplateCode: values.taskTemplateCode })
        .then(() => {
          onRefreshAll();
          message.success('保存成功');
        })
        .finally(() => {
          setSpinning(false);
        });
    });
  };

  /**
   * @description 收到table的回调，请求列表数据
   */
  const loadData = async () => {
    setSpinning(true);
    const data = await taskTypeList({ tenantId }).finally(() => {
      setSpinning(false);
    });
    return {
      dataSource: data,
      count: data.length,
    };
  };

  const defaultColumns = [
    { key: 'id', title: '序号', width: 80 },
    { key: 'typeName', title: '类型名称' },
    {
      key: 'permissions',
      title: '操作',
      width: 80,
      render: (_, record) => {
        const operateList: any[] = [
          { event: 'update', name: '编辑' },
          { event: 'delete', name: '删除' },
        ];
        return (
          <V2Operate operateList={refactorPermissions(operateList)} onClick={(btn: any) => methods[btn.func](record)} />
        );
      },
    },
  ];

  const loadConfig = async () => {
    // 获取模板列表
    getTaskTemplateList().then((res) => {
      setCodes(res);
    });

    // 获取当前租户配置模板
    getTaskTemplateDetail({ tenantId }).then((res) => {
      form.setFieldValue('taskTemplateCode', res.taskTemplateCode);
      setShowTypeConfig(res.taskTemplateCode === 'standardA');
    });
  };

  const onChange = (value) => {
    setShowTypeConfig(value === 'standardA');
  };

  useEffect(() => {
    form.resetFields();
    loadConfig();
  }, [refresh]);

  return (
    <div>
      <Spin spinning={spinning}>
        <div>
          <Form form={form} colon={false}>
            <V2FormSelect
              label='选择当前模板'
              name='taskTemplateCode'
              options={codes}
              onChange={onChange}
              config={{
                style: { width: '200px' },
                placeholder: '请选择当前模板',
                fieldNames: {
                  label: 'name',
                  value: 'taskTemplateCode',
                },
              }}
              rules={[{ required: true }]}
            />
          </Form>
        </div>

        {showTypeConfig ? (
          <>
            <div>
              <V2Title type='H2' text={'拓店任务类型'} style={{ marginTop: 20 }} />
              <div className={styles.taskType}>
                <V2Container
                  style={{ height: mainHeight }}
                  emitMainHeight={(h) => setInnerMainHeight(h)}
                  extraContent={{
                    top: (
                      <div className={styles.addBtn} onClick={() => methods.handleAdd()}>
                        <PlusCircleOutlined className='mr-5 fs-16' />
                        新增一条
                      </div>
                    ),
                  }}
                >
                  <V2Table
                    rowKey='id'
                    defaultColumns={defaultColumns}
                    filters={filters}
                    onFetch={loadData}
                    hideColumnPlaceholder
                    pagination={false}
                    scroll={{ y: innerMainHeight - 120 }}
                  />
                </V2Container>

                {/* 新增弹框 */}
                <EditTask
                  visible={visible}
                  setVisible={setVisible}
                  tenantId={tenantId}
                  record={record}
                  onRefresh={onRefresh}
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </Spin>
      <div className={styles.submit}>
        <Button onClick={onRefreshAll} className='mr-12'>
          取消
        </Button>
        <Button type='primary' onClick={onSubmit}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default TaskType;
