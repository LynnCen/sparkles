import React, { useEffect, useMemo } from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { CategoryModalProps, ResourceType } from '../../ts-config';

const standardOptions = [
  { label: '标类', value: 0 },
  { label: '非标类', value: 1 },
];

const CategoryModal: React.FC<CategoryModalProps> = ({ categoryModalInfo, setCategoryModalInfo, onSearch }) => {
  const [form] = Form.useForm();
  const show: any = useMemo(() => {
    return ResourceType.PLACE === categoryModalInfo.resourceType ? '' : 'none';
  }, [categoryModalInfo]);
  const { parseTitle, onCancel, onOk } = useMethods({
    parseTitle() {
      const prefix = categoryModalInfo.id ? '编辑' : '新增';
      const suffix = ResourceType.PLACE === categoryModalInfo.resourceType ? '场地类目' : '点位类目';
      return prefix + suffix;
    },
    onCancel() {
      setCategoryModalInfo({ ...categoryModalInfo, visible: false });
    },

    onOk() {
      if (ResourceType.SPOT === categoryModalInfo.resourceType) {
        form.setFieldsValue({ categoryType: 0 });
      }
      form.validateFields().then((values: any) => {
        const params = {
          ...values,
          ...(categoryModalInfo.id && { id: categoryModalInfo.id }),
          ...(categoryModalInfo.parentId && { parentId: categoryModalInfo.parentId }),
          resourcesType: categoryModalInfo.resourceType,
        };
        const url = categoryModalInfo.id ? '/category/update' : '/category/create';
        post(url, params, true).then(() => {
          message.success(`${categoryModalInfo.id ? '修改' : '新建'}类目成功`);
          onSearch();
          onCancel();
        });
      });
    },
  });
  const disabled = useMemo(() => {
    if (categoryModalInfo.id === undefined && categoryModalInfo.parentId === undefined) {
      return false;
    }
    if (categoryModalInfo.parentId === undefined || categoryModalInfo.parentId === null) {
      if (categoryModalInfo.childList && categoryModalInfo.childList.length) {
        return true;
      }
      return false;
    }
    return true;
  }, [categoryModalInfo]);

  useEffect(() => {
    if (categoryModalInfo.visible && categoryModalInfo.id) {
      form.setFieldsValue(categoryModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [categoryModalInfo.visible]);

  return (
    <Modal width={640} title={parseTitle()} open={categoryModalInfo.visible} onOk={onOk} onCancel={onCancel} forceRender>
      <V2Form
        form={form}
        initialValues={{
          ...(categoryModalInfo.categoryType !== undefined && { categoryType: categoryModalInfo.categoryType }),
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='类目名称' name='name' required/>
            <V2FormSelect
              label='是否标类场地'
              name='categoryType'
              options={standardOptions}
              formItemConfig={{
                style: { display: show },
              }}
              config={{
                disabled: disabled,
              }}
              rules={[{ required: true, message: '必须选择一项' }]}
            />
          </Col>
          <Col span={12}>
            <V2FormInput label='类目标识' name='identification' required/>
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default CategoryModal;
