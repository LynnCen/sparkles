import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import styles from './entry.module.less';
import cs from 'classnames';
import { Button, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormRadio from 'src/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import ChangeAccount from './components/ChangeAccount';
import IM from '@/common/components/Business/IM';
import { MOBILE_REG } from '@lhb/regexp';
import { useMethods } from '@lhb/hook';
import { contrast, isArray, noop } from '@lhb/func';
import { get, post } from '@/common/request';
import { useForm } from 'antd/lib/form/Form';
// import { getTokenById } from '@/common/api/locxx';
import V2Title from '@/common/components/Feedback/V2Title';
import Workbench from '@/views/locxx/pages/simulatedResponse/components/Workbench/index';
import ChangePlace from './components/ChangePlace';


// 来源
export enum Sources {
  PMS = 'pms',
  LOCXX = 'locxx',
  LOCATION_SPACE = 'location_space'
}

const getOriUserInfo = (): any => {
  return {
    userId: null,
    userName: null,
    tenantName: null,
    mobile: null,
    token: null,
    source: Sources.LOCXX,
  };
};

/**
 * @description: 模拟回复（iframe 嵌入locxx-im）
 * @return {*}
 */
const SimulatedResponse: FC<{
  align?: 'left' | 'center' | 'right', // 布局位置：left/center/right
  // 被modal内嵌，并插入的数据；mobile、customType、tenantId 三者都传入时自动登录
  modalSetData?: {
    tenantId?: string | number, // 自动登录的租户id
    mobile?: string | number, // 自动登录的手机号
    source?: string | number, // 自动登录的模拟方：locxx/pms
    contactId?: string | number, // 联系的用户id
    consultation?: string | number, // 是否咨询
    virtualAccount?: string | number, // 虚拟账号
  }, ref?: any
}> = forwardRef(({ align, modalSetData }, ref) => {

  useImperativeHandle(ref, () => ({
    logout: methods.logout
  }));

  const imRef = useRef<any>();

  const TENANT_STATUS_STOP = 2; // 租户状态-停用
  const [form] = useForm();
  const [isInModal, setIsInModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // 如果是内嵌，就默认loading，如果是页面自行打开，就不用loading
  const [requesting, setRequesting] = useState(false);
  const [visible, setVisible] = useState(false); // 是否打开切换租户弹窗
  const [placeVisible, setPlaceVisible] = useState<boolean>(false); // 是否打开选择弹窗
  const [tenantList, setTenantList] = useState<any>([]); // 租户列表
  const [showIM, setShowIM] = useState<boolean>(false); // 是否展示IM
  const [placeList, setPlaceList] = useState<any>([]); // 项目列表
  const [userInfo, setUserInfo] = useState<{
    userId: number | null,
    userName: string | null,
    tenantName: string | null,
    mobile: string | number | null,
    token: string | null,
    /** 来源：pms、locxx，以哪个身份发起会话  */
    source: Sources,
    virtualAccount?: string | null, // 虚拟账号
  }>(getOriUserInfo()); // 选择的IM用户信息

  const [IMConversationDetail, setIMConversationDetail] = useState({
    showDetail: false, // 是否打开了详情
    fromIMId: '', // 会话发起方的 IM ID
    toIMId: '', // 会话接收方的 IM ID
  });

  const sources = [
    { label: '品牌', value: Sources.LOCXX }, // location 的 clientKey
    { label: '物业', value: Sources.PMS }, // pms 的 clientKey
    { label: 'location 商业直租', value: Sources.LOCATION_SPACE }, // location 商业直租 的 clientKey
  ];
  const clientKeyMap = {
    pms: 1000010,
    locxx: 1000114,
    location_space: 1001214,
    default: 1000114,
  };

  const showWorkbench = !!userInfo.token && !!IMConversationDetail.showDetail && !!IMConversationDetail.fromIMId && !!IMConversationDetail.toIMId;

  /* hooks */
  useEffect(() => {
    // 测试环境便捷代码
    process.env.NODE_ENV === 'development' && form.setFieldValue('mobile', '17777777777');

    window.addEventListener('message', methods.getMessageForSon);
    return () => {
      window.removeEventListener('message', methods.getMessageForSon);
    };
  }, []);

  useEffect(() => {
    methods.resetIMConversationDetail();

    if (modalSetData) { // 如果是被内嵌，如会话记录内嵌
      unstable_batchedUpdates(() => {
        setIsInModal(true);
      });
      methods.automaticLogin();
    }
  }, [modalSetData]);

  /* methods */
  const methods = useMethods({

    // 重置数据
    resetIMConversationDetail() {
      setIMConversationDetail({
        showDetail: false, // 是否打开了详情
        fromIMId: '', // 会话发起方的 IM ID
        toIMId: '', // 会话接收方的 IM ID
      });
    },

    // // 手机号登录IM， 用户手动登录
    // // 旧的登录
    // login2() {
    //   form.validateFields().then((values) => {
    //     setRequesting(true);
    //     // https://yapi.lanhanba.com/project/319/interface/api/55082
    //     get('/im/getUserIdsByMobile', values, { needHit: true, proxyApi: '/pms-api' }).then((res) => {
    //       if (!res.length) {
    //         message.warning('当前手机号没有租户可选择');
    //         return;
    //       }
    //       setTenantList(Array.isArray(res) ? res : []);
    //       if (res.length === 1) {
    //         methods.changeAccountComplete(res[0]);
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
          simulatedClientKey: clientKeyMap[values.source] || clientKeyMap.default,
        };
        setRequesting(true);
        // https://yapi.lanhanba.com/project/319/interface/api/58645
        get('/im/getTntList', params, { needHit: true, proxyApi: '/pms-api' }).then(async (res) => {
          // console.log('res', res);
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
    // 选择租户
    async changeAccountComplete(tenantId: number, virtualAccount?: any) {
      const parmas = {
        tenantId,
        mobile: form.getFieldValue('mobile'),
        simulatedClientKey: clientKeyMap[form.getFieldValue('source')] || clientKeyMap.default,
      };
      setLoading(true);
      // https://yapi.lanhanba.com/project/319/interface/api/58652
      return get('/im/chooseTenant', parmas, { needHit: true, proxyApi: '/pms-api' }).then((res) => {

        const userInfo = {
          userId: contrast(res, 'employeeId'),
          userName: contrast(res, 'name'),
          tenantName: contrast(res, 'tenantName'),
          mobile: contrast(res, 'mobile'),
          token: contrast(res, 'token'),
          source: form.getFieldValue('source'),
          virtualAccount,
        };

        console.log(virtualAccount, 'virtualAccount');

        // 只有邻汇吧租户需要走多项目账号逻辑
        if (Number(tenantId) === 1165 && !virtualAccount) {
          const newParams = {
            tntInstId: tenantId,
            userId: contrast(res, 'employeeId')
          };

          post('/im/getImPlaceList', newParams, { needHit: true, proxyApi: '/pms-api' }).then((result) => {
            if (isArray(result) && result.length > 1) {
              setPlaceList(result);
              setPlaceVisible(true);
              setUserInfo(userInfo);
            } else {
              setUserInfo({
                ...userInfo,
                virtualAccount: result[0].virtualAccount || null,
              });
              setShowIM(true);
            }
          });
        } else {
          setShowIM(true);
          setUserInfo(userInfo);
        }
      }).finally(() => {
        setLoading(false);
      });
    },

    // 选择项目
    async changePlaceComplete(virtualAccount: string) {
      setUserInfo((userInfo) => ({ ...userInfo, virtualAccount }));
      console.log(userInfo, 'userInfo');
      setShowIM(true);
    },

    // // 账号中心id获取token
    // getTokenById(id) {
    //   if (!id) {
    //     return null;
    //   }
    //   return getTokenById({ id }).then((response) => response.token);
    // },
    // 登出
    logout() {
      setUserInfo(getOriUserInfo());
      setShowIM(false);
    },
    // 自动登录，一些modal内嵌场景，如会话详情点击模拟用户1，进行登录的
    automaticLogin() {
      if (!modalSetData) {
        return;
      }

      console.log(modalSetData);
      form.setFieldValue('mobile', modalSetData.mobile);
      form.setFieldValue('source', modalSetData.source);
      // 如果三者都传入，则自动登录（防止存在未取到用户类型的情况）
      if (modalSetData.tenantId && modalSetData.mobile && modalSetData.source) {

        if (Number(modalSetData.tenantId) === 1165) {
          methods.changeAccountComplete(modalSetData.tenantId, modalSetData.virtualAccount);
          return;
        }

        methods.changeAccountComplete(modalSetData.tenantId);
      }
      // get('/im/getUserIdsByMobile', {
      //   mobile: modalSetData.mobile,
      //   tenantId: modalSetData.tenantId
      // }, { needHit: true, proxyApi: '/pms-api' }).then((res) => {
      //   if (!res.length) {
      //     message.warning('当前手机号没有租户可选择');
      //     return;
      //   }
      //   methods.changeAccountComplete(res.find(item => +item.tenantId === +modalSetData.tenantId));
      // }).finally(() => {
      //   setLoading(false);
      // });
    },
    // 渲染-切换租户
    renderChangeTenant() {
      // 内嵌不允许他自主切换租户
      if (isInModal || tenantList.length <= 1) {
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
    },

    // 接收子级值消息
    getMessageForSon(event) {
      const data = event.data || {};
      switch (data.type) {
        // 切换会话详情状态
        case 'showIMConversationDetail':
          // console.log('showIMConversationDetail', data.data, data.fromIMId, data.toIMId);
          const showDetail = !!data.data;
          setIMConversationDetail({
            showDetail,
            fromIMId: showDetail ? data.fromIMId : '',
            toIMId: showDetail ? data.toIMId : '',
          });
          // dispatch(setIMConversationDetail(data.data));
          break;
        default:
          break;
      }
    },

    // 创建链接后传递给 im
    createLinkComplete(link) {
      link && imRef.current?.inputMessageText?.(`请填点击链接填写报价。链接：${link}`);
    }

  });

  return (<>
    <div className={cs([
      styles.container,
      isInModal && styles.containerInModal,
      !!align && styles[align],
    ])}>
      <div className={cs(styles.containerLeft)}>
        <V2Title type='H1' text='模拟聊天窗口' className='mb-16'/>
        <div className={styles.simulateWrap}>
          {
            (!!userInfo.token && showIM) && (
              <div className={styles.simulateHeader}>
                {/* 内嵌里不允许他自主退出 */}
                {!isInModal && <Button type='link' onClick={methods.logout}>退出登录</Button>}
                <div className={styles.title}>{userInfo.tenantName || ''}-{userInfo.userName || ''}-{userInfo.mobile || ''}</div>
                {methods.renderChangeTenant()}
              </div>
            )
          }
          <div className={styles.simulateContent}>
            {
              (!userInfo.token || !showIM)
                ? (
                  <div className={styles.simulateLogin}>
                    <div className={styles.loginTitle}>手机号登录</div>
                    <V2Form
                      form={form}
                      layout='horizontal'
                      labelCol={{ span: 5 }}
                      onKeyUpCapture={e => e.key.toLowerCase() === 'enter' ? methods.login() : noop()}
                    >
                      {/* 解决自动填充问题 */}
                      <input type='password' className='hide'></input>
                      <V2FormRadio form={form} label='模拟方' name='source' formItemConfig={{ initialValue: Sources.LOCATION_SPACE }} options={sources} required/>
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
                    <Button type='primary' className={styles.loginBtn} onClick={methods.login} loading={requesting || loading}>登录</Button>
                  </div>
                )
                : (
                  <div className={styles.simulateIframe}>
                    <IM
                      ref={imRef}
                      source={userInfo.source}
                      token={userInfo.token}
                      contactId={modalSetData?.contactId}
                      consultation={modalSetData?.consultation}
                      style={{ width: '100%', height: '100%' }}
                      virtualAccount={userInfo?.virtualAccount}
                    />
                  </div>
                )
            }
          </div>
        </div>
      </div>

      {/* 模拟回复-工作台 */}
      {showWorkbench && <Workbench className='workbench' fromIMId={IMConversationDetail.fromIMId} toIMId={IMConversationDetail.toIMId} createLinkComplete={methods.createLinkComplete} />}
    </div>

    <ChangeAccount open={visible} setOpen={setVisible} tenantList={tenantList} onChange={item => methods.changeAccountComplete(item?.id)} />

    <ChangePlace open={placeVisible} setOpen={setPlaceVisible} placeList={placeList} onChange={item => methods.changePlaceComplete(item?.virtualAccount)} />
  </>);
});

export default SimulatedResponse;
