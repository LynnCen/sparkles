import { CloseOutlined } from '@ant-design/icons';
import cs from 'classnames';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { NodeTypes } from '../utils/flow';
import styles from '../index.module.less';
import AddNode from './Add';
import ConditionNodePopup from './ConditionNodePopup/index';
import WFC from './OperatorContext';
import Render from './Render';

const CoverLine: FC<any> = ({ first = false, last = false }) => {
  return (
    <React.Fragment>
      {first && <div className={styles.topLeftCoverLine}></div>}
      {first && <div className={styles.bottomLeftCoverLine}></div>}
      {last && <div className={styles.topRightCoverLine}></div>}
      {last && <div className={styles.bottomRightCoverLine}></div>}
    </React.Fragment>
  );
};

const BranchNode: FC<any> = (props) => {
  const { first = false, last = false } = props;
  const [title, setTitle] = useState('');
  const [editable, setEditable] = useState(false);
  const input = useRef(null);
  const { updateNode, detail }: any = useContext(WFC);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTitle(props.name);
  }, []);

  function onFocus(e: any) {
    e.currentTarget.select();
  }
  function onChange(value: any) {
    props.objRef.name = value;
    setTitle(value);
    updateNode();
  }
  function onBlur() {
    setEditable(false);
    if (!title) {
      onChange('条件');
    }
  }
  function onClick() {
    setEditable(true);
  }
  useEffect(() => {
    if (editable) {
      input.current && (input.current as any).focus();
    }
  }, [editable]);

  function onConditionClick(objRef: any) {
    if (detail) return;
    setVisible(true);
    props.onBranchClick(objRef);
  }

  function onSubmit(obj: any) {
    Object.assign(props.objRef, obj);
    setTitle(obj.name);
    updateNode();
    setVisible(false);
  }

  return (
    <div className={styles.conditionNode}>
      <div className={styles.conditionNodeBox}>
        <div className={styles.autoJudge}>
          {!first && (
            <div className={styles.sortLeft} onClick={props.sortLeft}></div>
          )}

          <div className={styles.titleWrapper}>
            {detail ? (
              <span className={styles.editableDetailTitle}>{title}</span>
            ) : editable ? (
              <input
                ref={input}
                type='text'
                className={cs(styles.antInput, styles.editableTitleInput)}
                onBlur={onBlur}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                onFocus={onFocus}
                value={title}
                maxLength={20}
                placeholder='条件'
              />
            ) : (
              <span className={styles.editableTitle} onClick={onClick}>
                {title}
              </span>
            )}

            {/* <span className='priorityTitle'>优先级{props.priorityLevel}</span> */}
            {!detail && (
              <CloseOutlined
                className={cs(
                  styles.anticon,
                  styles.anticonClose,
                  styles.close,
                )}
                onClick={props.delBranch}
              />
            )}
          </div>
          {!last && (
            <div className={styles.sortRight} onClick={props.sortRight}></div>
          )}
          <div
            className={styles.content}
            onClick={() => onConditionClick(props.objRef)}
          >
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html:
                  props.desc || '<span style=color:#bfbfbf>请设置条件</span>',
              }}
            />
            {/* <i className="anticon anticon-right arrow"></i> */}
          </div>
        </div>
        <AddNode objRef={props.objRef} />
      </div>
      <ConditionNodePopup
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onSubmit={onSubmit}
        objRef={props.objRef}
      ></ConditionNodePopup>
    </div>
  );
};

const ConditionNode: FC<any> = ({
  conditionNodes: branches = [],
  ...restProps
}) => {
  const { onAddNode, onDeleteNode, onSelectNode, detail }: any =
    useContext(WFC);
  const addBranch = () => {
    onAddNode(NodeTypes.BRANCH, restProps.pRef, restProps.objRef);
  };
  const delBranch = (i: any) => {
    if (branches.length === 2) {
      onDeleteNode(restProps.pRef, restProps.objRef);
      return;
    }
    console.log('delBranch(i)', i);
    onDeleteNode(restProps.pRef, restProps.objRef, NodeTypes.BRANCH, i);
  };

  const onBranchClick = (objRef: any) => {
    onSelectNode(restProps.objRef, objRef);
  };

  return (
    branches &&
    branches.length > 0 && (
      <div className={styles.branchWrap}>
        <div className={styles.branchBoxWrap}>
          <div className={styles.branchBox}>
            {!detail && (
              <button
                type='button'
                className={styles.addBranch}
                onClick={addBranch}
              >
                添加条件
              </button>
            )}
            {branches.map((item: any, index: any) => {
              return (
                <div className={styles.colBox} key={index.toString()}>
                  <BranchNode
                    placeholder={item.name}
                    {...item}
                    first={index === 0}
                    onBranchClick={onBranchClick}
                    delBranch={() => delBranch(index)}
                    last={index === branches.length - 1}
                    objRef={item}
                  />
                  {item.childNode && (
                    <Render pRef={item} config={item.childNode} />
                  )}
                  <CoverLine
                    first={index === 0}
                    last={index === branches.length - 1}
                  />
                </div>
              );
            })}
          </div>
          <AddNode objRef={restProps.objRef} />
        </div>
      </div>
    )
  );
};

export default ConditionNode;
