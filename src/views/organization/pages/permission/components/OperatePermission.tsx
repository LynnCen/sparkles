/* 权限操作管理 */
import { FC } from 'react';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { OperatePermissionProps } from '../ts-config';
import { refactorPermissions } from '@lhb/func';

const OperatePermission: FC<OperatePermissionProps> = ({
  changeCheckKeys,
  current,
  changeStep,
  steps,
  expendKeys,
  onOk,
}) => {
  const { ...methods } = useMethods({
    // 取消全选
    handleCancelCheck() {
      changeCheckKeys('cancelCheck', 'check');
    },
    // 全部勾选
    handleCheckAll() {
      changeCheckKeys('checkAll', 'check');
    },
    // 展开所有
    handleExpendAll() {
      expendKeys('expendAll');
    },
    // 折叠所有
    handleFoldAll() {
      expendKeys('foldAll');
    },
    handlePrevStep() {
      changeStep('prev');
    },
    handleNextStep() {
      changeStep('next');
    },
    handleDetrain() {
      onOk();
    },
  });

  return (
    <Operate
      showBtnCount={4}
      operateList={refactorPermissions([
        { name: '全部勾选', event: 'checkAll', position: 'front', type: 'default' },
        { name: '取消全选', event: 'cancelCheck', position: 'front' },
        { name: '展开所有', event: 'expendAll', position: 'front' },
        { name: '折叠所有', event: 'foldAll', position: 'front' },
        {
          name: '上一步',
          event: 'prevStep',
          type: 'default',
          disabled: current === 0,
        },
        {
          name: '下一步',
          event: 'nextStep',
          type: 'default',
          disabled: current >= steps - 1,
        },
        {
          name: '确定',
          event: 'detrain',
          type: 'primary',
          disabled: current < steps - 1,
        },
      ])}
      onClick={(btns) => methods[btns.func]()}
    />
  );
};

export default OperatePermission;