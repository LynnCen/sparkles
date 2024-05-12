import { useMethods } from '@lhb/hook';
import { Popover } from 'antd';
import cs from 'classnames';
import { FC, useContext, useState } from 'react';
import styles from '../index.module.less';
import WFC from './OperatorContext';
import StartNodePopup from './StartNodePopup/index';
import NodeWrap from './Wrap';

const StartNode: FC<any> = (props) => {
  const { onSelectNode, updateNode, detail }: any = useContext(WFC);

  const [visible, setVisible] = useState(false);

  const methods = useMethods({
    onStartClick() {
      if (detail) return;
      onSelectNode(props.pRef, props.objRef);
      setVisible(true);
    },
    onClose() {
      setVisible(false);
    },
    onSubmit(obj: any) {
      Object.assign(props.objRef, obj);
      updateNode();
      setVisible(false);
    },
  });

  return (
    <>
      <NodeWrap
        type={0}
        objRef={props.objRef}
        detail={detail}
        onContentClick={methods.onStartClick}
        title={<span>{props.name}</span>}
      >
        <Popover
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: props.objRef.desc || '所有人',
              }}
            />
          }
          placement='bottom'
          trigger={['focus', 'hover']}
          overlayStyle={{ maxWidth: 400 }}
        >
          <div
            className={styles.textParent}
            dangerouslySetInnerHTML={{ __html: props.objRef.desc || '所有人' }}
          />
        </Popover>
        <i
          className={cs(styles.anticon, styles.anticonRight, styles.arrow)}
        ></i>
      </NodeWrap>
      <StartNodePopup
        visible={visible}
        onClose={methods.onClose}
        onSubmit={methods.onSubmit}
        objRef={props.objRef}
      ></StartNodePopup>
    </>
  );
};
export default StartNode;
