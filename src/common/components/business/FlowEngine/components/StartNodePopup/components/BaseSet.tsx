import { FC } from 'react';

import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import { useVisible } from '../../../hooks';
import ButtonWithTag from '../../Button/ButtonWithTag';
import ContainerHeader from '../..//ContainerHeader';
import PermissionSelector from '../..//Modal/PermissionSelector';
import PositionSelector from '../../Modal/PositionSelector';
import RoleSelector from '../..//Modal/RoleSelector';

const BaseSet: FC<any> = ({ objRef, setCopyObjRef }) => {
  // 添加用户
  const { onShow: onShowUser, onHidden: onHiddenUser, visible: visibleUser } = useVisible(false);

  // 添加岗位
  const { onShow: onShowPosition, onHidden: onHiddenPosition, visible: visiblePosition } = useVisible(false);

  // 添加角色
  const { onShow: onShowRole, onHidden: onHiddenRole, visible: visibleRole } = useVisible(false);

  const methods = useMethods({
    onRoleSelected(roles: any) {
      setCopyObjRef({ ...objRef, roleIds: roles });
      onHiddenRole();
    },
    onUserSelected(users: any) {
      setCopyObjRef({ ...objRef, employeeIds: users });
      onHiddenUser();
    },
    onPositionSelected(positions: any) {
      setCopyObjRef({ ...objRef, positionIds: positions });
      onHiddenPosition();
    }
  });
  return (
    <>
      <ContainerHeader title={'发起人'} />
      <div className={styles.container}>

        <ButtonWithTag key={'添加角色'} className={styles.mt16} tags={objRef.roleIds} onClick={onShowRole} title={'添加角色'} onTagClose={methods.onRoleSelected} />

        <ButtonWithTag key={'添加岗位'} className={styles.mt16} tags={objRef.positionIds} onClick={onShowPosition} title={'添加岗位'} onTagClose={methods.onPositionSelected} />

        <ButtonWithTag key={'添加用户'} className={styles.mt16} tags={objRef.employeeIds} onClick={onShowUser} onTagClose={methods.onUserSelected} title={'添加用户'} />
      </div>

      <PermissionSelector
        title='添加成员'
        visible={visibleUser}
        users={objRef.employeeIds}
        onClose={onHiddenUser}
        onOk={methods.onUserSelected}
      />

      <PositionSelector
        title='添加岗位'
        visible={visiblePosition}
        positions={objRef.positionIds}
        onClose={onHiddenPosition}
        onOk={methods.onPositionSelected}
      />

      <RoleSelector
        title='添加角色'
        visible={visibleRole}
        roles={objRef.roleIds}
        onClose={onHiddenRole}
        onOk={methods.onRoleSelected}
      />
    </>
  );
};

export default BaseSet;
