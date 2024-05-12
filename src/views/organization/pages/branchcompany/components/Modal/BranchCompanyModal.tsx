/* 新增/编辑分公司弹框 */
import React, { useEffect } from 'react';
import { Cascader, Form, Modal, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import { companyCreate, companyUpdate } from '@/common/api/company';
import V2Transfer from '@/common/components/Form/V2Transfer';
import { recursionEach, isUndef } from '@lhb/func';

const BranchCompanyModal: React.FC<any> = ({ visible, setVisible, departments, onSearch, record }) => {
  const [form] = Form.useForm();
  const onCancel = () => {
    setVisible(false);
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      if (isUndef(values.departments) || values.departments.length === 0) {
        message.warn('请选择部门');
        return;
      }

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

  const setRightCustomLabel = (departments: any, parentRightCustomLabel?: string) => {
    if (Array.isArray(departments)) {
      departments.forEach((department) => {
        department.rightCustomLabel = parentRightCustomLabel
          ? parentRightCustomLabel + '/' + department.name
          : department.name;
        if (department.children) {
          setRightCustomLabel(department.children, department.rightCustomLabel);
        }
      });
    }
  };

  useEffect(() => {
    if (Array.isArray(departments)) {
      recursionEach(departments, 'children', (item) => {
        item.label = item.name;
        item.value = item.id;
      });
      setRightCustomLabel(departments);
    }

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
    <Modal title='新建公司' open={visible} width={648} onOk={onSubmit} onCancel={onCancel} destroyOnClose>
      <V2Form form={form}>
        <V2FormInput
          label='公司名称'
          name='name'
          required
          maxLength={10}
          config={{
            style: {
              width: '288px',
            },
          }}
        />
        <Form.Item label='对应部门' name='departments' required>
          <V2Transfer
            defaultCheckKeys={record?.departments}
            treeData={departments}
            rightUseCustomLabel
            checkStrictly
            needFullKeys
            noDrag
            treeConfig={{
              fieldNames: {
                key: 'value',
              },
              defaultExpandAll: true,
            }}
            customTitle={{
              left() {
                return <span>所有部门</span>;
              },
              right(num) {
                return (
                  <span>
                    选择部门<span className='fn-12 color-primary-2 mr-8'>(至少选择1个)</span> 已选{num || '-'}人
                  </span>
                );
              },
            }}
            // onChange={methods.onChange}
          ></V2Transfer>
        </Form.Item>
        <V2FormProvinceList
          label='管辖范围'
          name='areas'
          type={2}
          multiple
          required
          config={{
            style: {
              width: '288px',
            },
            showCheckedStrategy: Cascader.SHOW_PARENT,
          }}
        />
      </V2Form>
    </Modal>
  );
};

export default BranchCompanyModal;
