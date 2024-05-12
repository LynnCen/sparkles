/* 新增拓店任务弹框 */
import React, { useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import { companyCreate, companyUpdate } from '@/common/api/company';

const BranchCompanyModal: React.FC<any> = ({ visible, setVisible, departments, onSearch, record }) => {
  const [form] = Form.useForm();

  const onCancel = () => {
    setVisible(false);
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      if (record.id) {
        companyUpdate({ id: record.id, ...values }).then(() => {
          message.success('编辑成功');
          onSearch();
          setVisible(false);
        });
      } else {
        companyCreate(values).then(() => {
          message.success('添加成功');
          onSearch();
          setVisible(false);
        });
      }
    });
  };

  useEffect(() => {
    if (visible && record.id) {
      record.name && form.setFieldValue('name', record.name);
      record.departments && form.setFieldValue('departments', record.departments);
      record.areas && form.setFieldValue('areas', record.areas);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal title='新建公司' open={visible} width={400} onOk={onSubmit} onCancel={onCancel} destroyOnClose>
      <V2Form form={form}>
        <V2FormInput label='公司名称' name='name' required maxLength={50} />
        <V2FormTreeSelect
          label='对应部门'
          name='departments'
          treeData={departments}
          config={{
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            multiple: true,
            showSearch: true,
            treeNodeFilterProp: 'name',
            treeDefaultExpandAll: true,
          }}
        />
        <V2FormProvinceList label='管辖范围' name='areas' type={2} multiple />
      </V2Form>
    </Modal>
  );
};

export default BranchCompanyModal;
