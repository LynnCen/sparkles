import FormSelect from '@/common/components/Form/FormSelect';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';
import { FloorDescModalProps } from '../../ts-config';
import FormUpload from '@/common/components/Form/FormUpload';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

// B5、LG5、B4、LG4、B3、LG3、B2、LG2、B1、LG1、LG、M、MU、G、GF、RG、UG、1F~50F
const floorOptions = [
  { label: 'B5', value: 'B5' },
  { label: 'LG5', value: 'LG5' },
  { label: 'B4', value: 'B4' },
  { label: 'LG4', value: 'LG4' },
  { label: 'B3', value: 'B3' },
  { label: 'LG3', value: 'LG3' },
  { label: 'B2', value: 'B2' },
  { label: 'LG2', value: 'LG2' },
  { label: 'B1', value: 'B1' },
  { label: 'LG1', value: 'LG1' },
  { label: 'LG', value: 'LG' },
  { label: 'M', value: 'M' },
  { label: 'MU', value: 'MU' },
  { label: 'G', value: 'G' },
  { label: 'GF', value: 'GF' },
  { label: 'RG', value: 'RG' },
  { label: 'UG', value: 'UG' },
];

for (let i = 0; i < 51; i++) {
  const floor = i + 'F';
  floorOptions.push({ label: floor, value: floor });
}

const FloorDescModal: React.FC<FloorDescModalProps> = ({
  floorDescModalInfo,
  setFloorDescModalInfo,
  data,
  onChange,
}) => {
  const [form] = Form.useForm();
  const { parseTitle, onCancel } = useMethods({
    parseTitle() {
      return floorDescModalInfo.id ? '编辑楼层信息' : '新增楼层信息';
    },
    onCancel() {
      setFloorDescModalInfo({ visible: false });
      form.resetFields();
    },
  });
  // 确定
  const onSubmit = () => {
    form.validateFields().then((values) => {
      if (floorDescModalInfo.id) {
        data.forEach((element) => {
          if (element.id === floorDescModalInfo.id) {
            element.floor = values.floor;
            element.picture = values.picture.map(itm => {
              return {
                uid: itm.uid,
                name: itm.name,
                url: itm.url,
                type: itm.type
              };
            });
          }
        });
        onChange(data);
        onCancel();
      } else {
        const element: any = {};
        element.id = Math.random();
        element.floor = values.floor;
        element.picture = values.picture.map(itm => {
          return {
            uid: itm.uid,
            name: itm.name,
            url: itm.url,
            type: itm.type
          };
        });
        data.push(element);
        onChange([].concat(data));
        onCancel();
      }
    });
  };

  useEffect(() => {
    if (floorDescModalInfo.id) {
      form.setFieldsValue(floorDescModalInfo);
    }
    // eslint-disable-next-line
  }, [floorDescModalInfo]);

  return (
    <Modal title={parseTitle()} open={floorDescModalInfo.visible} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <FormSelect
          label='楼层'
          name='floor'
          options={floorOptions}
          rules={[{ required: true, message: '请选择楼层' }]}
        />
        <FormUpload
          label='楼层平面图'
          name='picture'
          config={{
            maxCount: 12,
            size: 4,
            isPreviewImage: true,
            fileType: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
          }}
          rules={[{ required: true, message: '请上传文件' }]}
          formItemConfig={{
            help: '只能上传 .png/.jpg/.jpeg/.bmp/.gif，最多12个文件，最多12M',
          }}
        />
      </Form>
    </Modal>
  );
};
export default FloorDescModal;
