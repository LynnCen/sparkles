import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, Dropdown, Spin } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import IconFont from '@/common/components/IconFont';
import NotFound from '@/common/components/NotFound';
import ModifyPassword from './components/ModifyPassword';
import cs from 'classnames';
import { get } from '@/common/request';
import { deepCopy, isImage, matchQuery, recursionEach } from '@lhb/func';
import { logout } from '@/common/utils/ways';
import { userCurrentUser } from '@/common/api/user';
import { onLoading } from '@/common/document-event/on';
import { removeLoading } from '@/common/document-event/remove';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { devMenu } from '@/layout/menuConfig';
import { HeaderStatus, BasicType, CurrentUserResult } from './ts-config';
import styles from './index.module.less';

import { componentDocsMenu } from './componentMenuConfig';
import { routersConfig } from '@/router/router';
import Logo from 'src/layout/components/Logo';

const routeList: any = routersConfig(); // 不能在jsx内执行，需要在Main函数之前就调用，才能获取到正确的页面组件

const { Header, Sider, Content } = Layout;

const SiderStyle: any = { overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 };

// 当前用户信息存储到context中
export const CurrentUserInfo = React.createContext({});

const BasicLayout: React.FC<BasicType> = ({ children, location, isOpen }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectKeys, setSelectKeys] = useState<string[]>([location.to.pathname]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [modifyPsd, setModifyPsd] = useState<boolean>(false);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<Array<string>>([]);
  // 当前用户信息-默认有菜单
  const [currentInfo, setCurrentInfo] = useState<any>({ haveMenu: true });

  const [pageTitle, setPageTitle] = useState<String>('');

  const handleClick = ({ selectedKeys }) => {
    setSelectKeys(selectedKeys);
    selectedKeys.length && dispatchNavigate(selectedKeys[0]);
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const toKunlun = () => {
    window.location.href = `${process.env.KUNLUN_URL}`;
  };

  // 获取页面标题
  useEffect(() => {
    routeList.map(item => {
      if (item.path === location.to.pathname && item.meta) {
        setPageTitle(item.meta.title);
      }
    });
    setSelectKeys(location.to.pathname ? [location.to.pathname] : []);
  }, [location]);

  useEffect(() => {

    userDetail();
    onLoading(setLoading);
    return () => {
      removeLoading(setLoading);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentInfo.haveMenu && currentInfo.moduleList) {
      recursionEach(currentInfo.moduleList, 'children', (item: any) => {
        if (item.uri === location.to.pathname && item.parent) {
          // 有父级节点才默认展开
          setDefaultOpenKeys([item.parent.uri || item.parent.encode]);
          return true;
        } else {
          return false;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInfo.moduleList]);

  // 获取到各页面page.config.ts里的meta值
  const meta: any = useMemo(() => {
    const { pathname, search } = location.to;
    const metaName = matchQuery(search, 'metaName');
    const targetRoute = routeList?.find(item => {
      return item.path === pathname;
    });
    const result = deepCopy(targetRoute?.meta || {});
    if (metaName) {
      result.name = metaName;
    }
    return result;
  }, [location, routeList]);

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

  // 获取当前用户详情
  const userDetail = async () => {
    try {
      const result: CurrentUserResult = await userCurrentUser();
      let moduleList: Array<any> = result.moduleList || [];
      if (process.env.NODE_ENV === 'development') {
        moduleList = moduleList.concat(devMenu);
      }

      const menusItems = dealWithMenu(moduleList);
      setCurrentInfo({ ...result, haveMenu: !!moduleList.length, moduleList, menusItems });
      const currentPath = location.to.pathname;
      const currentSearch = location.to.search;
      if (currentSearch && currentSearch.includes('noRouter')) {
        dispatchNavigate(currentPath + currentSearch);
        return;
      }
      /** 快速完成产品需求 */
      // const allUri = getKeys(moduleList, [], 'uri', 'children', true);
      // // 当前路由是否在菜单列表中/或包含某个菜单(自页面)-则停留在当前页面
      // const isIN = allUri.find((item) => item.includes(currentPath));
      // if (!isIN && moduleList.length) {
      //   const path = moduleList[0].children.length ? moduleList[0].children[0].uri : moduleList[0].uri;
      //   dispatchNavigate(path);
      //   selectKeys.length && selectKeys[0] !== path && setSelectKeys([path]);
      // }
    } catch (error) {
      // 如果用户信息获取失败，跳转到404页面
      setSelectKeys([]);
      dispatchNavigate('/404');
    }
  };

  // 退出登录
  const loginOut = () => {
    get('/logout', {}, {
      proxyApi: '/mirage'
    }).finally(() => {
      logout();
    });
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case HeaderStatus.LOGIN_OUT:
        loginOut();
        break;
      case HeaderStatus.RESET_PASSWORD:
        setModifyPsd(true);
        break;
      default:
        break;
    }
  };

  const handleOpenChange = (keys) => {
    setDefaultOpenKeys(keys);
  };

  const menu = [
    {
      key: HeaderStatus.RESET_PASSWORD,
      label: '修改密码',
      icon: <UserOutlined />
    },
    {
      key: HeaderStatus.LOGIN_OUT,
      label: '退出系统',
      icon: <PoweroffOutlined />
    },
  ];

  return (
    <div className={cs(isOpen && styles.isOpen)}>
      <Spin spinning={loading}>
        <Layout className={styles.container}>
          {
            !isOpen && <Sider className={styles.siderWrap} trigger={null} collapsible collapsed={collapsed} style={SiderStyle}>
              <Logo collapsed={collapsed}/>
              {/* 区分组件文档导航和系统导航 */}
              {meta?.isComponentDoc ? <Menu
                theme='dark'
                mode='inline'
                selectedKeys={selectKeys}
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
                selectedKeys={selectKeys}
                openKeys={defaultOpenKeys}
                onOpenChange={handleOpenChange}
                onSelect={handleClick}
                items={currentInfo.menusItems}
              />}
            </Sider>
          }
          <Layout className={styles.main} style={{ marginLeft: isOpen ? 0 : collapsed ? 80 : 200 }}>
            {
              !isOpen && <Header className={styles.siteLayout}>
                <div>
                  {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: styles.trigger,
                    onClick: toggle,
                  })}
                  <span className='ml-16 bold'>{pageTitle}</span>
                </div>
                <div className={styles.userInfo}>
                  {
                    process.env.NODE_ENV === 'production' && <>
                      <Dropdown className={styles.dropdownCursor} placement='bottom' arrow menu={{
                        items: [{ label: '昆仑', key: 'kunlun' }],
                        onClick: toKunlun
                      }}>
                        <i className={styles.menu}/>
                      </Dropdown>
                      <div className={styles.divider}></div>
                    </>
                  }
                  {currentInfo.avatar && isImage(currentInfo.avatar) && <img src={currentInfo.avatar} alt='' />}
                  <Dropdown className={styles.dropdownCursor} menu={{ items: menu, onClick: handleMenuClick }}>
                    <span>
                      {currentInfo.name} <DownOutlined />
                    </span>
                  </Dropdown>
                </div>
              </Header>
            }
            {/* 没有菜单权限显示空页面 */}
            {currentInfo.haveMenu ? (
              <Content className={styles.content}>
                <CurrentUserInfo.Provider value={currentInfo}>{children}</CurrentUserInfo.Provider>
              </Content>
            ) : (
              <NotFound text='暂无可使用菜单' />
            )}
          </Layout>
          {
            !isOpen && <ModifyPassword visible={modifyPsd} onClose={() => setModifyPsd(false)} loginOut={loginOut} />
          }
        </Layout>
      </Spin>
    </div>
  );
};

export default BasicLayout;
