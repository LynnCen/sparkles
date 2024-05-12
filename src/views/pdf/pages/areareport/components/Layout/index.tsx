import React, { ReactElement, ReactNode } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { ChildreClass } from '../../ts-config';
import IconFont from '@/common/components/IconFont';

interface PageLayoutProps {
  // childClass:string;
  children: ReactNode | ReactElement,
  childClass?:string,
  isUnShow?:boolean;
}

export const PageLayout: React.FC<PageLayoutProps & PageHeaderProps &PageFooterProps> = (props) => {
  const { title, children, childClass, logo, isUnShow } = props;
  return <div className={cs(childClass ?? ChildreClass, styles.pageLayoutWrapper)} data-un-show={isUnShow || ''}>
    <div className={cs(styles.pageLayout)}>
      <div className={styles.pageLayoutInner}>
        <PageHeader title={title}/>
        <div className={styles.container}>{children}</div>
      </div>
      <PageFooter logo={logo} />
    </div>
  </div>;
};
// header第一版 带模块数和页数
// interface PageHeaderProps {
//   currentPage?:number;
//   totalPage?:number;
//   title:string;
//   moduleCount:number

// }
// export const PageHeader: React.FC<PageHeaderProps> = (props) => {
//   const { moduleCount, title } = props;
//   return <div className={styles.headerWrapper}>
//     <div className={styles.leftText}>
//       <div className={styles.moduleCount}>{moduleCount}</div>
//       <div className={styles.arrow}/>
//       <h1 className={styles.headerName}>{title}</h1>
//     </div>
//     {/* <div className={styles.rightPageCount}>{`${currentPage}/${totalPage}`}</div> */}
//   </div>;

// };

interface PageFooterProps {
  logo?:string
}
export const PageFooter: React.FC<PageFooterProps> = ({ logo }) => {
  return <div className={styles.pageFooterWrapper}>
    <div className={styles.content}>

      <IconFont iconHref={'iconic_logo_pc'} className={styles.logoIcon} />
      {
        logo && <>
          <span className={styles.flag}> x</span>
          <img src={logo}/>
        </>
      }
    </div>
  </div>;

};

interface CardLayoutProps {
  title:string;
  children: ReactNode | ReactElement,
  style?:React.CSSProperties;
  RightNode?:ReactNode | ReactElement
}
export const CardLayout: React.FC<CardLayoutProps> = (props) => {
  const { title, children, style, RightNode } = props;
  return <div className={styles.cardLayout} style={style}>
    <div className={styles.cardTitle}>
      <div className={styles.title}>{title}</div>
      <div>{RightNode}</div>
    </div>
    {children}
  </div>;

};

interface PageHeaderProps {
  title:string;
  currentPage?:number;
    totalPage?:number;
    moduleCount?:number
}
export const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const { title } = props;
  return <div className={styles.pageHeader}>
    <div className={styles.pageTitle}>
      {title}
    </div>
    <div className={styles.line}/>
  </div>;
};
