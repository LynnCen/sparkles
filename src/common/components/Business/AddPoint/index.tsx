import { FormInModal } from '@/common/components';
import FormInput from '@/common/components/Form/FormInput';
import { useVisible } from '@/common/hook';
import styles from './index.module.less';
import { Form, Alert, message } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import AddPlaceModal from './AddPlaceModal';
import CategorySelect from '@/common/business/CategorySelect';
import FormPlaces from '../../FormBusiness/FormPlaces';
import { postSpotCreate } from '@/common/api/place';
import { floorKeep, isUndef } from '@lhb/func';
import V2FormMultipleInput from 'src/common/components/Form/V2FormMultipleInput/V2FormMultipleInput';

const { Item, useForm } = Form;

interface AddPointProps {
  visible?: boolean;
  onClose?: () => void;
  onOK?: (closeable?: boolean) => void;
  zIndex?: number;
  data?: any[];
  channel?: string;
}

// 新增点位弹窗
const AddPoint: FC<AddPointProps> = ({ visible, onClose, zIndex, channel, ...props }) => {
  const [value, setValue] = useState<string>('');
  const { visible: addPlaceModalVisible, onHidden: onAddPlaceHidden, onShow: onAddPlaceShow } = useVisible(false);
  const [form] = useForm();
  const placeRef: any = useRef();

  const onSelectChange = (value: string) => {
    setValue(value);
  };

  const onSubmit = (success: boolean) => {
    if (success) {
      if (!channel) {
        message.warning('请根据对应模块填写channel');
        return;
      }
      form.validateFields().then(async (res) => {
        const params = {
          channel,
          placeId: res.tenantPlaceId,
          spotLength: res.spotLength, // 点位长度
          spotWidth: res.spotWidth, // 点位宽度
          heightLimit: res.heightLimit, // 点位高度
          spotArea: floorKeep(res.spotLength, res.spotWidth, 3),
          spotCategoryId: res.spotCategoryId,
          spotFloor: res.spotFloor,
          spotName: res.spotName,
        };
        const result = await postSpotCreate(params);
        if (result) {
          message.success('新增成功');
          onClose?.();
          props.onOK?.(result);
        }
      });
    }
  };

  const onAddClick = () => {
    onAddPlaceShow();
  };

  const renderEmpty = (
    <div className={styles.placeNoData}>
      未找到匹配点位，<span className={styles.placeToAdd} onClick={onAddClick}>去新增</span>
    </div>
  );

  const onAddPlaceSuccess = () => {
    // 这里注释掉是因为场地新增后还需要审核才能出现在列表，无法直接回填
    // placeRef.current.reload();
    // form.setFieldValue('tenantPlaceId', placeId);
    // setValue(placeId);
    onAddPlaceHidden();
  };

  useEffect(() => {
    if (visible) {
      setValue(undefined as any);
      form.resetFields();
    }
  }, [visible]);

  return (
    <>
      <FormInModal
        title='新增点位'
        onCancelSubmit={onClose}
        onSubmit={onSubmit}
        form={form}
        zIndex={zIndex}
        visible={visible}>
        <Form labelCol={{ span: 4 }}>
          <Item>
            <Alert message='请先选择场地再新增点位，若无场地请新增场地!' type='warning' showIcon />
          </Item>
          <FormPlaces
            label='场地名称'
            name='tenantPlaceId'
            fuzzyRef={placeRef}
            form={form}
            rules={[{ required: true, message: '请输入场地名称' }]}
            changeHandle={(_, option) => {
              onSelectChange(option);
            }}
            enableNotFoundNode
            notFoundNode={renderEmpty}
            config={{
              getPopupContainer: (node) => node.parentNode
            }}
          />
          {value && <>
            <FormInput name='spotName' maxLength={30} placeholder='请输入点位名称' rules={[{ required: true, message: '点位名称必填' }]} label='点位名称'/>
            <Item name='spotCategoryId' rules={[{ required: true, message: '点位类型必选' }]} label='点位类型'>
              <CategorySelect multiple={false} resoureType={1}/>
            </Item>
            <FormInput name='spotFloor' placeholder='请输入点位楼层信息' label='点位楼层' rules={[{ required: true, message: '点位楼层必填' }]}/>
            <V2FormMultipleInput
              label='长*宽*高'
              name={['spotLength', 'spotWidth', 'heightLimit']}
              type='number'
              required
              extra='m'
              placeholder={['长', '宽', '高']}
              rules={[{
                validator() {
                  const length = form.getFieldValue('spotLength');
                  const width = form.getFieldValue('spotWidth');
                  const height = form.getFieldValue('heightLimit');
                  if (isUndef(length) || isUndef(width) || isUndef(height)) {
                    return Promise.reject(new Error('长、宽、高都必填'));
                  }
                  return Promise.resolve();
                }
              }]}
            />
          </>}
        </Form>
      </FormInModal>
      <AddPlaceModal channel={channel} zIndex={zIndex ? zIndex + 1 : undefined} visible={addPlaceModalVisible} onHidden={onAddPlaceHidden} onSuccess={onAddPlaceSuccess}/>
    </>
  );
};

export default AddPoint;
