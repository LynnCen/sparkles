import { FC, useEffect, useState } from 'react';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Button, Col, Form, Row, message } from 'antd';
import CircleMap from './CircleMap';
import PolygonMap from './PolygonMap';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';

const levelOptions = [
  { value: 0, label: '主要商圈' },
  { value: 1, label: '次要商圈' },
  { value: 2, label: '其他商圈' },
];
const shapeOptions = [
  { value: 0, label: '圆形' },
  { value: 1, label: '自定义形状' },
];

const DetailForm: FC<any> = ({ circleInfo, setCircleInfo, onSearch }) => {
  /* data */
  const [form] = Form.useForm();
  const [deleteBtnDisplay, setDeleteBtnDisplay] = useState<string>('none');
  const [saveBtnDisplay, setSaveBtnDisplay] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(true);


  /* methods */
  const { onOk, onDelete, setCenterValue } = useMethods({
    // onCancel() {
    //   form.resetFields();
    // },
    onOk() {
      form.validateFields().then((values: any) => {
        if (values.circle === undefined && values.polygon === undefined) {
          message.warn('请选择商圈定位');
          return;
        }
        const params = {
          ...(circleInfo.id && { id: circleInfo.id }),
          name: values.name,
          provinceId: values.cityId[0],
          cityId: values.cityId[1],
          districtId: values.cityId[2],
          address: values.address,
          level: values.level,
          shape: values.shape,
          explain: values.explain,
          ...(values.shape === 0
            ? {
              radius: values.radius || 300,
              coordinateList: [{ longitude: values.circle.longitude, latitude: values.circle.latitude }],
            }
            : {
              coordinateList: values.polygon.path,
            }),
        };
        const url = circleInfo.id ? '/businessCircle/update' : '/businessCircle/create';
        post(url, params, true).then(() => {
          message.success(`${circleInfo.id ? '修改' : '新建'}商圈成功`);
          onSearch();
          // onCancel();
        });
      });
    },
    onDelete() {
      ConfirmModal({
        onSure: () => {
          post('/businessCircle/delete', { id: circleInfo.id }, true).then(() => {
            onSearch();
            setCircleInfo({});
          });
        },
      });
    },

    setCenterValue(val) {
      console.log(val);
      form.setFields([{ name: 'address', value: val }]);
    },
  });

  useEffect(() => {
    // 编辑
    if (circleInfo.id) {
      console.log('circleInfo', circleInfo);
      form.setFieldsValue(circleInfo);
      setDeleteBtnDisplay('none');
      setSaveBtnDisplay('none');
      // 权限控制
      if (circleInfo?.permissions) {
        circleInfo?.permissions.forEach((val) => {
          if (val.event.includes('update')) {
            setSaveBtnDisplay('');
          }
          if (val.event.includes('delete')) {
            setDeleteBtnDisplay('');
          }
        });
      }
      setSaveBtnDisplay('');
      setVisible(circleInfo.shape === 0);
    } else {
      // 新增
      form.resetFields();
      setDeleteBtnDisplay('none'); // 隐藏删除按钮
      setVisible(true);
    }
    // eslint-disable-next-line
  }, [circleInfo.random]);

  return (
    <V2Form form={form}>
      <Row gutter={16}>
        <Col span={12}>
          <V2FormInput label='商圈名称' name='name' required/>
          <V2FormInput label='商圈中心地址' name='address' required/>
          <V2FormTextArea label='商圈说明' name='explain' required/>
        </Col>
        <Col span={12}>
          <V2FormProvinceList
            label='省市区'
            name='cityId'
            placeholder='选择所属城市'
            rules={[{ required: true, message: '请选择所属城市' }]}
          />
          <V2FormRadio name='level' label='商圈级别' formItemConfig={{ initialValue: 0 }} required options={levelOptions}/>
          <V2FormRadio
            name='shape'
            label='商圈形状'
            formItemConfig={{ initialValue: 0 }}
            required
            options={shapeOptions}
            onChange={() => setVisible(!visible)}
          />
        </Col>
        {visible && <Col span={12}>
          <V2FormInputNumber label='商圈半径' name='radius' min={0} config={{ addonAfter: 'm' }} />
        </Col>}
        <Form.Item name='circle' wrapperCol={{ offset: 4 }} noStyle>
          <CircleMap form={form} display={visible ? '' : 'none' } setCenterVal={setCenterValue} />
        </Form.Item>
        <Col span={24}>
          <Form.Item name='polygon' wrapperCol={{ offset: 4 }} noStyle>
            <PolygonMap display={visible ? 'none' : ''}setCenterVal={setCenterValue} />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: 'center' }}>
        <Button type='primary' style={{ display: saveBtnDisplay }} onClick={onOk}>
          保存
        </Button>
        <Button type='primary' danger onClick={onDelete} style={{ marginLeft: 10, display: deleteBtnDisplay }}>
          删除
        </Button>
      </div>
    </V2Form>
  );
};
export default DetailForm;
