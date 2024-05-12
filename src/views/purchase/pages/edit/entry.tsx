import { FC, useRef, useState } from 'react';
import styles from './entry.module.less';
import { postPurchaseOrderCreate } from '@/common/api/purchase';
// import { getSectionDate } from 'src/common/utils/date';
import { contrast, deepCopy, isNotEmpty } from '@lhb/func';
import { Form, Button, message, Divider } from 'antd';
import Basic from './components/Basic';
import Places from './components/Places/index';
import { dispatchNavigate } from '@/common/document-event/dispatch';

const layout = {
  // labelCol: { span: 6 },
  // wrapperCol: { span: 16 },
};

const Edit: FC<any> = () => {

  const [form] = Form.useForm();
  // 未绑定到 form 上的字段
  const [extraFormData, setExtraFormData] = useState({
    supplyName: null, // 供应商名称
    contactName: null, // 联系人名称
    contactMobile: null, // 联系人手机号
  });

  const updateExtraFormData = (data) => {
    setExtraFormData(Object.assign(extraFormData, data));
  };

  const [requesting, setRequesting] = useState(false);

  const places: any = useRef(null);

  // 取消
  const cancel = () => {
    dispatchNavigate('/purchase');
  };

  // 确定
  const confirm = () => {
    console.log('确定');
    form.validateFields().then((values) => {
      console.log('values', values);

      // 获取场地点位及价格 Places
      const spots = deepCopy(places.current.dataItems);

      if (!Array.isArray(spots) || !spots.length) {
        message.warning('请先添加场地点位');
        return;
      }

      // 根据 validate 判断是否完善价格信息
      const unValidateItem = spots.find(item => !item.validate);
      if (unValidateItem) {
        message.warning('请先编辑完善场地点位价格：' + unValidateItem.name);
        return;
      }

      spots.forEach(item => {
        // // 处理日期范围为单日期数组，如 ['2022-12-02', '2022-12-07'] => ['2022-12-02', '2022-12-03', '2022-12-04', '2022-12-05', '2022-12-06', '2022-12-07']
        // const dates = contrast(item, 'dates', []);
        // if (Array.isArray(dates) && dates.length === 2) {
        //   item.dates = getSectionDate(+new Date(dates[0]), +new Date(dates[1]), true);
        // }

        item.purchasePeriods = contrast(item, 'purchasePeriods', []).filter(item => isNotEmpty(item.date) && isNotEmpty(item.amount));
        item.depositPeriods = contrast(item, 'depositPeriods', []).filter(item => isNotEmpty(item.date) && isNotEmpty(item.amount));
      });

      console.log('spots', spots);

      const params = Object.assign({}, deepCopy(extraFormData), deepCopy(values), { spots });
      console.log('params', params);
      setRequesting(true);
      postPurchaseOrderCreate(params).then(() => {
        dispatchNavigate('/purchase');
        message.success('新增采购单成功');
      }).finally(() => {
        setRequesting(false);
      });
    });
  };

  return (
    <div className={styles.container}>

      <Form {...layout} labelAlign='left' form={form} colon={false} className={styles.form}>
        <div className='fn-20 lh-28 font-weight-500 mb-16'>新增采购单</div>
        <Basic form={form} updateExtraFormData={updateExtraFormData} />
        <Places ref={places} />
      </Form>

      <div>
        <Divider className='mt-16 mb-16'></Divider>
        <div className='ct'>
          <Button className='mr-8' onClick={cancel}>取消</Button>
          <Button type='primary' disabled={requesting} onClick={confirm}>确定</Button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
