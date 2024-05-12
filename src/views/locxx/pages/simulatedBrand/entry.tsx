import { FC, useEffect, useState } from 'react';
import { MOBILE_REG } from '@lhb/regexp';
import { useMethods } from '@lhb/hook';
import { contrast, noop } from '@lhb/func';
import { get } from '@/common/request';
import { useForm } from 'antd/lib/form/Form';
import styles from './entry.module.less';
import { Button, Form, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import ChangeAccount from 'src/views/locxx/pages/simulatedResponse/components/ChangeAccount';
import Iframe from '@/common/components/Iframe';
// import { getTokenById } from '@/common/api/locxx';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';

const getOriUserInfo = () => {
  return {
    userId: null,
    userName: null,
    tenantName: null,
    mobile: null,
    token: null,
  };
};

/**
 * @description: 模拟品牌（iframe 嵌入locxx-wap）
 * @return {*}
 */
const SimulatedBrand: FC<any> = () => {

  const TENANT_STATUS_STOP = 2; // 租户状态-停用
  const [form] = useForm();
  const [requesting, setRequesting] = useState(false);
  const [visible, setVisible] = useState(false); // 是否打开切换租户弹窗
  const [tenantList, setTenantList] = useState<any>([]); // 租户列表
  const [userInfo, setUserInfo] = useState<{
    userId: number | null,
    userName: string | null,
    tenantName: string | null,
    mobile: string | number | null,
    token: string | null,
  }>(getOriUserInfo()); // 选择的IM用户信息

  const clientKeyMap = {
    pms: 1000010, // pms
    locxx: 1000114, // location app
    location_space: 1001214, // location 商业直租
    default: 1000114,
  };

  const apps = [{ value: 'location_space', label: '商业直租' }, { value: 'locxx', label: 'LOCATION' }];

  // 暂时写死 locxx
  const curApp = Form.useWatch('app', form) || 'default';

  /* hooks */
  useEffect(() => {
    process.env.NODE_ENV === 'development' && form.setFieldValue('mobile', '17777777777');
    form.setFieldValue('app', 'location_space');
  }, []);

  /* methods */
  const methods = useMethods({
    // // 手机号登录IM
    // // // 旧的登录
    // login() {
    //   form.validateFields().then((values) => {
    //     setRequesting(true);
    //     // https://yapi.lanhanba.com/project/319/interface/api/55082
    //     get('/im/getUserIdsByMobile', values, { needHit: true, proxyApi: '/pms-api' }).then(async (res) => {
    //       if (!res.length) {
    //         message.warning('当前手机号没有租户可选择');
    //         return;
    //       }
    //       setTenantList([...res]);
    //       if (res.length === 1) {
    //         await methods.changeAccountComplete(res[0]);
    //       } else {
    //         setVisible(true);
    //       }
    //     }).finally(() => {
    //       setRequesting(false);
    //     });
    //   });
    // },
    // 手机号登录IM， 用户手动登录
    login() {
      form.validateFields().then((values) => {
        const params = {
          mobile: values.mobile,
          simulatedClientKey: clientKeyMap[curApp],
        };
        setRequesting(true);
        // https://yapi.lanhanba.com/project/319/interface/api/58645
        get('/im/getTntList', params, { needHit: true, proxyApi: '/pms-api' }).then(async (res) => {
          console.log('res', res);
          if (!res.length) {
            message.warning('当前手机号没有租户可选择');
            return;
          }
          const tenantList = Array.isArray(res) ? res.filter(item => item.status !== TENANT_STATUS_STOP) : [];
          setTenantList(Array.isArray(tenantList) ? tenantList : []);
          if (tenantList.length === 1) {
            await methods.changeAccountComplete(tenantList[0].id);
          } else {
            setVisible(true);
          }
        }).finally(() => {
          setRequesting(false);
        });
      });
    },
    // 选择租户回调
    async changeAccountComplete(tenantId: number) {
      const parmas = {
        tenantId,
        mobile: form.getFieldValue('mobile'),
        simulatedClientKey: clientKeyMap[curApp],
      };
      // https://yapi.lanhanba.com/project/319/interface/api/58652
      return get('/im/chooseTenant', parmas, { needHit: true, proxyApi: '/pms-api' }).then((res) => {
        setUserInfo({
          userId: contrast(res, 'employeeId'),
          userName: contrast(res, 'name'),
          tenantName: contrast(res, 'tenantName'),
          mobile: contrast(res, 'mobile'),
          token: contrast(res, 'token')
        });
      }).finally(() => {
        setRequesting(false);
      });
    },

    // 账号中心id获取token
    // getTokenById(id) {
    //   if (!id) {
    //     return null;
    //   }
    //   return getTokenById({ id }).then((response) => response.token);
    // },
    // 登出
    logout() {
      setUserInfo(getOriUserInfo());
    },
    iframeRender() {
      // is_admin=1 管理员模拟登录
      const url = `${process.env.LOCXX_WAP_URL}?is_admin=1&kunlun_token=${userInfo.token}&origin=${window.location.origin}&source=${form.getFieldValue('app')}`;
      return <div style={Object.assign({ width: '100%', height: '100%', overflow: 'hidden' })}>
        <Iframe src={url} config={{ allow: 'clipboard-write;geolocation' }}/>
      </div>;
    },
    // 渲染-切换租户
    renderChangeTenant() {
      // 内嵌不允许他自主切换租户
      if (tenantList.length <= 1) {
        return null;
      }
      const handleClick = () => {
        if (tenantList.length <= 1) {
          message.warning('当前手机号只有一个租户，无法切换');
        } else {
          setVisible(true);
        }
      };
      return <Button type='link' onClick={handleClick}>切换租户</Button>;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.simulateWrap}>
        { !!userInfo.token && <div className={styles.simulateHeader}>
          <Button type='link' onClick={methods.logout}>退出登录</Button>
          <div className={styles.title}>{userInfo.tenantName || ''}-{userInfo.userName || ''}-{userInfo.mobile || ''}</div>
          {methods.renderChangeTenant()}
        </div> }
        <div className={styles.simulateContent}>
          { !userInfo.token
            ? <div className={styles.simulateLogin}>
              <div className={styles.loginTitle}>手机号登录</div>
              <V2Form form={form} onKeyUpCapture={e => e.key.toLowerCase() === 'enter' ? methods.login() : noop()}>
                {/* 解决自动填充问题 */}
                <input type='password' className='hide'></input>
                <V2FormRadio label='应用' name='app' options={apps}></V2FormRadio>
                <V2FormInput
                  label='手机号'
                  name='mobile'
                  maxLength={11}
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: MOBILE_REG, message: '请输入正确的手机号' },
                  ]}
                />
              </V2Form>
              <Button type='primary' className={styles.loginBtn} onClick={methods.login} loading={requesting}>登录</Button>
            </div>
            : <div className={styles.simulateIframe}>
              {methods.iframeRender()}
            </div>
          }
        </div>
      </div>

      <ChangeAccount open={visible} setOpen={setVisible} tenantList={tenantList} onChange={item => methods.changeAccountComplete(item?.id)} />
    </div>
  );
};

export default SimulatedBrand;
