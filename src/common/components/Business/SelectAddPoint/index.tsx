import styles from './index.module.less';
import { Form, message, Modal, Row, Col } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import AddPlaceModal from './AddPlaceModal';
import { postSpotCreate } from '@/common/api/place';
import V2Form from '../../Form/V2Form';
import V2FormRadio from '../../Form/V2FormRadio/V2FormRadio';
import V2FormInput from '../../Form/V2FormInput/V2FormInput';
import FormSelectPlaces from '../../FormBusiness/FormSelectPlaces';
import V2FormSelect from '../../Form/V2FormSelect/V2FormSelect';
import { get } from '@/common/request';

interface SelectAddPointProps {
  visible?: boolean;
  onClose: () => void;
  onOK: (closeable?: boolean) => void;
  zIndex?: number;
  data?: any[];
  channel: string;
  extraParams?: any; // 额外业务参数
}

const SelectAddPoint: FC<SelectAddPointProps> = ({ visible, onClose, zIndex, channel, extraParams, ...props }) => {
  const [form] = Form.useForm();
  const watchSpotCategoryId = Form.useWatch('spotCategoryId', form);
  const [spotCategoryName, setSpotCategoryName] = useState(''); // 类型枚举名称
  const [placeVisible, setPlaceVisible] = useState(false);
  const [floorOptions, setFloorOptions] = useState<any>([]); // 楼层选项

  const placeRef: any = useRef();

  // 勿动，后端写死的
  const categories = [
    { label: '展位', value: 62 },
    { label: '铺位', value: 102 },
    { label: '广告位', value: 11 },
  ];

  useEffect(() => {
    if (watchSpotCategoryId) {
      const spotCategory = categories?.find((item) => item.value === watchSpotCategoryId);
      if (spotCategory) {
        setSpotCategoryName(spotCategory.label);
      }
    }
  }, [watchSpotCategoryId]);

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      const params = {
        channel,
        ...values,
      };
      const result = await postSpotCreate(params);
      if (result) {
        message.success('新增成功');
        onClose?.();
        props.onOK?.(result || {});
      }
    });
  };

  const onAddClick = () => {
    setPlaceVisible(true);
  };

  const renderEmpty = (
    <div className={styles.placeNoData}>
      未找到匹配场地，<span className={styles.placeToAdd} onClick={onAddClick}>去新增</span>
    </div>
  );

  const onAddPlaceSuccess = (placeId) => {
    form.setFieldValue('placeId', placeId);
    setTimeout(() => {
      placeRef.current.reload();
    }, 300);
    setPlaceVisible(false);
  };

  const getFloorOptions = () => {
    get('/property/option/list', { identification: 'spotFloor' }, {
      proxyApi: '/res'
    }).then((res) => {
      setFloorOptions(res || []);
    });
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      getFloorOptions();
    }
  }, [visible]);

  return (
    <>
      <Modal
        title='新建点位'
        open={visible}
        onOk={onSubmit}
        // 两列弹窗要求640px
        width={640}
        onCancel={onClose}
        forceRender
      >
        <V2Form form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormRadio
                name='spotCategoryId'
                label='点位类型'
                required
                options={categories}
              />
            </Col>
            {!!watchSpotCategoryId && (
              <Col span={12}>
                <V2FormInput
                  label={`${spotCategoryName}名称`}
                  name='spotName'
                  required
                />
              </Col>
            )}
            {!!watchSpotCategoryId && (
              <Col span={12}>
                <FormSelectPlaces
                  label='所属场地'
                  name='placeId'
                  fuzzyRef={placeRef}
                  form={form}
                  rules={[{ required: true, message: '请输入场地名称' }]}
                  enableNotFoundNode
                  channel={channel}
                  notFoundNode={renderEmpty}
                  config={{
                    getPopupContainer: (node) => node.parentNode
                  }}
                  extraParams={extraParams}
                />
              </Col>
            )}
            { (watchSpotCategoryId === 62 || watchSpotCategoryId === 102) && (
              <Col span={12}>
                <V2FormSelect
                  name='spotFloor'
                  config={{
                    fieldNames: {
                      label: 'name',
                      value: 'id'
                    }
                  }}
                  required
                  placeholder={`请选择${spotCategoryName}楼层信息`}
                  label={`${spotCategoryName}楼层`}
                  options={floorOptions}
                />
              </Col>
            )}
          </Row>
        </V2Form>
      </Modal>
      <AddPlaceModal channel={channel} zIndex={zIndex ? zIndex + 1 : undefined} extraParams={extraParams} visible={placeVisible} onHidden={() => setPlaceVisible(false)} onSuccess={onAddPlaceSuccess}/>
    </>
  );
};

export default SelectAddPoint;
