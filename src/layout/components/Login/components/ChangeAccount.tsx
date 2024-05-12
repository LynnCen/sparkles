/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, List } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { post } from '@/common/request/index';
import { AccountModalProps } from '../ts-config';
import cs from 'classnames';
import { setCookie } from '@lhb/cache';
import { tntList } from '@/common/api/common';
import styles from './index.module.less';
import { dateFns, isArray, isMobile, isObject } from '@lhb/func';

const ChangeAccount: React.FC<AccountModalProps> = ({ setShowAccountModal, showAccountModal }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [enterprisesList, setEnterprisesList] = useState<any[]>([]);
  const lockRef: any = useRef(false);
  useEffect(() => {
    showAccountModal ? getEnterprises() : setLoading(true);
  }, [showAccountModal]);

  // 获取企业信息
  const getEnterprises = () => {
    tntList().then((data: any) => {
      setEnterprisesList(data);
      setLoading(false);
      if (isArray(data) && data.length === 1) {
        intoHandle(data[0]);
      }
    });
  };

  // 选择企业
  const intoHandle = async (enterprise: any) => {
    const { id } = enterprise;
    if (lockRef.current) return;
    lockRef.current = true;
    const params: any = {
      tenantId: id,
    };
    // https://yapi.lanhanba.com/project/297/interface/api/33442
    const res = await post('/chooseTenant', params, true).finally(() => {
      lockRef.current = false;
    });
    const { token, tenantId, employeeId } = res;
    let timeWait = 100;
    if (process.env.NODE_ENV !== 'development') { // 开发环境屏蔽
      if (isObject(token)) { // 如果是对象，就上报
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
    token && setCookie('flow_token', token);
    // location-PC端，用户登录系统时,埋点上报
    window.LHBbigdata.send({
      event_id: '67b7c29e-4d75-4b11-a417-3ea52a714c44', // 事件id
      msg: {
        tenant_id: tenantId, // 租户id
        user_id: employeeId, // 账号id
        report_time: dateFns.currentTime('', false),
      } // 额外需要插入的业务信息
    });
    setTimeout(() => {
      // 如果是接入企业微信并且是H5需要登录后跳转到h5页面
      if (isMobile() && process.env.INSIGHT_URL) {
        // window.location.href = process.env.CONSOLE_H5_URL;
        window.location.href = process.env.INSIGHT_URL + `/home`;
      } else {
        window.location.href = '/';
      }
    }, timeWait);
  };

  return (
    <>
      {isArray(enterprisesList) && enterprisesList.length > 1 && <Modal
        open={showAccountModal}
        title='请选择租户'
        footer={false}
        onCancel={() => setShowAccountModal(false)}
        width={480}
        className={styles.changeAccount}
        centered
      >
        <List
          dataSource={enterprisesList}
          loading={loading}
          className={styles.listWrap}
          renderItem={(item: any) => (
            <List.Item onClick={() => intoHandle(item)}>
              <List.Item.Meta
                description={
                  <div className={cs(styles.flexItem)}>
                    <div className={styles.imgBox}>
                      <img src='https://staticres.linhuiba.com/project-custom/locationpc/new/icon_select_account.png'/>
                    </div>
                    <div className={cs(styles.name, 'ft-28 c-666 ml-8 ellipsis')}>{item.name}</div>
                    <RightOutlined className={cs(styles.rightArrow, 'pointer')} onClick={() => intoHandle(item)} />
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>}
    </>
  );
};

export default ChangeAccount;
