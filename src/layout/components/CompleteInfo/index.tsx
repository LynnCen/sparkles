// 完善信息弹窗
import { FC, useEffect, useRef, useState } from 'react';
import { Button, Form, message, Spin } from 'antd';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import { useMethods } from '@lhb/hook';
import { postSelectionTree } from '@/common/api/common';
import { refactorSelection } from '@/common/utils/ways';
import { isObject, treeFind } from '@lhb/func';
import { setCookie } from '@lhb/cache';
import { posteRegisterTrial, getRegisterTrialStatus } from '@/common/api/user';
import { dispatchNavigate } from '@/common/document-event/dispatch';
const CompleteInfo: FC<any> = ({
  infoData,
  justAwait = false,
  isPortal
}) => {
  const [form] = Form.useForm();
  const targetRef: any = useRef(null);
  const submitLockRef = useRef(false);
  const [loading, setLoading] = useState(justAwait);
  const [treeData, setTreeData] = useState<any[]>([]);

  const methods = useMethods({
    submit() {
      form.validateFields().then((params) => {
        const target = treeFind(treeData, (item) => item.id === params.industryId);
        const _params: any = {
          mobile: infoData.mobile,
          firstIndustryId: target.parentId ? target.parentId : target.id,
          registFrom: 0, // 0:租户前台 1:Android 2:IOS 3:移动端H5
          registChannel: 0, // 注册渠道：-1:未知（不传就是-1） 0:租户前台 1:官网
        };
        if (target.parentId) {
          _params.secondIndustryId = target.id;
        }
        if (isPortal) {
          _params.registChannel = 1; // 注册渠道：-1:未知（不传就是-1） 0:租户前台 1:官网
        }
        if (submitLockRef.current) return;
        submitLockRef.current = true;
        posteRegisterTrial(_params).then((res) => {
          const { tenantId, employeeId } = res;
          let timeWait = 100;
          if (process.env.NODE_ENV !== 'development') { // 开发环境屏蔽
            if (isObject(res.token)) { // 如果是对象，就上报
              // 主动send事件
              window.LHBbigdata.send({
                event_id: 'console_pc_cookie_monitoring_token', // 事件id
                msg: res, // 额外需要插入的业务信息
              });
              timeWait = 200;
            }
          }
          tenantId && setCookie('tenantId', tenantId);
          employeeId && setCookie('employeeId', employeeId);
          setCookie('flow_token', res.token);
          setLoading(true);
          const timer = setInterval(() => {
            getRegisterTrialStatus().then((res) => {
              if (res.initStatus) {
                clearInterval(timer);
                setTimeout(() => {
                  window.location.reload();
                }, timeWait);
              }
            });
          }, 1500);
        }).finally(() => {
          submitLockRef.current = false;
        });
        message.success('操作成功，数据正在初始化');
      });
    }
  });

  useEffect(() => {
    if (!justAwait) {
      postSelectionTree({ key: 'lc:industry' }).then((res) => {
        setTreeData(res);
      });
    } else {
      const timer = setInterval(() => {
        getRegisterTrialStatus().then((res) => {
          if (res.initStatus) {
            clearInterval(timer);
            setTimeout(() => {
              dispatchNavigate('/');
            }, 100);
          }
        });
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={targetRef} className={styles.completeInfo}>
      <div className={styles.completeInfoMask}></div>
      {
        loading ? <Spin className={styles.spin} size='large' tip='初始化中...'/> : <div className={styles.completeInfoConfirm}>
          <div className={styles.completeInfoWrapper}>
            <div className={styles.completeInfoTitle}>欢迎了解Location拓店选址解决方案</div>
            <p className={styles.completeInfoTip}>我们将根据你的回答匹配更适合的解决方案</p>
            <V2Form form={form}>
              <V2FormTreeSelect
                label='你的主营行业是？'
                required
                name='industryId'
                treeData={refactorSelection(treeData)}
                rules={[{ required: true, message: '请选择你的主营行业' }]}
              />
            </V2Form>
            <Button className={styles.submit} onClick={methods.submit} type='primary' block size='large'>免费试用</Button>
          </div>
        </div>
      }
    </div>
  );
};

export default CompleteInfo;
