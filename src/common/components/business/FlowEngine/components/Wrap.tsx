import { FC } from 'react';
import { NodeTypes } from '../utils/flow';
import AddNode from './Add';
import { CheckOutlined } from '@ant-design/icons';
import styles from '../index.module.less';
import cs from 'classnames';
// import React from 'react';

const NodeWrap: FC<any> = (props) => {
  const statusBackgroundMap: any = {
    1: '#006AFF',
    2: 'rgba(0,106,255,0.5)',
    3: '#F23030',
    4: '#999999'
  };
  const style = { width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%', marginRight: '8px' };

  const statusIconMap = {
    1: <div style={style} />,
    2: <CheckOutlined style={{ fontSize: '12px', marginRight: '8px' }} />,
    3: <div style={style} />,
    4: <div style={style} />,
  };

  const backgroundColor = props.detail ? statusBackgroundMap[props.objRef.status || 4] : '';

  return (
    <div>
      <div className={styles.nodeWrap}>
        <div className={cs(styles.nodeWrapBox, props.type === NodeTypes.START ? styles.startNode : '')} >
          <div className={styles.title} style={backgroundColor ? { backgroundColor } : props.titleStyle}>
            {props.detail && statusIconMap[props.objRef.status || 4]}
            {props.title}
          </div>
          <div className={styles.content} onClick={props.onContentClick}>
            {props.children}
          </div>
        </div>
        <div className={styles.nodeCircle}></div>
        <AddNode objRef={props.objRef} />
      </div>

    </div>
  );
};
export default NodeWrap;
