/**
 * @Description 品牌详情 - 联系人
 */

import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import { refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { get, post } from '@/common/request';
import { Col, Form, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import FormSetName from '@/common/components/Form/FormSetName/FormSetName';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { MOBILE_REG } from '@lhb/regexp';

const Contact: FC<any> = ({
  id,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  const [permissions, setPermissions] = useState([]); // 是否有新增权限
  const [filters, setFilters] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const contactId = Form.useWatch('id', form);
  const [tableDynamicConf, setTableDynamicConf] = useState<any>({
    dataNumber: 0, // 这里的demo在底部时，应该让他的按钮悬浮在上面，而不是下面
    editActiveIndex: null, // 用来让编辑触发时，停用其他编辑按钮，直到此操作处理完毕
  });

  useEffect(() => {
    setFilters({ ...filters });
  }, [id]);

  const methods = useMethods({
    async loadData() {
      const result = await get('/brand/contact/list', { brandId: id }, { proxyApi: '/mdata-api' });
      setPermissions(result.meta.permissions.map((item: any) => {
        item.type = 'primary';
        return item;
      }));
      setTableDynamicConf({
        dataNumber: result.data.length,
        editActiveIndex: null,
      });
      // setHasAdd(result.meta.permissions.filter((item: any) => item.event === 'brandLibrary:create').length > 0);
      return {
        dataSource: result.data,
        count: result.data?.length || 0,
      };
    },
    handleUpdateContact(record) {
      form.setFieldsValue({ ...record });
      setVisible(true);
    },
    handleCreateContact() {
      setVisible(true);
    },
    handleDeleteContact(record) {
      Modal.confirm({
        content: '是否确认删除该联系人',
        onOk() {
          post('/brand/contact/delete', { id: record.id }, { proxyApi: '/mdata-api' }).then(() => {
            V2Message.success('删除成功');
            setFilters({ ...filters });
          });
        }
      });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        setLoading(true);
        // https://yapi.lanhanba.com/project/490/interface/api/62929
        post(values?.id ? '/brand/contact/update' : '/brand/contact/create', { ...values, brandId: id }, { proxyApi: '/mdata-api' }).then(() => {
          V2Message.success(values?.id ? '修改成功' : '添加成功');
          methods.onCancel();
          setFilters({ ...filters });
        }).finally(() => setLoading(false));
      });
    },

    onTableFormOk(records, key, value) {
      // https://yapi.lanhanba.com/project/490/interface/api/62929
      post('/brand/contact/update', { ...records, [key]: value, brandId: id }, { proxyApi: '/mdata-api' }).then(() => {
        V2Message.success('修改成功');
        setFilters({ ...filters });
      });
    },

    onCancel() {
      form.resetFields();
      setVisible(false);
    }
  });

  const columns: any[] = [
    { key: 'name', title: '姓名', dragChecked: true,
      noControlled: true,
      render(value, records, index, columnRenderDynamicConf) {
        const key = 'name';
        const formPath = ['table', index, key];
        const position = (columnRenderDynamicConf.dataNumber > 1 && columnRenderDynamicConf.dataNumber - 1 === index) || columnRenderDynamicConf.dataNumber === 1 ? 'rightTop' : 'rightBottom';
        return (
          <V2DetailItem
            allowEdit={!columnRenderDynamicConf.editActiveIndex || columnRenderDynamicConf.editActiveIndex === `${key}-${index}`}
            value={value}
            noStyle
            editConfig={{
              formCom: <V2FormInput rules={[{ required: true, message: '请输入姓名' }]} placeholder='请输入姓名' name={formPath} maxLength={20}/>,
              // 如果是超过1条数据，并且是最后一条数据，就让他的编辑按钮出现在上面，而不是下面
              position,
              onClick() { // 打开编辑就把别的编辑给他关掉
                tableForm.setFieldValue(formPath, value);
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: `${key}-${index}`,
                });
              },
              onCancel() { // 取消编辑，就重置回源数据。
                tableForm.setFieldValue(formPath, value);
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
              },
              onOK() {
                return new Promise((res) => {
                  const val = tableForm.getFieldValue(formPath);
                  if (val) {
                    // 把记录下的编辑active置空
                    setTableDynamicConf({
                      ...columnRenderDynamicConf,
                      editActiveIndex: null,
                    });
                    methods.onTableFormOk(records, key, val);
                    res(true);
                  }
                });
              }
            }}
          />
        );
      }
    },
    { key: 'telephone', title: '联系电话', dragChecked: true,
      noControlled: true,
      render(value, records, index, columnRenderDynamicConf) {
        const key = 'telephone';
        const formPath = ['table', index, key];
        const position = (columnRenderDynamicConf.dataNumber > 1 && columnRenderDynamicConf.dataNumber - 1 === index) || columnRenderDynamicConf.dataNumber === 1 ? 'rightTop' : 'rightBottom';
        return (
          <V2DetailItem
            allowEdit={!columnRenderDynamicConf.editActiveIndex || columnRenderDynamicConf.editActiveIndex === `${key}-${index}`}
            value={value}
            noStyle
            editConfig={{
              formCom: <V2FormInput rules={[{ required: true, message: '请输入联系电话' }, { pattern: MOBILE_REG, message: '请输入正确的手机号' }]} placeholder='请输入联系电话' name={formPath} maxLength={11}/>,
              // 如果是超过1条数据，并且是最后一条数据，就让他的编辑按钮出现在上面，而不是下面
              position,
              onClick() { // 打开编辑就把别的编辑给他关掉
                tableForm.setFieldValue(formPath, value);
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: `${key}-${index}`,
                });
              },
              onCancel() { // 取消编辑，就重置回源数据。
                tableForm.setFieldValue(formPath, value);
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
              },
              onOK() {
                return new Promise((res) => {
                  const val = tableForm.getFieldValue(formPath);
                  if (val) {
                    // 把记录下的编辑active置空
                    setTableDynamicConf({
                      ...columnRenderDynamicConf,
                      editActiveIndex: null,
                    });
                    methods.onTableFormOk(records, key, val);
                    res(true);
                  }
                });
              }
            }}
          />
        );
      }
    },
    { key: 'department', title: '部门', dragChecked: true,
      noControlled: true,
      render(value, records, index, columnRenderDynamicConf) {
        const key = 'department';
        const formPath = ['table', index, key];
        const position = (columnRenderDynamicConf.dataNumber > 1 && columnRenderDynamicConf.dataNumber - 1 === index) || columnRenderDynamicConf.dataNumber === 1 ? 'rightTop' : 'rightBottom';
        return (
          <V2DetailItem
            allowEdit={!columnRenderDynamicConf.editActiveIndex || columnRenderDynamicConf.editActiveIndex === `${key}-${index}`}
            value={value}
            noStyle
            editConfig={{
              formCom: <V2FormInput name={formPath} placeholder='请输入部门' maxLength={30}/>,
              // 如果是超过1条数据，并且是最后一条数据，就让他的编辑按钮出现在上面，而不是下面
              position,
              onClick() { // 打开编辑就把别的编辑给他关掉
                tableForm.setFieldValue(formPath, value);
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: `${key}-${index}`,
                });
              },
              onCancel() { // 取消编辑，就重置回源数据。
                tableForm.setFieldValue(formPath, value);
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
              },
              onOK() {
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
                // 发起请求对原有数据进行存储
                const val = tableForm.getFieldValue(formPath);
                methods.onTableFormOk(records, key, val);
              }
            }}
          />
        );
      }
    },
    { key: 'post', title: '职务', dragChecked: true,
      noControlled: true,
      render(value, records, index, columnRenderDynamicConf) {
        const key = 'post';
        const formPath = ['table', index, key];
        const position = (columnRenderDynamicConf.dataNumber > 1 && columnRenderDynamicConf.dataNumber - 1 === index) || columnRenderDynamicConf.dataNumber === 1 ? 'rightTop' : 'rightBottom';
        return (
          <V2DetailItem
            allowEdit={!columnRenderDynamicConf.editActiveIndex || columnRenderDynamicConf.editActiveIndex === `${key}-${index}`}
            value={value}
            noStyle
            editConfig={{
              formCom: <V2FormInput name={formPath} placeholder='请输入职务' maxLength={30}/>,
              // 如果是超过1条数据，并且是最后一条数据，就让他的编辑按钮出现在上面，而不是下面
              position,
              onClick() { // 打开编辑就把别的编辑给他关掉
                tableForm.setFieldValue(formPath, value);
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: `${key}-${index}`,
                });
              },
              onCancel() { // 取消编辑，就重置回源数据。
                tableForm.setFieldValue(formPath, value);
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
              },
              onOK() {
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
                // 发起请求对原有数据进行存储
                const val = tableForm.getFieldValue(formPath);
                methods.onTableFormOk(records, key, val);
              }
            }}
          />
        );
      }
    },
    { key: 'area', title: '负责区域', dragChecked: true,
      noControlled: true,
      render(value, records, index, columnRenderDynamicConf) {
        const key = 'area';
        const formPath = ['table', index, key];
        const position = (columnRenderDynamicConf.dataNumber > 1 && columnRenderDynamicConf.dataNumber - 1 === index) || columnRenderDynamicConf.dataNumber === 1 ? 'rightTop' : 'rightBottom';
        return (
          <V2DetailItem
            allowEdit={!columnRenderDynamicConf.editActiveIndex || columnRenderDynamicConf.editActiveIndex === `${key}-${index}`}
            value={value}
            noStyle
            editConfig={{
              formCom: <V2FormInput name={formPath} placeholder='请输入负责区域' maxLength={30}/>,
              // 如果是超过1条数据，并且是最后一条数据，就让他的编辑按钮出现在上面，而不是下面
              position,
              onClick() { // 打开编辑就把别的编辑给他关掉
                tableForm.setFieldValue(formPath, value);
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: `${key}-${index}`,
                });
              },
              onCancel() { // 取消编辑，就重置回源数据。
                tableForm.setFieldValue(formPath, value);
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
              },
              onOK() {
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
                // 发起请求对原有数据进行存储
                const val = tableForm.getFieldValue(formPath);
                methods.onTableFormOk(records, key, val);
              }
            }}
          />
        );
      }
    },
    { key: 'remark', title: '备注', dragChecked: true,
      noControlled: true,
      render(value, records, index, columnRenderDynamicConf) {
        const key = 'remark';
        const formPath = ['table', index, key];
        const position = (columnRenderDynamicConf.dataNumber > 1 && columnRenderDynamicConf.dataNumber - 1 === index) || columnRenderDynamicConf.dataNumber === 1 ? 'rightTop' : 'rightBottom';
        return (
          <V2DetailItem
            allowEdit={!columnRenderDynamicConf.editActiveIndex || columnRenderDynamicConf.editActiveIndex === `${key}-${index}`}
            value={value}
            noStyle
            editConfig={{
              formCom: <V2FormTextArea name={formPath} placeholder='请输入备注' maxLength={200} />,
              // 如果是超过1条数据，并且是最后一条数据，就让他的编辑按钮出现在上面，而不是下面
              position,
              onClick() { // 打开编辑就把别的编辑给他关掉
                tableForm.setFieldValue(formPath, value);
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: `${key}-${index}`,
                });
              },
              onCancel() { // 取消编辑，就重置回源数据。
                tableForm.setFieldValue(formPath, value);
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
              },
              onOK() {
                // 把记录下的编辑active置空
                setTableDynamicConf({
                  ...columnRenderDynamicConf,
                  editActiveIndex: null,
                });
                // 发起请求对原有数据进行存储
                const val = tableForm.getFieldValue(formPath);
                methods.onTableFormOk(records, key, val);
              }
            }}
          />
        );
      }
    },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: '120px',
      render: (val: any[], record: any) => (
        <V2Operate
          operateList={refactorPermissions(val)}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
      dragChecked: true
    }
  ];

  return (
    <div className={styles.tabBasic} style={{
      width: '100%',
      height: mainHeight || 'auto',
      ...style
    }}>
      <V2Title type='H2' text='联系人信息' divider extra={<V2Operate
        operateList={refactorPermissions(permissions)}
        onClick={(btn: any) => methods[btn.func]()}
      />}/>
      <V2Form form={tableForm}>
        <V2Table
          className={'mt-16'}
          rowKey='id'
          filters={filters}
          type='easy'
          hideColumnPlaceholder
          defaultColumns={columns}
          onFetch={methods.loadData}
          columnRenderDynamicConf={tableDynamicConf}
          pagination={false}
          pageSize={100}
          inv2form
        />
      </V2Form>
      <Modal
        title={`${contactId ? '编辑' : '新建'}联系人`}
        open={visible}
        onOk={methods.onOk}
        // 两列弹窗要求640px
        width={640}
        onCancel={methods.onCancel}
        confirmLoading={loading}
        forceRender
      >
        <V2Form form={form}>
          <FormSetName name='id' />
          <Row gutter={16}>
            <Col span={12}>
              <V2FormInput label='联系人姓名' name='name' required maxLength={20}/>
            </Col>
            <Col span={12}>
              <V2FormInput
                label='联系电话'
                name='telephone'
                rules={[{ required: true }, { pattern: MOBILE_REG, message: '请输入正确的手机号' }]}
                maxLength={11}
              />
            </Col>
            <Col span={12}>
              <V2FormInput label='部门' name='department' maxLength={30} />
            </Col>
            <Col span={12}>
              <V2FormInput label='职务' name='post' maxLength={30} />
            </Col>
            <Col span={12}>
              <V2FormInput label='负责区域' name='area' maxLength={30} />
            </Col>
            <Col span={24}>
              <V2FormTextArea label='备注' name='remark' maxLength={200} />
            </Col>
          </Row>
        </V2Form>
      </Modal>
    </div>
  );
};

export default Contact;
