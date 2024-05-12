/**
 * @Description 规划版本弹窗
 */

import { FC } from 'react';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';


const AddPlanModal: FC<any> = ({
  visible,
  setVisible
}) => {
  const [form] = Form.useForm();

  const methods = useMethods({
    onOk() { // 新建版本
      form.validateFields().then((values: any) => {
        console.log('values', values);
      });
    },
    onCancel() {
      setVisible(false);
    }
  });


  return (
    <>
      <Modal
        title='规划版本'
        open={visible}
        onOk={methods.onOk}
        // 两列弹窗要求336px
        width={336}
        onCancel={methods.onCancel}
        forceRender
        okText='创建'
      >
        <V2Form form={form}>
          <V2FormInput
            label='规划名称'
            name='one'
            required
            maxLength={32}
          />
          <V2FormSelect
            label='选择模型'
            name='one1'
            options={[]}
            required
            config={{ showSearch: true }} />
        </V2Form>
      </Modal>
    </>
  );
};

export default AddPlanModal;
