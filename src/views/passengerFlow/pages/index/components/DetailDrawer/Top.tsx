import React, { useState } from 'react';
import styles from './index.module.less';
import { Col, Row, message } from 'antd';
import V2Tag from '@/common/components/Data/V2Tag';
import { useMethods } from '@lhb/hook';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { refactorPermissions } from '@lhb/func';
import { PermissionEvent } from '../../../detail/ts-config';
import { EditOutlined } from '@ant-design/icons';
import ShopModal from '@/views/passengerFlow/components/ShopModal';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { postBatchDelete } from '@/common/api/passenger-flow';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { post } from '@/common/request';

const ATop: React.FC<any> = (props) => {
  const {
    detail,
    onChange,
  } = props;
  const [shopModalVisible, setShopModalVisible] = useState<boolean>(false);
  // 选择成员
  const [chooseUserValues, setChooseUserValues] = useState<any>({
    visible: false,
    users: [],
  });
  console.log(onChange);

  const methods = useMethods({
    handleUpdateShop: () => {
      setShopModalVisible(true);
    },

    handleRemoveShop: () => {
      if (!detail) {
        return;
      }
      V2Confirm({
        title: '删除门店',
        content: '是否删除门店？',
        onSure: async () => {
          const success = await postBatchDelete({ ids: [detail.id] });
          if (success) {
            message.success('删除成功');
            dispatchNavigate('/passengerFlow?reset=1');
          }
        },
      });
    },
  });

  const operateBtns = () => {
    // 接口返回的权限信息
    const permissions = !detail ? [] : refactorPermissions(detail.permissions);

    // 筛选需要展示按钮，并指定文案
    const tmpBtns: any = [];
    permissions.forEach((per: any) => {
      if (per.event === PermissionEvent.STORE_UPDATE) {
        const text = '编辑';
        tmpBtns.push({
          ...per,
          name: text,
          text,
          func: 'handleUpdateShop',
        });
      } else if (per.event === PermissionEvent.STORE_DELETE) {
        const text = '删除';
        tmpBtns.push({
          ...per,
          name: text,
          text,
          func: 'handleRemoveShop',
        });
      }
    });

    const btns = tmpBtns.map((itm, index: number) => ({
      ...itm,
      type: !index ? 'primary' : 'default'
    }));
    return btns;
  };
  const handleItem = () => {
    window.open(`/resmng/real-detail?id=${detail.placeId}&resourceType=1&categoryId=${detail.spotCategoryId}&isKA=false&activeKey=${detail.spotId}`);
  };

  const showMaintainer = () => {
    // https://yapi.lanhanba.com/project/434/interface/api/44295
    setChooseUserValues({ visible: true, users: detail?.lhMaintainers });
  };
  // 确定选择成员
  const onOkSelector = ({ users, visible }) => {
    // https://yapi.lanhanba.com/project/434/interface/api/46199
    post('/admin/store/updateMaintainers', {
      storeIds: [detail?.id],
      accountIds: users.map((item) => item.id),
      type: 3
    }, {
      needHint: true,
      proxyApi: '/passenger-flow'
    }).then(() => {
      message.success('运维人员修改成功');
      setChooseUserValues({ users, visible });
      onChange();
    });
  };

  return <div className={styles.infoTop}>
    <V2Title text={detail.name} extra={
      <V2Operate
        operateList={operateBtns()}
        onClick={(btns: { func: string | number }) => methods[btns.func]()}/>
    }>
    </V2Title>
    <div style={{ marginTop: '8px' }}>
      {!!detail.typeName && <V2Tag color='blue'>{ detail.typeName }</V2Tag>}
    </div>
    <div className={styles.infoTopDesc}>
      <V2DetailGroup direction='vertical' moduleType='easy'>
        <Row gutter={8}>
          <Col span={4}>
            <V2DetailItem label='品牌名称' value={detail.brandName} />
          </Col>
          <Col span={4}>
            <V2DetailItem type='link' label='所在点位' value={detail.spotName} onClick={handleItem} />
          </Col>
          <Col span={4}>
            <V2DetailItem label='经营日期' value={detail.operatingTime} />
          </Col>
          <Col span={4}>
            <V2DetailItem label='日营业时段' value={detail.startAt ? `${detail.startAt}-${detail.endAt}` : '-'} />
          </Col>
          <Col span={4}>
            <V2DetailItem label='运维人员' value={detail.lhMaintainerNames} rightSlot={{
              icon: detail.permissions?.find(item => item.event === 'passengerFlow:saveMaintainer') ? <EditOutlined /> : null,
              onIconClick: showMaintainer,
            }} />
          </Col>
          <Col span={4}>
            <V2DetailItem label='经营状态' value={detail.statusName} />
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
    <ShopModal
      updateData={detail}
      visible={shopModalVisible}
      setVisible={setShopModalVisible}
      onSearch={onChange}/>
    <PermissionSelector
      title='运维人员配置'
      type='MORE'
      values={chooseUserValues}
      onClose={setChooseUserValues}
      onOk={onOkSelector}
    />
  </div>;
};

export default ATop;
