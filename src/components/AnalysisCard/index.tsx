/**
 * @Author Pull
 * @Date 2021-09-14 15:53
 * @project reportCard
 */
import React, { CSSProperties } from 'react';
import { Card } from 'antd';
import styles from './styles.less';
import classNames from 'classnames';

interface IProps {
  title: string;
  percent: number;
  ratio: number;
  isUp?: boolean;
  isDown?: boolean;
  bodyStyle?: CSSProperties;
  wrapStyle?: CSSProperties;
}

export default (props: IProps) => {
  return (
    <section style={props.wrapStyle || {}}>
      <Card bodyStyle={Object.assign({ padding: 14 }, props.bodyStyle || {})}>
        <section>
          <h4>{props.title}</h4>
          <strong>{props.percent}%</strong>
          <p className={styles.detail}>
            <span>同比{props.ratio}%</span>
            <span className={styles.iconContainer}>
              {props.isUp && <i className={classNames(styles.icon, styles.up)} />}
              {props.isDown && <i className={classNames(styles.icon, styles.down)} />}
            </span>
          </p>
        </section>
      </Card>
    </section>
  );
};
