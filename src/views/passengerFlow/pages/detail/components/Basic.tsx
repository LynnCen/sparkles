import { FC, useState } from 'react';
import { StoreDetail, StoreStatus, PermissionEvent } from '../ts-config';
import styles from '../entry.module.less';
import cs from 'classnames';
import ShopModal from '@/views/passengerFlow/components/ShopModal';
import { valueFormat } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import Operate from '@/common/components/Operate';
import { postBatchDelete } from '@/common/api/passenger-flow';
import { message } from 'antd';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { EditOutlined } from '@ant-design/icons';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import { post } from '@/common/request';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

interface BasicProps {
  detail: StoreDetail | null;
  onChange: Function;
}

const Basic: FC<BasicProps> = ({
  detail,
  onChange
}) => {
  const [shopModalVisible, setShopModalVisible] = useState<boolean>(false);
  // 选择成员
  const [chooseUserValues, setChooseUserValues] = useState<any>({
    visible: false,
    users: [],
  });
  const items = [
    { title: '品牌名称', name: 'brandName', value: detail?.brandName },
    { title: '所在点位', name: 'spotName', value: detail?.spotName, linkable: !!detail?.spotId },
    { title: '经营日期', name: 'date', value: detail?.operatingTime },
    { title: '日营业时段', name: 'date', value: detail?.startAt ? `${detail?.startAt}-${detail?.endAt}` : '-' },
    { title: '运维人员', name: 'lhMaintainerNames', render: () => {
      return <>
        {detail?.lhMaintainerNames}
        {
          detail?.permissions?.find(item => item.event === 'passengerFlow:saveMaintainer') && <span className={styles.editMaintainer} onClick={methods.showMaintainer}><EditOutlined /></span>
        }
      </>;
    } },
    { title: '经营状态', name: 'statusName', value: detail?.statusName, highlight: detail?.status === StoreStatus.OPERATION },
  ];

  const methods = useMethods({
    operateBtns: () => {
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
    },

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
    handleItem(item: any) {
      if (item.name === 'spotName') {
        detail && detail.spotId && methods.toSpot(detail);
      }
    },
    toSpot(res) {
      // 采用window.open在新页面打开
      window.open(`/resmng/real-detail?id=${res.placeId}&resourceType=1&categoryId=${res.spotCategoryId}&isKA=false&activeKey=${res.spotId}`, '_blank');
      // dispatchNavigate(`/resmng/real-detail?id=${res.placeId}&resourceType=1&categoryId=${res.spotCategoryId}&isKA=false&activeKey=${res.spotId}`);
    },
    showMaintainer() {
      // https://yapi.lanhanba.com/project/434/interface/api/44295
      setChooseUserValues({ visible: true, users: detail?.lhMaintainers });
    },
    // 确定选择成员
    onOkSelector({ users, visible }) {
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
    }
  });

  return (
    <>
      <div className={styles.basicContainer}>
        <div className={styles.sectionTitle}>{detail?.name}
          {
            detail?.typeName ? <span className={styles.typeName}>{detail?.typeName}</span> : undefined
          }
        </div>
        <div className={styles.itemsWrapper}>
          {
            Array.isArray(items) && items.map((itm:any, index: number) => (
              <div className={styles.item} key={index}>
                <div className={styles.itemTitle}>{itm.title}</div>
                <div className={cs(styles.itemValue, itm.highlight ? styles.highlight : itm.linkable ? styles.linkable : '')} onClick={() => itm.linkable && methods.handleItem(itm)}>
                  {itm.render ? itm.render() : valueFormat(itm.value)}
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.buttonsWrapper}>
          <Operate
            operateList={methods.operateBtns()}
            onClick={(btn: FormattingPermission) => methods[btn.func]()} />
        </div>
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
        onOk={methods.onOkSelector}
      />
    </>
  );
};

export default Basic;
