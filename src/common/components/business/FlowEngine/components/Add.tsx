import { PlusOutlined } from '@ant-design/icons';
import { Divider, Popover } from 'antd';
import { FC, useContext, useState } from 'react';

import { OptionNames, OptionTypes } from '../utils/flow';
import styles from '../index.module.less';
import WFC from './OperatorContext';

const AddNode: FC<any> = (props) => {
  const [open, setOpen] = useState(false);
  const { onAddNode, detail }: any = useContext(WFC);

  const hide = () => {
    setOpen(false);
  };

  function onOptionClick(type: any) {
    onAddNode(type, props.pRef, props.objRef);
    hide();
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const content: any = (
    <>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => onOptionClick(OptionTypes.APPROVER)}
      >
        {OptionNames[OptionTypes.APPROVER]}
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => onOptionClick(OptionTypes.CONDITION)}
      >
        {OptionNames[OptionTypes.CONDITION]}
      </div>
    </>
  );
  return (
    <div className={styles.addNodeBtnBox}>
      <div className={styles.addNodeBtn}>
        <Popover
          content={content}
          open={open}
          placement='right'
          trigger={['click']}
          getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
          onOpenChange={handleOpenChange}
        >
          {!detail && (
            <button type='button' className={styles.btn}>
              <PlusOutlined style={{ color: '#fff' }} />
            </button>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default AddNode;
