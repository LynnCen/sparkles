import { FC, useMemo } from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { OperateProps } from './ts-config';
import styles from './index.module.less';

const Operate: FC<OperateProps> = ({ operateList, showBtnCount = 3, onClick }) => {
  // 平铺的按钮
  const showOperate = useMemo(() => {
    return operateList.filter((item) => item.position !== 'front').slice(0, showBtnCount - 1);
  }, [operateList, showBtnCount]);

  // 更多的按钮显示在前面或者后面(默认为false，显示在最后)及更多的样式（默认为link）
  const { moreBtnPosition, moreBtnType = 'link' } = useMemo(() => {
    if (operateList.length) {
      const btnPosition = operateList.findIndex((item) => item.position === 'front');
      const len = operateList.length - 1;
      const moreItemType = btnPosition !== -1 ? operateList[btnPosition].type : operateList[len].type;
      return {
        moreBtnPosition: btnPosition !== -1,
        moreBtnType: moreItemType,
      };
    } else {
      return {
        moreBtnPosition: false,
        moreBtnType: 'link',
      };
    }
  }, [operateList]);

  // 需要折叠的按钮
  const dropDownOperate = useMemo(() => {
    // 小于则没有下拉
    if (operateList.length < showBtnCount) {
      return [];
    }
    const frontList = operateList.filter((item) => item.position === 'front');
    // 如果有位置为front的操作
    if (frontList.length) {
      return operateList.filter((item) => item.position === 'front');
    } else {
      return operateList.slice(showBtnCount - 1, operateList.length);
    }
  }, [operateList, showBtnCount]);

  const handleMenuClick = ({ key }) => {
    const targetPermission = operateList.find((permission) => permission.event === key);
    targetPermission && onClick && onClick(targetPermission);
  };

  const menuList = useMemo(() => {
    return dropDownOperate.map((item) => ({
      label: item.name,
      key: item.event || item.name,
    }));
  }, [dropDownOperate]);

  return (
    <div className={styles.operateBtns}>
      {/* 更多按钮显示在前面 */}
      {moreBtnPosition && (
        <Dropdown menu={{ items: menuList, onClick: handleMenuClick }}>
          <Button type={moreBtnType || 'link'}>
            操作 <DownOutlined />
          </Button>
        </Dropdown>
      )}
      {showOperate.map((item) => {
        return (
          <Button
            key={item.event || item.name}
            type={item.type || 'link'}
            icon={item.icon}
            disabled={item.disabled}
            // 如果有onClick事件则直接调用onClick事件，没有则调用统一的onClick事件
            onClick={item.onClick ? item.onClick : () => handleMenuClick({ key: item.event })}
          >
            {item.name}
          </Button>
        );
      })}
      {/* 更多按钮位置 */}
      {!moreBtnPosition && !!dropDownOperate.length && (
        <Dropdown menu={{ items: menuList, onClick: handleMenuClick }}>
          <Button type={moreBtnType || 'link'}>
            操作 <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default Operate;
