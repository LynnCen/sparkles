// 布局
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined, SwapOutlined } from '@ant-design/icons';
import { Layout, Menu, Dropdown, Breadcrumb, Tooltip } from 'antd';
import NotFound from '@/common/components/NotFound';
import IconFont from '@/common/components/IconFont';
import ChangeAccount from '@/layout/components/Login/components/ChangeAccount';
import MustReadBeforeDev from './components/MustReadBeforeDev';
import { get } from '@/common/request/index';
import { matchQuery, recursionEach, gatherMethods, dateFns, deepCopy, isArray } from '@lhb/func';
import { getKeys, logout } from '@/common/utils/ways';
import { tntList, tenantCheck } from '@/common/api/common';
import { UserInfoContextProvider } from './context';
import cs from 'classnames';
import { currentUserInfo, CurrentUserInfo, UserInfoModuleList } from '@/common/api/brief';
import { devMenu } from './menuConfig';
import { BasicType, HeaderStatus, foldUrl } from './ts-config';
// import { loadMicroApp } from 'qiankun';
// import { config } from '@/common/qiankun/config';
import styles from './index.module.less';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { routersConfig } from '@/router/router';
import { getTenantInfo } from '@/common/api/system';
import { useDispatch } from 'react-redux';
import { changeTenantInfo, changeTenantCheck } from '@/store/common';
import { getCookie } from '@lhb/cache';
import { getRegisterTrialStatus } from '@/common/api/user';
import { bigdataMenu } from '@/common/utils/bigdata';
import { componentDocsMenu } from './componentMenuConfig';
import Logo from 'src/layout/components/Logo';

const routeList = routersConfig(); // 不能在jsx内执行，需要在Main函数之前就调用，才能获取到正确的页面组件

const { Header, Sider, Content } = Layout;
export interface UserInfoProps extends CurrentUserInfo {
  haveMenu?: boolean;
  menusItems: any[];
  getTenantDetail?: Function;
}

