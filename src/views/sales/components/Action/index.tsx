/* auth: zgl */
/* TODO: 这是个错误的组件示范，我只是搬运工 */
/* 功能耦合，并且每一列都有自己的4个modal，简直让性能荡然无存 */
/* 目前只有迭代需求做到改价，所以仅把改价抽离了，在未来是需要重构的 */
import { FC, useEffect, useRef, useState } from 'react';
import { Form, message } from 'antd';
import { FormInModal } from '@/common/components';
import FormMultipleDatePicker from '@/common/components/Form/FormMultipleDatePicker/FormMultipleDatePicker';
import FormRadio from '@/common/components/Form/FormRadio';
import FormSelect from '@/common/components/Form/FormSelect';
import FormTextArea from '@/common/components/Form/FormTextArea';
import Operate from '@/common/components/Operate';
import ChangePrice from './ChangePrice';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useVisible } from '@/views/application/pages/menu-managent/hooks';
import { getOrderReasons, pass } from '@/common/api/sales';
import dayjs from 'dayjs';
import AssignModal from '@/views/sales/pages/add/components/AssignModal';
import { refactorPermissions } from '@lhb/func';

const { useForm, useWatch } = Form;

interface ActionProps {
  orderStateId?: string;
  id?: number;
  cb?: Function;
  btns?: any[];
  info?: any;
  onUpdate?: Function, // 编辑事件
}

