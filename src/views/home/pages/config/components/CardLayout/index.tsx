/**
 * @Description
 */
import React, { ReactElement, ReactNode } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
interface CardLayoutProps {
  title: string | ReactNode;
  children: ReactNode | ReactElement,
  style?:React.CSSProperties;
  className?:string
}
export function CardLayout(props: CardLayoutProps) {
  const { title, children, style, className } = props;

  return <section className={styles.cardLayout} style={style}>
    <header className={styles.header}>{title}</header>
    <section className={cs(styles.container, className)}>{children}</section>
  </section>;

}
