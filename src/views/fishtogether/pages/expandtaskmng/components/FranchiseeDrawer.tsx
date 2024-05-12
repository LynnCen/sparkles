/**
 * @Description 加盟商信息Drawer
 */
import { FC, useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Operate from '@/common/components/Others/V2Operate';
import { isArray, refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import EditInfoModal from './EditInfoModal';
import MoreDetail from './MoreDetail';
import TaskList from './TaskList';
import styles from '../entry.module.less';
import { franchiseeShow } from '@/common/api/fishtogether';

const { Link } = Typography;

const FranchiseeDrawer: FC<any> = ({
  open,
  setOpen,
  franchiseeId, // 加盟商id
  statusOptions, // 加盟商状态options
  onRefresh,
}) => {
  const [detail, setDetail] = useState<any>({});
  const [baseInfo, setBaseInfo] = useState<any>([]);
  const [editInfo, setEditInfo] = useState<any>({
    showModal: false,
    info: null
  });
  const [moreDetailVisible, setMoreDetailVisible] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any[]>([]);

  const loadDetail = async () => {
    const result: any = await franchiseeShow({ id: franchiseeId });
    result && setDetail(result);

    setBaseInfo([
      { label: '授权号', value: result?.authNo },
      { label: '姓名', value: result?.name },
      { label: '手机号', value: result?.contactInfo },
      { label: '意向城市', value: result?.intendedFranchiseCity },
      { label: '从事过的行业', value: result?.workedIndustry },
      { label: '客户状态', value: result?.statusName },
    ]);

    setEditInfo((state) => ({ ...state, info: result }));
    const { permissions } = result;
    if (isArray(permissions) && permissions.length) {
      const formattingPermissions = permissions.map((permissionItem: any, index: number) => ({
        ...permissionItem,
        type: index === 0 ? 'primary' : 'default'
      }));
      setPermissions(refactorPermissions(formattingPermissions));
      return;
    }
    setPermissions([]);
  };

  const methods = useMethods({
    /**
     * @description 编辑信息
     */
    handleUpdate() {
      setEditInfo({ info: detail, showModal: true });
    }
  });

  const onClose = () => {
    setDetail({});
    setOpen(false);
  };

  const onEdited = () => {
    loadDetail();
    onRefresh && onRefresh();
  };

  useEffect(() => {
    if (franchiseeId && open) {
      loadDetail();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchiseeId, open]);

  return (
    // 0511 因为更换点位匹配情况和沟通记录顺序，没有必要用容器组件了
    <V2Drawer open={open} onClose={onClose} destroyOnClose>
      <>
        <V2Title extra={
          <V2Operate
            operateList={permissions}
            onClick={(btns: { func: string | number }) => methods[btns.func]()}/>
        }>
          <div className={styles.top}>
            <span className={styles.topText}>{detail?.name}的加盟申请</span>
          </div>
        </V2Title>

        <div className={styles.baseInfo}>
          <div className={styles.titleRow}>
            <div className={styles.title}>基本信息</div>
            <Link className='fs-14' onClick={() => setMoreDetailVisible(true) }>查看详细信息 {'>'}</Link>
          </div>
          <Row gutter={16}>
            {baseInfo.map((item, index) => (
              <Col span={8} key={index}>
                <V2DetailItem label={item.label} value={item.value} />
              </Col>
            ))}
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <V2DetailItem label='特殊条款' value={detail?.specialProvisions} />
            </Col>
            <Col span={8}>
              <V2DetailItem label='备注' value={detail?.remark} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              {/* <V2DetailItem type='files' label='凭证' assets={Array.isArray(detail.paymentVoucher) ? detail.paymentVoucher.map((itm: any, idx: number) => ({ url: itm, name: `文件${idx + 1}` })) : []} /> */}
              <V2DetailItem type='files' label='凭证' assets={Array.isArray(detail.paymentVoucher) ? detail.paymentVoucher : []} />
            </Col>
          </Row>
        </div>

        <TaskList franchiseeId={detail.taskId}/>

        <EditInfoModal
          modalData={editInfo}
          loadData={onEdited}
          closeModalHandle={() => setEditInfo({
            showModal: false,
            info: null
          })}
          statusOptions={statusOptions}/>
        <MoreDetail
          open={moreDetailVisible}
          setOpen={setMoreDetailVisible}
          franchiseeName={detail?.name}
          franchiseeId={detail.taskId}/>
      </>
    </V2Drawer>
  );
};
export default FranchiseeDrawer;
