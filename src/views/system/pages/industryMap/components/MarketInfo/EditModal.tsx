import { Col, Form, Modal, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { addIndustryArea, getTemplate, industryAreaDetail, updateIndustryArea } from '@/common/api/system';
import { useMethods } from '@lhb/hook';


const EditModal :FC<any> = ({
  editModal,
  setEditModal,
  onSuccess
}) => {
  const { visible, id } = editModal;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const methods = useMethods({
    handleOk: () => {
      form.validateFields().then((res) => {
        if (isLock) return;
        setIsLock(true);
        // 处理接口（编辑或新增）；
        const targetFetch = id ? updateIndustryArea : addIndustryArea;
        if (id) {
          res.id = id;
        }
        targetFetch({ ...res }).then(() => {
          setEditModal({ visible: false, id: '' });
          form.resetFields();
          onSuccess(!!id);
        }).finally(() => {
          setIsLock(false);
        });
      });
    }
  });
  const handleCancel = () => {
    form.resetFields();
    setEditModal({ visible: false, id: '' });
  };
  const change = (val) => {
    const arr = options.filter((item) => item.id === val);
    form.setFieldValue('templateRemark', arr[0].remark);
  };

  useEffect(() => {
    getTemplate({ page: 1, size: 20 }).then((val) => {
      const res = val.objectList.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
      setOptions(res);
    });
  }, []);
  useEffect(() => {
    // 数据回显
    if (id) {
      industryAreaDetail({ id }).then((res) => {
        form.setFieldsValue(res);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Modal
      title={ id ? '编辑商圈' : '新增商圈' }
      open={visible}
      onOk={methods.handleOk}
      width={640}
      onCancel={() => handleCancel()}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='商圈名称' name='name' maxLength={8} required />
            <V2FormInput label='商圈简介' name='content' maxLength={20} required />
          </Col>
          <Col span={12}>
            <V2FormSelect label='对应模版' name='templateId' options={options} required onChange={change} />
            <V2FormInput label='模版说明' name='templateRemark' maxLength={999} config={{ readOnly: true }} />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default EditModal;
