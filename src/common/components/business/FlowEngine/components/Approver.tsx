import { useMethods } from '@lhb/hook';
import Popover from 'antd/lib/popover';
import cs from 'classnames';
import { FC, useContext, useState } from 'react';
import styles from '../index.module.less';
import ApproveNodePopup from './ApproveNodePopup/index';
import WFC from './OperatorContext';
import TitleElement from './TitleElement';
import NodeWrap from './Wrap';

const ApproverNode: FC<any> = (props) => {
  const { onDeleteNode, onSelectNode, updateNode, detail }: any =
    useContext(WFC);
  const [visible, setVisible] = useState(false);

  const methods = useMethods({
    delNode() {
      onDeleteNode(props.pRef, props.objRef);
    },
    onChange(val: any) {
      props.pRef.childNode.name = val;
      updateNode();
    },
    onApproveClick() {
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

  // TODO: 这里读取props数据
  const TitleEl = detail ? (
    <Popover
      content={props.name}
      placement='top'
      trigger={['focus', 'hover']}
      overlayStyle={{ maxWidth: 400 }}
    >
      <span className={styles.editableTitle}>{props.name}</span>
    </Popover>
  ) : (
    <TitleElement
      delNode={methods.delNode}
      name={props.name}
      onTitleChange={methods.onChange}
    />
  );
  return (
    <>
      <NodeWrap
        detail={detail}
        titleStyle={{ backgroundColor: '#006AFF' }}
        onContentClick={methods.onApproveClick}
        title={TitleEl}
        objRef={props.objRef}
      >
        <Popover
          content={
            <div
              dangerouslySetInnerHTML={{ __html: props.desc || '请选择审核人' }}
            />
          }
          placement='bottomLeft'
          trigger={['focus', 'hover']}
          overlayStyle={{ maxWidth: 400 }}
        >
          <div
            className={styles.textParent}
            dangerouslySetInnerHTML={{ __html: props.desc || '请选择审核人' }}
          />
        </Popover>
        <i
          className={cs(styles.anticon, styles.anticonRight, styles.arrow)}
        ></i>
      </NodeWrap>
      <ApproveNodePopup
        visible={visible}
        onClose={methods.onClose}
        onSubmit={methods.onSubmit}
        objRef={props.objRef}
      />
    </>
  );
};
export default ApproverNode;
