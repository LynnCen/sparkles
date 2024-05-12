/**
 * @Description 选择审批类型弹框
 */
import { FC } from 'react';
import { Modal } from 'antd';
import IconFont from '@/common/components/IconFont';
import styles from './index.module.less';
import cs from 'classnames';
import { PermissionsType, YN_PROMISSION_ENUMS } from '../../ts-config';

interface SelectTypeProps {
  visible: boolean;
  setVisible: Function;
  permissions: PermissionsType[]; // 权限列表
  usePermissionCheck:Function // 权限判断函数
  onSpotApproval?: Function; // 选择了发起点位审批
  onDesignApproval?: Function; // 选择了发起设计审批
  onContractApproval?: Function; // 选择了发起合同审批
}

const SelectType: FC<SelectTypeProps> = ({
  visible,
  permissions,
  setVisible,
  onSpotApproval,
  onDesignApproval,
  onContractApproval,
  usePermissionCheck,
}) => {

  /** 是否有发起点位审批权限 */
  const hasEvaluationPermission = usePermissionCheck(permissions, YN_PROMISSION_ENUMS.YN_APPROVAL_EVALUATION_CREATE);
  /** 是否有发起合同审批权限 */
  const hasContractPermission = usePermissionCheck(permissions, YN_PROMISSION_ENUMS.YN_APPROVAL_CONTRACT_CREATE);
  /** 是否有发起提前设计审批权限 */
  const hasDesignCreatePermission = usePermissionCheck(permissions, YN_PROMISSION_ENUMS.YN_APPROVAL_DESIGN_CREATE);


  // 发起审批可选类型
  const approvalTypes = [
    {
      permission: hasEvaluationPermission,
      name: '点位评估',
      iconHref: 'iconic_dianweipinggu',
      event: () => {
        setVisible(false);
        onSpotApproval?.();
      }
    },
    {
      permission: hasContractPermission,
      name: '提前设计',
      iconHref: 'iconic_tiqiansheji',
      event: () => {
        setVisible(false);
        onDesignApproval?.();
      }
    },
    {
      permission: hasDesignCreatePermission,
      name: '合同信息',
      iconHref: 'iconic_hetongsheji',
      event: () => {
        setVisible(false);
        onContractApproval?.();
      }
    }
  ];

  /**
   * @description 渲染发起审批选择行
   * @param config 发起审批类型的配置
   */
  const renderTypeRow = (config: any, index: number) => {
    return (
      <div key={index} className={cs(styles.row, 'mt-12')} onClick={config.event}>
        <div className={styles.rowLeft}>
          <IconFont iconHref={config.iconHref} className='fs-20' />
          <span className={cs(styles.name, 'ml-8 fs-14')}>{config.name}</span>
        </div>
        <IconFont iconHref='iconic_next_black_seven' className='fs-12' />
      </div>
    );
  };

  return (
    <Modal
      title='选择审批类型'
      open={visible}
      destroyOnClose={true}
      width={388}
      footer={null}
      centered
      wrapClassName={styles.selectApproveModal}
      onCancel={() => setVisible(false)}>
      { approvalTypes.filter((item) => item.permission).map((config: any, index: number) => renderTypeRow(config, index))}
    </Modal>
  );
};
export default SelectType;
