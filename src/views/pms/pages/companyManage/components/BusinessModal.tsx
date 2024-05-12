import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import { Modal, Form, Checkbox, Input, Spin, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { postBusinessType } from '@/common/api/pms';

type Business = {
  own: boolean,
  buyout: boolean,
  stead: boolean,
  mediation: boolean,
  ownName?:string,
  buyoutName?:string,
  steadName?:string,
  mediationName?:string
}

const BusinessModal:FC<any> = ({ showModal, setShowModal, id, businessInfo }) => {
  const [showOwn, setShowOwn] = useState<any>({ checked: false, info: null });
  const [showBuyout, setshowBuyout] = useState<any>({ checked: false, info: null });
  const [showStead, setShowStead] = useState<any>({ checked: false, info: null });
  const [showMediation, setShowMediation] = useState<any>({ checked: false, info: null });
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const methods = useMethods({
    onChange(e) {
      const name = e.target.name;
      switch (name) {
        case 'own':
          setShowOwn({ ...showOwn, checked: !showOwn.checked });
          break;
        case 'buyout':
          setshowBuyout({ ...showBuyout, checked: !showBuyout.checked });
          break;
        case 'stead':
          setShowStead({ ...showStead, checked: !showStead.checked });
          break;
        case 'mediation':
          setShowMediation({ ...showMediation, checked: !showMediation.checked });
          break;
      }
    },
    submit() {
      form.submit();
    },
    onFinish(val:Business) {
      let key: keyof Business;
      const businessTypes:any = [];
      for (key in val) {
        if (val.hasOwnProperty(key)) {
          let businessTypeId:number;
          if (val[`${key}`]) {
            switch (key) {
              case 'own':
                businessTypeId = 1;
                break;
              case 'buyout':
                businessTypeId = 2;
                break;
              case 'stead':
                businessTypeId = 3;
                break;
              case 'mediation':
                businessTypeId = 4;
                break;
              default:
                businessTypeId = 0;
                break;
            }
            if (val[`${key}` + 'Name'] && businessTypeId) {
              businessTypes.push({ businessTypeId, alias: val[`${key}` + 'Name'] });
            } else if (businessTypeId) {
              businessTypes.push({ businessTypeId });
            }
          }
        }
      };
      const params = { tenantId: id, businessTypes };
      postBusinessType(params).then(() => {
        message.success('业务类型修改成功');
      });
      setShowModal(false);
    },
    cancel() {
      setShowModal(false);
    },
    resetState() {
      setShowOwn({ checked: false, info: null });
      setshowBuyout({ checked: false, info: null });
      setShowStead({ checked: false, info: null });
      setShowMediation({ checked: false, info: null });
    }
  });

  useEffect(() => {
    // setLoading(true);
    // form.resetFields();
    businessInfo.map((item) => {
      switch (item.businessTypeId) {
        case 1:
          setShowOwn({ info: item.alias, checked: true });
          break;
        case 2:
          setshowBuyout({ info: item.alias, checked: true });
          break;
        case 3:
          setShowStead({ info: item.alias, checked: true });
          break;
        case 4:
          setShowMediation({ info: item.alias, checked: true });
          break;
        default:
          break;
      }
    });
    setLoading(false);
  }, [businessInfo]);

  return (
    <div className={styles.business}>
      <Modal
        className={styles['business-modal']}
        open={showModal}
        title='设置业务类型'
        getContainer={false}
        onOk={methods.submit}
        onCancel={methods.cancel}
        afterClose={methods.resetState}
        destroyOnClose
      >
        <div className={styles['text-form']}>
          <Spin spinning={loading}>
            {!loading && <Form
              name='business'
              form={form}
              onFinish={methods.onFinish}
              preserve={false}
            >
              <Form.Item name='own' valuePropName='checked' initialValue={showOwn.checked}>
                <Checkbox
                  className={styles['check-box']}
                  onChange={methods.onChange}
                  style={{ marginTop: 0 }}
                  name='own'
                >自有资产招租</Checkbox>
              </Form.Item>
              <div className={styles.tips}>指当前租户为资产所有方，直接对外出租</div>
              {showOwn.checked && <Form.Item name='ownName' initialValue={showOwn.info}>
                <Input
                  className={styles.input}
                  placeholder='可输入别名，便于租户理解'
                />
              </Form.Item>}
              <Form.Item name='buyout' valuePropName='checked' initialValue={showBuyout.checked}>
                <Checkbox
                  className={styles['check-box']}
                  onChange={methods.onChange}
                  name='buyout'
                >买断资产招租</Checkbox>
              </Form.Item>
              <div className={styles.tips}>指当前租户非资产所有方，但通过买断方式获得资产所有权，并对外招租</div>
              {showBuyout.checked && <Form.Item name='buyoutName' initialValue={showBuyout.info}>
                <Input className={styles.input} placeholder='可输入别名，便于租户理解'/>
              </Form.Item>}
              <Form.Item name='stead' valuePropName='checked' initialValue={showStead.checked}>
                <Checkbox
                  className={styles['check-box']}
                  onChange={methods.onChange}
                  name='stead'
                >资产代销抽佣</Checkbox>
              </Form.Item>
              <div className={styles.tips}>指当前租户获得资产所有方的委托，进行资产代销，最终获得相应比例分佣</div>
              {showStead.checked && <Form.Item name='steadName' initialValue={showStead.info}>
                <Input
                  className={styles.input}
                  placeholder='可输入别名，便于租户理解'
                />
              </Form.Item>}
              <Form.Item name='mediation' valuePropName='checked' initialValue={showMediation.checked}>
                <Checkbox
                  className={styles['check-box']}
                  onChange={methods.onChange}
                  defaultChecked={showMediation}
                  name='mediation'
                >中介撮合服务</Checkbox>
              </Form.Item>
              <div className={styles.tips}>指当前租户既非资产所有方，也没有资产使用权，仅通过在购买方和资产方之间进行撮合，获取差价</div>
              {showMediation.checked && <Form.Item name='mediationName' initialValue={showMediation.info}>
                <Input
                  className={styles.input}
                  placeholder='可输入别名，便于租户理解'
                />
              </Form.Item>}
            </Form>}
          </Spin>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessModal;
