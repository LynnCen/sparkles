import { deepCopy } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Button, Drawer, Space, Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import AdvanceSet from './components/AdvanceSet';
import BaseSet from './components/BaseSet';
import FormFieldsSet from './components/FormFieldsSet';
import styles from './index.module.less';

const StartNodePopup: FC<any> = ({ visible, onClose, onSubmit, objRef }) => {
  const [copyObjRef, setCopyObjRef] = useState<any>({});

  const startNodeItems: any[] = [
    {
      label: '基础设置',
      key: 'base',
      children: <BaseSet setCopyObjRef={setCopyObjRef} objRef={copyObjRef} />,
    },
    {
      label: '高级设置',
      key: 'advance',
      children: (
        <AdvanceSet setCopyObjRef={setCopyObjRef} objRef={copyObjRef} />
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

  useEffect(() => {
    visible && setCopyObjRef(deepCopy(objRef));
  }, [visible]);

  const methods = useMethods({
    getContent() {
      const { roleIds = [], positionIds = [], employeeIds = [] } = copyObjRef;
      let desc = '';
      roleIds.length &&
        (desc += `<div>角色：${roleIds
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

      return desc;
    },
    onStartSubmit() {
      onSubmit({ ...copyObjRef, desc: this.getContent() });
    },
  });

  return (
    <>
      <Drawer
        className={styles.drawer}
        title='发起节点'
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
            <Button type='primary' onClick={methods.onStartSubmit}>
              确定
            </Button>
          </Space>
        }
      >
        {!!Object.keys(copyObjRef).length && (
          <Tabs className={styles.tabs} items={startNodeItems} />
        )}
      </Drawer>
    </>
  );
};

export default StartNodePopup;
