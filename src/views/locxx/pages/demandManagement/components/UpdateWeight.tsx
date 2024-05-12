import { FC, useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Form, message } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import { postRequirementUpdateWeight } from '@/common/api/demand-management';
import { replaceEmpty, isUndef } from '@lhb/func';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import dayjs from 'dayjs';
import FormTenant from '@/common/components/FormBusiness/FormTenant';

const layout = {
  labelCol: { span: 6 }, // label 宽度
  wrapperCol: { span: 18 }, // 内容宽度
};

// 需求管理调权弹窗
const UpdateWeight: FC<{onRefresh: Function; ref?: any}> = forwardRef(({
  onRefresh, // 刷新列表
}, ref) => {
  const [formData] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [id, setId] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const methods = useMethods({
    init(item) {
      formData.setFieldValue('tenantIds', item?.tenantIds || []);
      formData.setFieldValue('effectiveTime', [item?.startEffectTime ? dayjs(item?.startEffectTime) : null, item?.endEffectTime ? dayjs(item?.endEffectTime) : null]);
      setTitle(item?.name || '');
      setId(item?.id || null);
      setVisible(true);
    },
    submit() {
      formData.validateFields().then(() => {
        const tempObj = formData.getFieldsValue();
        const params = {
          startEffectTime: isUndef(tempObj?.effectiveTime[0]) ? null : dayjs(tempObj?.effectiveTime[0]).format('YYYY-MM-DD HH:MM:ss'),
          endEffectTime: isUndef(tempObj?.effectiveTime[1]) ? null : dayjs(tempObj?.effectiveTime[1]).format('YYYY-MM-DD HH:MM:ss'),
          tenantIds: tempObj?.tenantIds || [],
          locxxRequirementId: id
        };
        setRequesting(true);
        postRequirementUpdateWeight(params).then(() => {
          message.success('权重调整成功');
          setVisible(false);
          onRefresh();
        }).finally(() => {
          setRequesting(false);
        });
      }).catch(() => {
        message.warning('请完善信息');
      });
    }
  });

  return (
    <Modal
      title={replaceEmpty(title)}
      width='428px'
      open={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      onOk={methods.submit}
      confirmLoading={requesting}
    >
      <p className='mb-16'>调整当前需求权重，在所选生效时间内，商机列表置顶显示</p>
      <V2Form form={formData} layout='horizontal' {...layout} >
        <FormTenant
          label='租户'
          name='tenantIds'
          allowClear={true}
          placeholder='请搜索并选择租户'
          enableNotFoundNode={false}
          rules={[{ required: true, message: '请搜索并选择租户' }]}
          config={{
            mode: 'multiple',
            getPopupContainer: (node) => node.parentNode,
          }}
        />
        <V2FormRangePicker
          name='effectiveTime'
          label='生效时间'
          rules={[{ required: true, message: '请选择生效时间段' }]}
          config={{
            disabledDate: current => {
              return current && current < dayjs().startOf('day');
            },
          }}
        />
      </V2Form>
    </Modal>
  );
});

export default UpdateWeight;
