import { FC, useEffect, useState } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';


const EditModal: FC<any> = ({
  editModal,
  setEditModal,
  onSuccess,
  setData,
  data
}) => {
  const { visible, id } = editModal;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);
  const addData = (value) => {
    setData([...data, {
      'id': Math.random(),
      'name': value.name,
      'content': value.content,
      'url': null,
      'permissions': [
        {
          'event': 'industryMap:updateBrand',
          'name': '编辑'
        },
        {
          'event': 'industryMap:deleteBrand',
          'name': '删除'
        },
        {
          'event': 'industryMap:importBrand',
          'name': '导入'
        },
        {
          'event': 'industryMap:exportBrand',
          'name': '导出'
        }
      ]
    }]);
  };
  const editData = (value) => {
    const arr: any = [];
    for (let i = 0; i < data.length; i++) {
      let cur = [];
      if (data[i].id === id) {
        cur = { ...data[i], ...value };
      } else {
        cur = data[i];
      }
      arr.push(cur);
    }
    setData(arr);
  };
  const methods = useMethods({
    handleOk: () => {
      form.validateFields().then((res) => {
        if (isLock) return;
        setIsLock(true);
        // 处理接口（编辑或新增）；
        const targetFetch = id ? editData : addData;
        if (id) {
          res.id = id;
        }
        targetFetch(res);
        setEditModal({ visible: false, id: '' });
        form.resetFields();
        onSuccess();
        setIsLock(false);

        // targetFetch({ ...res }).then(() => {
        //   setEditModal({ visible: false, id: '' });
        //   form.resetFields();
        //   onSuccess();
        // }).finally(() => {
        //   setIsLock(false);
        // });
      });
    }
  });
  const handleCancel = () => {
    form.resetFields();
    setEditModal({ visible: false, id: '' });
  };
  useEffect(() => {
    // 数据回显
    if (id) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          res = data[i];
        }
      }
      form.setFieldsValue(res);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Modal
      title={id ? '编辑客群信息' : '新增客群信息'}
      open={visible}
      width={640}
      onOk={methods.handleOk}
      onCancel={() => handleCancel()}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='客群名称'
              name='name'
              maxLength={8}
              required
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='客群简介'
              name='content'
              maxLength={20}
              required
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default EditModal;
