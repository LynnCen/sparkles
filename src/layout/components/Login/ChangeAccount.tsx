import React, { useState, useEffect } from 'react';
import { Modal, List } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { post } from '@/common/request/index';
import cs from 'classnames';
import { tntList } from '@/common/api/common';
import styles from './index.module.less';
import { dispatchLogin } from '@/common/document-event/dispatch';

interface AccountModalProps {
  showChangeAccount: Function;
  showAccountModal: boolean;
  initToken?: string
}


const ChangeAccount: React.FC<AccountModalProps> = ({ showChangeAccount, showAccountModal, initToken }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [enterprisesList, setEnterprisesList] = useState<any[]>([]);

  useEffect(() => {
    showAccountModal ? getEnterprises() : setLoading(true);

  }, [showAccountModal]);

  // 获取企业信息
  const getEnterprises = () => {
    tntList(initToken).then((data) => {
      setEnterprisesList(data);
      setLoading(false);
    });
  };


  // 选择企业
  const intoHandle = async (enterprise: any) => {
    const { id } = enterprise;
    const params: any = {
      tenantId: id,
    };
    // https://yapi.lanhanba.com/project/307/interface/api/33540
    const { token, employeeId } = await post('/chooseTenant', params, {
      needHint: true,
      proxyApi: '/mirage',
      headers: {
        token: initToken,
      }
    });
    token && dispatchLogin({ token, employeeId });
  };

  return (
    <Modal
      open={showAccountModal}
      title='选择账号进入首页'
      footer={false}
      onCancel={() => showChangeAccount(false)}
      width={600}
      maskClosable={false}
    >
      <List
        dataSource={enterprisesList}
        loading={loading}
        className={styles.listWrap}
        renderItem={(item: any) => (
          <div onClick={() => intoHandle(item)}>
            <List.Item>
              <List.Item.Meta
                description={
                  <div className={styles.item}>
                    <div className={cs(styles.flexItem)}>
                      <div>
                        {item.name}
                      </div>
                      <RightOutlined className='color-primary-operate pointer' onClick={() => intoHandle(item)} />
                    </div>
                  </div>
                }
              />
            </List.Item>
          </div>
        )}
      />
    </Modal>
  );
};

export default ChangeAccount;
