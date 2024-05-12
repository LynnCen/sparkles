import { FC, useEffect, useState } from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { IndustryModalProps } from '../../ts-config';

const IndustryModal: FC<IndustryModalProps> = ({
  onSearch,
  industryModalInfo,
  modalVisible,
  setModalVisible,
  treeData,
}) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState();

  const { parseTitle, onOk, onCancel } = useMethods({
    onCancel() {
      setModalVisible(false);
    },
    onOk() {
      form.validateFields().then((values: any) => {
        if (selected) {
          console.log(123, selected);
        }
        const params = {
          ...values,
          ...(industryModalInfo.id && { id: industryModalInfo.id }),
          ...(industryModalInfo.parentId && { parentId: industryModalInfo.parentId }),
        };
        const url = industryModalInfo.id ? '/resource/industry/update' : '/resource/industry/create';
        post(url, params, true).then(() => {
          message.success(`${industryModalInfo.id ? '修改' : '新建'}行业成功`);
          onSearch();
          onCancel();
        });
      });
    },
    parseTitle() {
      return industryModalInfo.id ? '编辑行业' : '新增行业';
    },
  });

  useEffect(() => {
    if (!modalVisible) {
      return;
    }
    if (industryModalInfo.id) {
      form.setFieldsValue(industryModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [modalVisible]);

  return (
    <Modal
      title={parseTitle()}
      width={640}
      open={modalVisible}
      onOk={onOk}
      onCancel={onCancel}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormTreeSelect
              label='父行业'
              name='parentId'
              treeData={treeData}
              config={{
                fieldNames: { label: 'name', value: 'id', children: 'nothing' },
              }}
              onChange={(v, l, e) => {
                setSelected(e);
              }}
            />
            <V2FormInput
              label='行业别名'
              maxLength={15}
              name='anotherName'
              placeholder='请填写前端显示的行业名称'
              rules={[{ required: true, message: '请填写前端显示的行业名称' }]}
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='名称'
              name='name'
              maxLength={15}
              placeholder='请输入行业名称'
              rules={[{ required: true, message: '请输入行业名称' }]}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default IndustryModal;
