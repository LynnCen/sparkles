import { CloseOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import cs from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';

const TitleElement: FC<any> = (props) => {
  const [title, setTitle] = useState('');
  const [editable, setEditable] = useState(false);
  const input = useRef(null);
  useEffect(() => {
    setTitle(props.name);
  }, [props.name]);

  function onFocus(e: any) {
    e.currentTarget.select();
  }
  function onChange(value: any) {
    props.onTitleChange && props.onTitleChange(value);
    setTitle(value);
  }
  function onBlur() {
    setEditable(false);
    if (!title) {
      onChange('审批节点');
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
  return (
    <React.Fragment>
      {props.icon && <span className={styles.iconfont}>{props.icon}</span>}
      {editable ? (
        <input
          ref={input}
          type='text'
          className={cs(styles.antInput, styles.editableTitleInput)}
          onBlur={onBlur}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          maxLength={20}
          onFocus={onFocus}
          value={title}
          placeholder='审批节点'
        />
      ) : (
        <Popover
          content={title}
          placement='top'
          trigger={['focus', 'hover']}
          overlayStyle={{ maxWidth: 400 }}
        >
          <span className={styles.editableTitle} onClick={onClick}>
            {title}
          </span>
        </Popover>
      )}
      <CloseOutlined
        className={cs(styles.anticon, styles.anticonClose, styles.close)}
        onClick={props.delNode}
      />
    </React.Fragment>
  );
};
export default TitleElement;