const Action: FC<ActionProps> = ({ cb, btns, id, info = {}, onUpdate }) => {
  const operateList = refactorPermissions(btns || []);
  const [rejects, setRejects] = useState<any[]>([]);
  const reasonsMap = useRef<any>(new Map());
  const [reasons, setReasons] = useState<any[]>([]);
  const { visible, onHidden: onHidden, onShow: onShow } = useVisible(false);
  const { visible: priceVisible, onHidden: onPriceHidden, onShow: onPriceShow } = useVisible(false);
  const { visible: dateVisible, onHidden: onDateHidden, onShow: onDateShow } = useVisible(false);
  const { visible: markVisible, onHidden: onMarkHidden, onShow: onMarkShow } = useVisible(false);
  const [assignModalData, setAssignModalData] = useState<any>({
    visible: false,
    fromList: true,
    orderItems: [],
  });

  const [isReject, setIsReject] = useState<boolean>(false);
  const url = isReject ? '/order/saleOrder/deny' : '/order/saleOrder/cancel';
  const markUrl = '/order/saleOrder/remark';
  const label = isReject ? '拒绝原因' : '取消原因';
  const title = isReject ? '审核拒绝' : '取消';

  const [form] = useForm();
  const [markForm] = useForm();
  const [dateForm] = useForm();
  const duty = useWatch('duty', form);
  // 获取原因所有数据
  const getReasons = async () => {
    const result = await getOrderReasons();
    if (result) {
      const options = result.map(data => {
        const { name, id, items = [] } = data;
        const newItems = items.map(item => ({ label: item.name, value: item.id }));
        reasonsMap.current.set(id, newItems);
        return {
          label: name,
          value: id,
        };
      });
      form.setFieldsValue({ duty: options[0]?.value });
      setRejects(options);
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    getReasons();
  }, [visible]);

  useEffect(() => {
    const reasons = reasonsMap.current.get(duty);
    setReasons(reasons);
    form.setFieldsValue({ reason: undefined });
  }, [duty]);

  const onAction = (key: string) => {
    switch (key) {
      case 'pass': onPass();
        break;
      case 'deny': onDeny();
        break;
      case 'changePrice': onChangePrice();
        break;
      case 'changeDate': onChangeDate();
        break;
      case 'cancel': onCancel();
        break;
      case 'detail': onDetail();
        break;
      case 'generatePurchaseTask': onAssign();
        break;
      case 'update': onUpdate && onUpdate();
        break;
      default: onRemark();
        break;
    }
  };

  // 通过
  const onPass = () => {
    ConfirmModal({
      title: '通过',
      content: '确定审核通过?',
      onSure: () => {
        pass(id as any).then(() => {
          cb?.();
        });
      }
    });
  };

  // 拒绝
  const onDeny = () => {
    setIsReject(true);
    onShow();
  };

  // 改价
  const onChangePrice = () => {
    onPriceShow();
  };

  // 改期
  const onChangeDate = () => {
    // todo
    onDateShow();
  };

  // 取消
  const onCancel = () => {
    setIsReject(false);
    onShow();

  };

  // 备注
  const onRemark = () => {
    onMarkShow();

  };

  // 提交
  const onSubmit = (success: boolean) => {
    if (success) {
      cb?.();
      onMarkHidden();
      onHidden();
      onDateHidden();
      message.success('操作成功');
    }
  };

  // 详情
  const onDetail = () => {
    dispatchNavigate(`/sales/detail?id=${id}`);
  };

  // 指派采购人
  const onAssign = () => {
    const { id, number, placeId, placeName, spotId, spotName, title } = info;
    const orderItems = [{
      id, number, placeId, placeName, spotId, spotName, title
    }];
    setAssignModalData({
      visible: true,
      fromList: true,
      orderItems,
    });
  };

  useEffect(() => {
    const { dates = [], mark } = info;
    if (dateVisible) {
      dateForm.setFieldsValue({
        dates: dates.map(item => dayjs(item).valueOf()),
        mark
      });
    }
  }, [dateVisible, info]);

  useEffect(() => {
    const { mark } = info || {};
    if (markVisible) {
      markForm.setFieldsValue({ mark });
    }
  }, [markVisible, info]);


  return (
    <>
      <Operate operateList={operateList} onClick={({ event }) => onAction(event)}/>
      <FormInModal title={title} visible={visible}
        onCancelSubmit={onHidden}
        onSubmit={onSubmit}
        url={url}
        form={form}
        proxyApi='/order-center'
        extraData={{ id }}
      >
        <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>
          <FormRadio
            label='责任方'
            name='duty'
            options={rejects}
            rules={[{ required: true, message: '责任方必选' }]}/>
          <FormSelect
            label={label}
            name='reason'
            placeholder={`请选择${label}`}
            rules={[{ required: true, message: '原因必选' }]}
            options={reasons}/>
          <FormTextArea
            name='mark'
            label='备注'
            placeholder='请填写备注，最多可输入200字'
            config={{ maxLength: 200, showCount: true }}/>
        </Form>
      </FormInModal>
      {/* 改价 */}
      <ChangePrice
        id={id}
        priceVisible={priceVisible}
        onPriceHidden={onPriceHidden}
        info={info}
        cb={cb}/>
      <FormInModal title='备注' visible={markVisible}
        onCancelSubmit={onMarkHidden}
        onSubmit={onSubmit}
        url={markUrl}
        form={markForm}
        proxyApi='/order-center'
        extraData={{ id }}
      >
        <Form>
          <FormTextArea
            name='mark'
            label='备注'
            placeholder='请填写备注，最多可输入200字'
            config={{ maxLength: 200, showCount: true }}/>
        </Form>
      </FormInModal>
      <FormInModal
        visible={dateVisible}
        title='改期'
        extraData={{ id }}
        form={dateForm}
        onCancelSubmit={onDateHidden}
        url='/order/saleOrder/changeDate'
        proxyApi='/order-center'
        transForm={(values: any) => {
          const { dates, mark } = values;
          return {
            mark,
            dates: dates.map(item => dayjs(item).format('YYYY-MM-DD'))
          };
        }}
        onSubmit={onSubmit}>
        <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>
          <FormMultipleDatePicker label='活动日期' name='dates' config={{
            index: 1,
            style: { width: '100%' },
            maxLength: 365,
            maxTagCount: 'responsive'
          }}/>
          <FormTextArea
            name='mark'
            label='备注'
            rules={[{ required: true, message: '修改原因必填' }]}
            placeholder='请填写备注，最多可输入200字'
            config={{ maxLength: 200, showCount: true }}/>
        </Form>
      </FormInModal>
      <AssignModal data={assignModalData} setData={setAssignModalData} onComplete={() => cb?.()} />
    </>
  );
};

export default Action;
