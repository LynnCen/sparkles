import ButtonWithTag from '../../Button/ButtonWithTag';
import ContainerHeader from '../../ContainerHeader';
import PermissionSelector from '../../Modal/PermissionSelector';
import PositionSelector from '../../Modal/PositionSelector';
import RoleSelector from '../../Modal/RoleSelector';
import { useVisible } from '../../../hooks';
import { useMethods } from '@lhb/hook';
import { Checkbox, Divider, Radio, Select, Space } from 'antd';
import { FC, useState } from 'react';
import styles from './index.module.less';

// const countersignType:any[] = [{ value: 1, name: '加签' },];

const BaseSet: FC<any> = ({ objRef, setCopyObjRef, selection }) => {
  // 添加用户
  const {
    onShow: onShowUser,
    onHidden: onHiddenUser,
    visible: visibleUser,
  } = useVisible(false);

  // 添加岗位
  const {
    onShow: onShowPosition,
    onHidden: onHiddenPosition,
    visible: visiblePosition,
  } = useVisible(false);

  // 添加角色
  const {
    onShow: onShowRole,
    onHidden: onHiddenRole,
    visible: visibleRole,
  } = useVisible(false);

  // 是选择审批人还是抄送人
  const [popupType, setPopupType] = useState<string>('approve');

  const methods = useMethods({
    onRoleShow(type: any) {
      setPopupType(type);
      onShowRole();
    },
    onUserShow(type: any) {
      setPopupType(type);
      onShowUser();
    },
    onPositionShow(type: any) {
      setPopupType(type);
      onShowPosition();
    },
    onRoleSelected(roles: any) {
      setCopyObjRef({
        ...objRef,
        [popupType === 'approve' ? 'roleIds' : 'ccRoleIds']: roles,
      });
      onHiddenRole();
    },
    onCCRoleIdsSelected(roles: any) {
      setCopyObjRef({
        ...objRef,
        ccRoleIds: roles,
      });
      onHiddenRole();
    },
    onUserSelected(users: any) {
      setCopyObjRef({
        ...objRef,
        [popupType === 'approve' ? 'employeeIds' : 'ccEmployeeIds']: users,
      });
      onHiddenUser();
    },
    onCCEmployeeIdsSelected(users: any) {
      setCopyObjRef({
        ...objRef,
        ccEmployeeIds: users,
      });
      onHiddenUser();
    },
    onPositionSelected(positions: any) {
      setCopyObjRef({
        ...objRef,
        [popupType === 'approve' ? 'positionIds' : 'ccPositionIds']: positions,
      });
      onHiddenPosition();
    },
    onCCPositionIdsSelected(positions: any) {
      setCopyObjRef({
        ...objRef,
        ccPositionIds: positions,
      });
      onHiddenPosition();
    },
    onApproverTypeChange(e: any) {
      setCopyObjRef({ ...objRef, approverType: e.target.value });
    },
    onApproveTypeChange(e: any) {
      setCopyObjRef({ ...objRef, approveType: e.target.value });
    },
    onCountersignTypeChange(e: any) {
      setCopyObjRef({ ...objRef, countersign: e.target.checked });
    },
    handleAuthApproveChange(value: any) {
      setCopyObjRef({ ...objRef, autoApprove: value });
    },
    handleSuperiorApproveChange(event: any) {
      setCopyObjRef({ ...objRef, superiorApprove: event.target.checked });
    },
    handleSponsorMangerLevelChange(value: any) {
      setCopyObjRef({ ...objRef, sponsorMangerLevel: value });
    },
    onCcTypeTypeChange(e: any) {
      setCopyObjRef({ ...objRef, ccType: e.target.value });
    },
  });
  return (
    <>
      <ContainerHeader title={'审批人'} />
      <div className={styles.container}>
        <Radio.Group
          onChange={methods.onApproverTypeChange}
          value={objRef.approverType}
        >
          {selection.approverType &&
            selection.approverType.map((item: any, index: number) => {
              return (
                <Radio key={index} value={item.value}>
                  {item.name}
                </Radio>
              );
            })}
        </Radio.Group>
        {objRef.approverType === 1 && (
          <>
            <ButtonWithTag
              key={'添加角色'}
              className={styles.mt16}
              tags={objRef.roleIds}
              onClick={() => {
                methods.onRoleShow('approve');
              }}
              title={'添加角色'}
              onTagClose={methods.onRoleSelected}
            />

            <ButtonWithTag
              key={'添加岗位'}
              className={styles.mt16}
              tags={objRef.positionIds}
              onClick={() => {
                methods.onPositionShow('approve');
              }}
              title={'添加岗位'}
              onTagClose={methods.onPositionSelected}
            />

            <ButtonWithTag
              key={'添加用户'}
              className={styles.mt16}
              tags={objRef.employeeIds}
              onClick={() => {
                methods.onUserShow('approve');
              }}
              onTagClose={methods.onUserSelected}
              title={'添加用户'}
            />
          </>
        )}
        {objRef.approverType === 2 && (
          <div>
            <Space className={styles.mt16}>
              <span>发起人的</span>
              <Select
                value={objRef.sponsorMangerLevel}
                style={{ width: 160 }}
                onChange={methods.handleSponsorMangerLevelChange}
                fieldNames={{ label: 'name' }}
                options={selection.sponsorManagerLevel}
              />
            </Space>
          </div>
        )}
        { objRef.approverType === 3 && (
          <Space className={styles.mt16}>
            <Checkbox checked={objRef.superiorApprove} onChange={methods.handleSuperiorApproveChange}>找不到本部门主管时，由上级部门主管代审批</Checkbox>
          </Space>
        ) }
        <Space className={styles.mt16}>
          <span>审批人若为空或离职</span>
          <Select
            value={objRef.autoApprove}
            style={{ width: 160 }}
            onChange={methods.handleAuthApproveChange}
            fieldNames={{ label: 'name', value: 'value' }}
            options={selection.autoApprove}
          />
        </Space>
      </div>
      <Divider />
      <ContainerHeader className={styles.mt16} title={'审批方式'} />
      <div className={styles.container}>
        <Radio.Group
          onChange={methods.onApproveTypeChange}
          value={objRef.approveType}
        >
          <Space direction='vertical'>
            {selection.approveType &&
              selection.approveType.map((item: any, index: number) => {
                return (
                  <Radio key={index} value={item.value}>
                    {item.name}
                  </Radio>
                );
              })}
          </Space>
        </Radio.Group>
      </div>
      <Divider />
      <ContainerHeader className={styles.mt16} title={'加签'} />
      <div className={styles.container}>
        <Checkbox
          onChange={methods.onCountersignTypeChange}
          checked={!!objRef.countersign}
        >
          允许加签
        </Checkbox>
      </div>
      <Divider />
      <ContainerHeader className={styles.mt16} title={'抄送'} />
      <div className={styles.container}>
        <Radio.Group
          onChange={methods.onCcTypeTypeChange}
          value={objRef.ccType}
        >
          {selection.ccType &&
            selection.ccType.map((item: any, index: number) => {
              return (
                <Radio key={index} value={item.value}>
                  {item.name}
                </Radio>
              );
            })}
        </Radio.Group>
        {objRef.ccType === 1 && (
          <>
            <ButtonWithTag
              key={'添加角色'}
              className={styles.mt16}
              tags={objRef.ccRoleIds}
              onClick={() => {
                methods.onRoleShow('cc');
              }}
              title={'添加角色'}
              onTagClose={methods.onCCRoleIdsSelected}
            />

            <ButtonWithTag
              key={'添加岗位'}
              className={styles.mt16}
              tags={objRef.ccPositionIds}
              onClick={() => {
                methods.onPositionShow('cc');
              }}
              title={'添加岗位'}
              onTagClose={methods.onCCPositionIdsSelected}
            />

            <ButtonWithTag
              key={'添加用户'}
              className={styles.mt16}
              tags={objRef.ccEmployeeIds}
              onClick={() => {
                methods.onUserShow('cc');
              }}
              onTagClose={methods.onCCEmployeeIdsSelected}
              title={'添加用户'}
            />
          </>
        )}
      </div>
      <PermissionSelector
        title='添加成员'
        visible={visibleUser}
        users={
          popupType === 'approve' ? objRef.employeeIds : objRef.ccEmployeeIds
        }
        onClose={onHiddenUser}
        onOk={methods.onUserSelected}
      />

      <PositionSelector
        title='添加岗位'
        visible={visiblePosition}
        positions={
          popupType === 'approve' ? objRef.positionIds : objRef.ccPositionIds
        }
        onClose={onHiddenPosition}
        onOk={methods.onPositionSelected}
      />

      <RoleSelector
        title='添加角色'
        visible={visibleRole}
        roles={popupType === 'approve' ? objRef.roleIds : objRef.ccRoleIds}
        onClose={onHiddenRole}
        onOk={methods.onRoleSelected}
      />
    </>
  );
};

export default BaseSet;
