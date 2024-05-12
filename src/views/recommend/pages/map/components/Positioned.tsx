import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Row, Col, message as msg } from 'antd';
import styles from '../entry.module.less';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';

const Positioned: FC<any> = ({
  setSearchData,
  change
}) => {
  const [form] = Form.useForm();
  const pcdData = useSelector((state: any) => state.common.provinceCityDistrict);
  // useEffect(() => {

  // }, []);

  const blurHandle = () => {
    const val = form.getFieldsValue(['pcdIds']);
    const { pcdIds } = val;
    if (Array.isArray(pcdIds) && pcdIds.length === 1) {
      // 设置为空
      form.resetFields();
    }

    const provinceId = pcdIds[0];
    const targetProvince = pcdData.find((provinceItem) => provinceItem.id === provinceId);
    if (!targetProvince) return;
    const { children: cityData } = targetProvince;
    const cityId = pcdIds[1]; // 城市id
    const targetCity = cityData.find((cityItem) => cityItem.id === cityId);
    if (pcdIds.length === 2) {
      change({ name: targetCity?.name, level: 'city' });
      return;
    }
    const { children: districtData } = targetCity;
    const districtId = pcdIds[2]; // 区域id
    const targetDistrict = districtData.find((districtItem) => districtItem.id === districtId);

    change({ name: targetDistrict?.name, level: 'district' });
  };

  const confirmHandle = () => {
    const val = form.getFieldsValue(['pcdIds']);
    const { pcdIds } = val;
    if (!(Array.isArray(pcdIds) && pcdIds.length)) {
      msg.warning(`请选择省市/省市区`);
      return;
    }

    setSearchData({ // 显示表单浮窗
      pcdIds,
      visibleForm: true
    });
  };

  return (
    <Form
      form={form}
      className={styles.positionedCon}>
      <Row gutter={20}>
        <Col span={8}>
          <FormProvinceList
            name='pcdIds'
            placeholder='请选择省市/省市区'
            formItemConfig={{
              initialValue: [11, 87]
            }}
            config={{
              allowClear: false,
              changeOnSelect: true,
              // onDropdownVisibleChange: visibleChange
            }}
            onBlur={ () => blurHandle()}
            rules={[
              // { required: true, message: '请选择省市/省市区' },
            ]}/>
        </Col>
        <Col span={7}>
          <Button
            type='primary'
            onClick={() => confirmHandle()}>
              输入选址要求
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Positioned;