const BasicLayout: React.FC<BasicType> = ({ children, location }) => {
  const dispatch = useDispatch();
  const [selectKey, setSelectKey] = useState<string[]>([location.to.pathname]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [havePermission, setHavePermission] = useState<boolean>(true); // 是否有页面权限
  const [showChangeEnter, setShowChangeEnter] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoProps>({
    haveMenu: true,
    menusItems: [],
  });
  const [menus, setMenus] = useState<any[]>([]); // 各层级菜单平铺后数组
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<Array<string>>([]);
  const [tenantInfo, setTenantInfo] = useState<any>({});
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const isDev = process.env.NODE_ENV === 'development'; // 是否是开发环境
  // const [isXP, setIsXP] = useState<boolean>(false);
  // const [microApp, setMicroApp] = useState<any>(null);

  useEffect(() => {
    getRegisterTrialStatus().then((res) => {
      if (res.initStatus) { // 如果是数据初始化完成的就开始正常走逻辑
        getEnterprises();
        getCurrentUser();
        getTenantDetail();
        getTargetTenent();
      } else { // 如果还在获取中，去获取数据的loading等待页
        dispatchNavigate('/openweb');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取到各页面page.config.ts里的meta值
  const meta = useMemo(() => {
    const { pathname, search } = location.to;
    const metaName = matchQuery(search, 'metaName');
    const targetRoute = routeList?.find((item) => {
      return item.path === pathname;
    });
    const result = targetRoute?.meta || {};
    if (metaName) {
      result.name = metaName;
    }
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.to]);

  // 是否没有padding，撑满一屏，目前只有地图要求撑满
  const isFullPage = useMemo(() => {
    return foldUrl.includes(location.to.pathname);
  }, [location.to.pathname]);

  useEffect(() => {
    const tenantId = getCookie('tenantId');// 租户id
    const employeeId = getCookie('employeeId');// 员工id
    const msg: any = {
      report_time: dateFns.currentTime('', false),
    };
    if (tenantId || tenantInfo?.id) msg.tenant_id = tenantId || tenantInfo?.id;
    if (employeeId || userInfo?.id) msg.user_id = employeeId || userInfo?.id;

    // 20230824版本，为了统一埋点上报方式，取消eventId方式的上报
    // 埋点上报
    // meta?.eventId && window.LHBbigdata.send({
    //   event_id: meta.eventId, // 事件id
    //   msg
    //   // msg: {
    //   //   tenant_id: tenantId || tenantInfo?.id, // 租户id
    //   //   user_id: employeeId || userInfo?.id, // 员工id
    //   //   report_time: dateFns.currentTime('', false),
    //   // } // 额外需要插入的业务信息
    // });
    // 部分子页面访问时上报归属的父级页面 https://confluence.lanhanba.com/pages/viewpage.action?pageId=67530354
    const { url } = meta;
    url && window.LHBbigdata.send({
      msg: {
        url,
        ...msg
      }
    });
  }, [meta, tenantInfo?.id, userInfo?.id]);

  useEffect(() => {
    selectKey.length && selectKey[0] !== location.to.pathname && setSelectKey([location.to.pathname]);
    if (foldUrl.includes(location.to.pathname)) { // 进入指定的页面时收起
      setCollapsed(true);
    } else { // 否则默认展开
      setCollapsed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.to.pathname]);

  useEffect(() => {
    if (userInfo.haveMenu && userInfo.moduleList) {
      if (meta?.parentPath) {
        setDefaultOpenKeys(meta?.parentPath);
      } else {
        recursionEach(userInfo.moduleList, 'children', (item: any) => {
          if (item.uri === location.to.pathname && item.parent) {
            // 有父级节点才默认展开-父节点的uri可能回null，此时取encode与渲染menu对应
            setDefaultOpenKeys([item.parent.uri || item.parent.encode]);
            setSelectKey(item.uri);
            return true;
          } else {
            return false;
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.moduleList]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  // 将菜单结果处理为menu需要的格式
  const dealWithMenu = (list: any[]) => {
    if (Array.isArray(list) && list.length) {
      return list.map((item) => ({
        label: item.name,
        key: item.uri || item.encode,
        icon: item.icon && <IconFont className={styles.menuIcon} iconHref={item.icon} />,
        children: dealWithMenu(item.children),
      }));
    } else {
      return null;
    }
  };

  // 将菜单处理为平铺的数组
  const getMenuMap = (list: any[]) => {
    if (Array.isArray(list) && list.length) {
      let allMenus: any[] = [];
      list.forEach((item: any) => {
        const itm = deepCopy(item);
        delete itm.children;
        allMenus.push(itm);

        const children: any[] = getMenuMap(item.children);
        if (isArray(children) && children.length) {
          allMenus = allMenus.concat(children);
        }
      });
      return allMenus;
    } else {
      return [];
    }
  };

  // 获取用户信息（包含菜单列表）
  const getCurrentUser = async () => {
    try {
      const userInfo: CurrentUserInfo = await currentUserInfo();
      let { moduleList } = userInfo;
      if (Array.isArray(moduleList) && moduleList.length) {
        moduleList = moduleList.filter((moduleItem: any) => moduleItem.uri);
      }
      if (isDev && moduleList) {
        // 本地开发时可自定义配置
        moduleList = moduleList.concat(devMenu); // devMenu;
      }
      const menusItems: any[] = dealWithMenu(moduleList || []);
      const menuList: any[] = getMenuMap(moduleList || []);
      setMenus(menuList);

      setUserInfo({
        ...userInfo,
        haveMenu: !!(moduleList as UserInfoModuleList[]).length,
        moduleList,
        menusItems,
        getTenantDetail
      });
      const currentPath = location.to.pathname;
      const allUri = getKeys(moduleList as UserInfoModuleList[], [], 'uri', 'children', true);
      const collectionPath = gatherMethods(meta?.breadcrumbs?.path || [], allUri, 1);
      const isIN = allUri.includes(currentPath) || collectionPath.length || /^\/demo/.test(currentPath); // 是否可访问：在可访问数组内，或者是 demo 页面
      // 如果当前页面不在菜单列表中且子菜单所属的父级菜单也不在菜单列表中则默认跳转到第一个页面
      if (!isIN && moduleList && moduleList.length) {
        const target = (moduleList[0] as any).children.length ? (moduleList[0] as any).children[0] : moduleList[0];
        target && dispatchNavigate(target.uri);
        target && selectKey.length && selectKey[0] !== target.uri && setSelectKey(target.uri);
      }
      // 如果没有菜单权限-且不在404页面则页面全局提示暂无权限
      if (moduleList && !moduleList.length && currentPath !== '/404') {
        setHavePermission(false);
      }
    } catch (error) {
      dispatchNavigate('/404');
    }
  };

  // 获取企业列表
  const getEnterprises = () => {
    tntList().then((data: any) => {
      if (Array.isArray(data)) {
        const enterprises = data.filter((enterprise: any) => enterprise.status !== 2);
        if (enterprises.length > 1) {
          // 多个企业时才显示切换企业按钮
          setShowChangeEnter(true);
        }
        return;
      }
      setShowChangeEnter(false);
    });
  };

  const handleClick = ({ selectedKeys }) => {
    setSelectKey(selectedKeys);
    if (selectedKeys.length) {
      const key = selectedKeys[0];
      const menu = menus.find(itm => itm.uri === key);
      const menuId = menu ? menu.id : '';

      dispatchNavigate(selectedKeys[0]);
      bigdataMenu(selectedKeys[0], menuId);
    }
  };

  const handleOpenChange = (keys) => {
    setDefaultOpenKeys(keys);
  };

  const changeCheckMenu = (item: any) => {
    if (item.key === HeaderStatus.LOGIN_OUT) {
      get('/logout', {}, true).then(() => {
        logout();
      });
    }
  };

  const setLogo = (uri) => {
    const link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = uri;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  const getTenantDetail = async () => { // 获取当前租户详情
    try {
      const data = await getTenantInfo();
      dispatch(changeTenantInfo({ ...data }));
      setTenantInfo({ ...data });
      data.webHeaderUri && setLogo(data.webHeaderUri);
    } catch (error) {

    }
  };
  const HeaderOperate = <Menu onClick={changeCheckMenu} items={[{ label: '退出登录', key: HeaderStatus.LOGIN_OUT }]} />;

  const getTargetTenent = () => {
    tenantCheck().then((data: any) => {
      // setIsXP(data.isXiaoPeng);
      dispatch(changeTenantCheck(data));
    });
  };

  // const openXPDoc = () => {
  //   window.open('https://staticres.linhuiba.com/project-custom/locationpc/file/使用指引.pdf ');
  // };


  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        className={styles.siderWrap}
        collapsed={collapsed}
        // 侧边栏收进的宽度
        collapsedWidth={48}
        width={170}
      >
        {/* logo */}
        <Logo collapsed={collapsed} tenantInfo={tenantInfo}/>
        {/* 菜单 */}
        {/* 区分组件文档导航和系统导航 */}
        {meta?.isComponentDoc ? <Menu
          theme='dark'
          mode='inline'
          style={{
            height: '100%',
            borderRight: 0,
            marginBottom: '48px',
            // paddingLeft: '4px',
            // paddingRight: '4px'
          }}
          selectedKeys={selectKey}
          openKeys={Array.isArray(componentDocsMenu) ? componentDocsMenu.map(item => item.name) : []}
          onOpenChange={handleOpenChange}
          onSelect={handleClick}
          items={Array.isArray(componentDocsMenu) ? componentDocsMenu.map(item => ({
            label: item.name,
            key: item.name,
            children: Array.isArray(item.children) ? item.children.map(it => ({ label: it.name, key: it.path })) : []
          })) : []}
        /> : <Menu
          theme='dark'
          mode='inline'
          style={{
            height: '100%',
            borderRight: 0,
            marginBottom: '48px',
            // paddingLeft: '4px',
            // paddingRight: '4px'
          }}
          onSelect={handleClick}
          openKeys={defaultOpenKeys}
          selectedKeys={selectKey}
          onOpenChange={handleOpenChange}
          items={userInfo.menusItems}
        />}
        <div
          style={{
            width: collapsed ? '48px' : '170px'
          }}
          className={styles.bottomCon}
          onClick={toggle}
        >
          {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: styles.trigger,
                onClick: toggle,
              })} */}
          <div className={styles.collapsed} >
            <Tooltip
              placement='top'
              title={collapsed ? '展开' : '收起'}
              open={tooltipOpen}
            >
              <div
                onMouseEnter={() => { setTooltipOpen(true); }}
                onMouseLeave={() => { setTooltipOpen(false); }}
                onClick={() => { if (tooltipOpen) { setTooltipOpen(false); } }}
              >
                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
              </div>
            </Tooltip>
          </div>
        </div>
        {/* {
          isXP ? <div className={styles.docsLink} onClick={openXPDoc}>
            <FileTextOutlined />
            <span className='pl-8'>使用指引</span>
          </div> : null
        } */}
      </Sider>
      <Layout className={styles.leftLayout} style={{ marginLeft: collapsed ? 44 : 166 }}>
        <Header className={styles.header}>
          <div className={styles.leftWrap}>
            {/* 旧收起按钮 */}
            {/* <div>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: styles.trigger,
                onClick: toggle,
              })}
            </div> */}
            <Breadcrumb>
              {/* noShow为true则不显示父级面包屑，不配置默认展示 */}
              {meta?.breadcrumbs && !meta?.breadcrumbs?.noShow &&
                meta.breadcrumbs.name.map((item, index) => (
                  <Breadcrumb.Item key={item}>
                    <Link to={meta.breadcrumbs.path[index]}>{item}</Link>
                  </Breadcrumb.Item>
                ))}
              {meta.title && <Breadcrumb.Item>{meta.title}</Breadcrumb.Item>}
            </Breadcrumb>
          </div>
          <div className={styles.right}>
            {(tenantInfo.name || userInfo.tenant) && (
              <span
                className={cs(styles.chooseAccount, showChangeEnter && 'pointer')}
                onClick={() => setShowAccountModal(showChangeEnter)}
              >
                {/* 优先取简称，没有的话取企业名 */}
                {tenantInfo.name || userInfo.tenant}
                {showChangeEnter && <SwapOutlined className={styles.icon} />}
              </span>
            )}

            <Dropdown overlay={HeaderOperate}>
              <a className={styles.dropDownLink} onClick={(e) => e.preventDefault()}>
                <span className={styles.avatarImg}>
                  {userInfo.avatar ? <img src={userInfo.avatar} alt='' /> : <span className={styles.icon}></span>}
                </span>
                {/* 企业名称和员工姓名(姓名没有的时候接口返回的是手机号 */}
                {userInfo.name && userInfo.tenant && `${userInfo.name}`}
              </a>
            </Dropdown>
          </div>
        </Header>
        {/* <div id='micro-organization'></div> */}
        <UserInfoContextProvider userInfo={userInfo} getTenantDetail={getTenantDetail}>
          <Content className={cs(styles.content, isFullPage ? styles.isFull : '')}>
            {havePermission ? children : <NotFound text='暂无权限，请联系企业管理员开通' />}
          </Content>
        </UserInfoContextProvider>
      </Layout>
      <ChangeAccount showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
      {/* 开发前必读 */}
      <MustReadBeforeDev/>
    </Layout>
  );
};

export default BasicLayout;
