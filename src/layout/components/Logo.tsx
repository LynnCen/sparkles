import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import cs from 'classnames';
import styles from '../index.module.less';
import { Popover } from 'antd';
import IconFont from '@/common/components/IconFont';

// 左侧导航图标
const Component:FC<{ collapsed?: boolean }> = ({ collapsed }) => {

  const [open, setOpen] = useState(false);

  // 是否显示组件文档
  const showComponentDoc = process.env.NODE_ENV === 'development' || ['ie', 'te'].includes(process.env.NODE_TYPE as any);
  const { pathname } = useLocation();
  const switchApp = ({ path, url }: any) => {
    if (url) {
      window.open(url, '_self');
    } else if (path) {
      dispatchNavigate(path);
    }
    setOpen(false);
  };
  const popoverContent = () => {
    const currentName = showComponentDoc && /^\/demo/.test(pathname) ? 'componentDoc' : 'index';
    const appList = [
      { value: 'index', label: '首页', describe: '首页', path: '/', icon_url: 'https://staticres.linhuiba.com/project-custom/linhuiba-crm4-wap/icon/ic_ziyuan.png', visible: true },
      { value: 'componentDoc', label: '组件文档', describe: '项目组件文档', path: '/demo/index', icon_url: 'https://staticres.linhuiba.com/project-custom/linhuiba-crm4-wap/icon/ic_huibao.png', visible: showComponentDoc },
    ].filter(item => !!item.visible);
    return (<>
      {Array.isArray(appList) && appList.map((item, index) => (<div key={index} className={cs(styles['app-switch-item'], item.value === currentName ? styles['is-current'] : '')} onClick={() => switchApp(item)}>
        <img src={item.icon_url} alt=''/>
        <div>
          <div className={styles['app-switch--name']}>{item.label} </div>
          <div className={styles['app-switch--describe']}>{item.describe}</div>
        </div>
      </div>))}
    </>);
  };

  return (<Popover
    content={popoverContent}
    trigger={showComponentDoc ? 'hover' : ''}
    placement='bottom'
    open={open}
    overlayClassName={styles['app-switch-popover']}
    onOpenChange={setOpen}
  >
    <div className={cs(styles.logo, collapsed && styles.collapsedStyle, showComponentDoc && styles['app-switch'])}>
      <IconFont iconHref='icon-a-saaslogo' className={cs(styles.icon)} />
      <span className={cs(styles.logoText, collapsed && styles.hiddenName)}>SAAS后台</span>
    </div>
  </Popover>);
};

export default Component;
