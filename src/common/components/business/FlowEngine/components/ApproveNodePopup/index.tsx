import { getStorage } from '@lhb/cache';
import { deepCopy } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Button, Drawer, Form, Space, Tabs, message } from 'antd';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import WFC from '../OperatorContext';
import AdvanceSet from './components/AdvanceSet';
import BaseSet from './components/BaseSet';
import FormFieldsSet from './components/FormFieldsSet';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const ApproveNodePopup: FC<any> = ({ visible, onClose, onSubmit, objRef }) => {
  const [form] = Form.useForm();
  const flowNodes = getStorage('flowNodes');
  const [rejectNodeOptions, setRejectNodeOptions] = React.useState<any[]>([]); // 驳回节点下拉框选项
  const [activeKey, setActiveKey] = React.useState<string>('base');
  const [copyObjRef, setCopyObjRef] = useState<any>({});
  const { selection, nodeArr }: any = useContext(WFC);

  // 所有节点的code数组
  const _nodeCodeArr = useMemo(() => {
    return Array.isArray(nodeArr)
      ? nodeArr.map((item: { nodeCode: string }) => item.nodeCode)
      : [];
  }, [nodeArr]);

  // console.log('_nodeCodeArr', _nodeCodeArr, objRef, objRef.rejectNode);

  const approveNodeItems: any[] = [
    {
      label: '基础设置',
      key: 'base',
      children: (
        <BaseSet
          setCopyObjRef={setCopyObjRef}
          selection={selection}
          objRef={copyObjRef}
        />
      ),
    },
    {
      label: '高级设置',
      key: 'advance',
      children: (
        <AdvanceSet
          setCopyObjRef={setCopyObjRef}
          objRef={copyObjRef}
          rejectNodeOptions={rejectNodeOptions}
          form={form}
        />
      ),
    },
    {
      label: '表单权限',
      key: 'formFields',
      children: (
        <FormFieldsSet setCopyObjRef={setCopyObjRef} objRef={copyObjRef} />
      ),
    },
  ];

  // 查找当前节点之前的所有节点
  const nodesBefore: any[] = [];
  function findNodesBefore(nodeCode: string, data: any[]) {
    data.find(
      (node: { nodeCode: string; nextNode: string[]; prevNode: string[] }) => {
        if (node.nextNode.includes(nodeCode) && !nodesBefore.includes(node)) {
          nodesBefore.push(node);
          if (node.prevNode.length) {
            findNodesBefore(node.nodeCode, data);
          }
        }
      },
    );

    return nodesBefore;
  }

  useEffect(() => {
    if (visible) {
      setCopyObjRef(deepCopy(objRef));
      form.setFieldValue('nodeTitle', objRef.name);
      // console.log('objRef', objRef, flowNodes);
      const nodesBefore = findNodesBefore(objRef.nodeCode, flowNodes);
      // 过滤type为2的节点，并转成下拉框需要的格式
      const _nodesBefore = nodesBefore
        .filter((item: any) => item.type !== 2)
        .map((opt: any) => ({
          label: opt.name,
          value: opt.nodeCode,
          key: opt.nodeCode,
        }));
      setRejectNodeOptions(_nodesBefore);
      // console.log('nodesBefore', nodesBefore, _nodesBefore, rejectNodeOptions);
    }
  }, [visible]);

  useEffect(() => {
    // 如果驳回节点不在流程节点中，则清空驳回节点
    if (objRef.rejectNode && !_nodeCodeArr.includes(objRef.rejectNode)) {
      message.error({
        content: `<${objRef.name}>节点配置中的驳回节点不在流程中，请重新选择`,
        key: 'rejectNode', // 设置key，防止重复弹出
      });
      setCopyObjRef({ ...objRef, rejectNode: null });
      form.resetFields(); // rejectNode为了提示未填改成form接管形式，需要重置表单
      // 手动调用onSubmit，保存节点信息
      onSubmit({ ...copyObjRef, desc: methods.getContent() });
    }
  }, [_nodeCodeArr]);

  const methods = useMethods({
    nodeNameChange(e: { target: { value: any } }) {
      const value = e.target.value;
      setCopyObjRef({ ...copyObjRef, name: value });
    },
    nodeNameBlur(e: { target: { value: any } }) {
      const value = e.target.value;
      !value && setCopyObjRef({ ...copyObjRef, name: '审批节点' });
    },
    getContent() {
      const {
        roleIds = [],
        positionIds = [],
        employeeIds = [],
        approverType,
        sponsorMangerLevel,
      } = copyObjRef;
      let desc = '';
      switch (approverType) {
        case 1:
          roleIds.length &&
            (desc += `<div >角色：${roleIds
              .map((item: any) => item.name)
              .join('、')} </div>`);
          positionIds.length &&
            (desc += `<div>岗位：${positionIds
              .map((item: any) => item.name)
              .join('、')} </div>`);
          employeeIds.length &&
            (desc += `<div>用户：${employeeIds
              .map((item: any) => item.name)
              .join('、')} </div>`);
          break;
        case 2:
          desc += `<div>发起人主管：${
            sponsorMangerLevel === 1
              ? '直接上级'
              : `第${sponsorMangerLevel}级主管`
          } </div>`;
          break;
        case 3:
          desc += `<div>部门主管</div>`;
          break;
        case 4:
          desc += `<div>发起人自选</div>`;
          break;
        case 5:
          desc += `<div>发起人自己</div>`;
          break;
      }
      return desc;
    },
    onApproveSubmit() {
      if (
        copyObjRef.buttons.find(
          (item: { code: string }) => item.code === 'rebut',
        ).enable &&
        !copyObjRef?.rejectNode
      ) {
        setActiveKey('advance');
        setTimeout(() => {
          form.validateFields();
        }, 200);
        message.error('请选择驳回节点');
        return;
      }
      onSubmit({ ...copyObjRef, desc: this.getContent() });
    },
    changeTab(key: string) {
      setActiveKey(key);
    },
  });
  return (
    <>
      <Drawer
        className={styles.drawer}
        title={
          // <Input
          //   style={{ width: 180 }}
          //   placeholder='请输入节点名称'
          //   maxLength={20}
          //   value={copyObjRef.name}
          //   onChange={methods.nodeNameChange}
          //   onBlur={methods.nodeNameBlur}
          // />
          <Form form={form} validateTrigger={['onChange', 'onBlur']}>
            <V2DetailItem
              label='节点名称'
              allowEdit
              value={copyObjRef.name}
              editConfig={{
                formCom: <V2FormInput
                  name='nodeTitle'
                  // rules={[{ required: true, message: '请输入节点名称' }]}
                />,
                onCancel() {
                  form.setFieldValue('nodeTitle', copyObjRef.name);
                },
                onOK() {
                  const name = form.getFieldValue('nodeTitle');
                  form.setFieldValue('nodeTitle', name);
                  setCopyObjRef({ ...copyObjRef, name: name || '审批节点' });
                }
              }}
            />
          </Form>
        }
        closable={false}
        onClose={onClose}
        open={visible}
        width={680}
        footer={
          <Space
            align='center'
            style={{ width: '100%', justifyContent: 'right' }}
          >
            <Button onClick={onClose}>取消</Button>
            <Button type='primary' onClick={methods.onApproveSubmit}>
              确定
            </Button>
          </Space>
        }
      >
        {!!Object.keys(copyObjRef).length && (
          <Tabs
            className={styles.tabs}
            items={approveNodeItems}
            activeKey={activeKey}
            onChange={methods.changeTab}
          />
        )}
      </Drawer>
    </>
  );
};

export default ApproveNodePopup;
