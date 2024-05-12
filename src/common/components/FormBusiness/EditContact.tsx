import { Form, Modal, Spin, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '../Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { MOBILE_REG } from '@lhb/regexp';
import { post } from '@/common/request';

// 编辑联系人
const Refuse:FC<{
  editData: any,
  setEditData: any,
  complete: Function,
  contactId: number
}> = ({ editData, setEditData, complete, contactId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [curContact, setCurContact] = useState({ id: null, enterpriseId: null });

  useEffect(() => {
    if (editData.visible) {
      methods.init();
    }
  }, [editData.visible, contactId]);

  const methods = useMethods({
    init() {
      setLoading(true);
      methods.getContact().then(res => {
        setCurContact(state => ({ ...state, ...res }));
        form.setFieldsValue(Object.assign({}, methods.getOriFromData(), res, {
          tenantName: res.enterpriseName,
          tenantId: res.enterpriseId,
        }));
      }).catch(() => {
        message.error('获取联系人失败');
      }).finally(() => {
        setLoading(false);
      });
    },
    submit() {
      form.validateFields().then(result => {
        const params = {
          id: curContact?.id,
          name: result?.name,
          mobile: result?.mobile,
          tenantName: result?.tenantName,
          tenantId: curContact?.enterpriseId
        };
        // https://yapi.lanhanba.com/project/307/interface/api/61102
        post('/locxx/requirement/updateContact', params, { proxyApi: '/lcn-api' }).then((res) => {
          complete?.({
            id: res?.id,
            name: res?.name,
            mobile: res?.mobile,
            enterpriseName: res?.tenantName,
            enterpriseId: res?.tenantId,
          });
          methods.cancel();
        }).catch(err => {
          console.log('err', err);
        });
      });
    },
    cancel() {
      setEditData(state => ({ ...state, visible: false }));
    },
    getOriFromData() {
      return {
        id: null,
        name: null, // 姓名
        mobile: null, // 手机号
        tenantName: null, // 租户名称
        tenantId: null, // 联系人租户id
      };
    },
    getContact() {
      return new Promise((resolve, reject) => {
        // https://yapi.lanhanba.com/project/307/interface/api/58659
        post('/locxx/requirement/contacts', { ids: [contactId] }, { proxyApi: '/lcn-api' }).then((res) => {
          resolve(Array.isArray(res) && res.length ? res[0] : {});
        }).catch(err => {
          console.log('err', err);
          reject({});
        });
      });
    },
  });

  return <Modal
    title= '联系人信息'
    width={336}
    open={editData.visible}
    onOk={methods.submit}
    onCancel={methods.cancel}
  >
    <Spin spinning={loading}>
      <V2Form form={form}>
        <V2FormInput
          label='姓名'
          placeholder='请输入姓名'
          name='name'
          maxLength={5}
          rules={[{ required: true, whitespace: true, message: '请输入姓名' }]}
        />
        <V2FormInputNumber
          label='手机号'
          name='mobile'
          placeholder='请输入手机号'
          precision={0}
          config={{
            controls: false,
            maxLength: 11
          }}
          rules={[{ required: true, message: '请输入11位手机号码' }, { pattern: MOBILE_REG, message: '输入的手机号码不合法' }]}
        />
        <V2FormInput
          label='公司名称'
          placeholder='请输入公司名称'
          name='tenantName'
          maxLength={15}
          rules={[{ required: false, whitespace: true, message: '请输入公司名称' }]}
        />
      </V2Form>
    </Spin>
  </Modal>;
};

export default Refuse;
