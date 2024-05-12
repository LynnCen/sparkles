import { FC, useMemo } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { OperateProps } from './ts-config';
import cs from 'classnames';
import styles from './index.module.less';

// TODO 升级antd后需更改munu的用法
const Operate: FC<OperateProps> = ({ operateList = [], showBtnCount = 3, onClick, position = 'end', classNames }) => {
  // 平铺的按钮
  const showOperate = useMemo(() => {
    return operateList.slice(0, operateList.length > 3 ? showBtnCount - 1 : showBtnCount);
  }, [operateList, showBtnCount]);

  // 更多的按钮显示在前面或者后面(默认为false，显示在最后)及更多的样式（默认为link）
  const { moreBtnPosition, moreBtnType = 'link' } = useMemo(() => {
    if (operateList.length) {
      const btnPosition = position === 'front';
      const len = operateList.length - 1;
      const moreItemType = operateList[len].type;
      return {
        moreBtnPosition: btnPosition,
        moreBtnType: moreItemType,
      };
    } else {
      return {
        moreBtnPosition: false,
        moreBtnType: 'link',
      };
    }
  }, [operateList, position]);

  // 需要折叠的按钮
  const dropDownOperate = useMemo(() => {
    // 小于则没有下拉
    if (operateList.length < showBtnCount) {
      return [];
    }
    return operateList.slice(operateList.length > 3 ? showBtnCount - 1 : showBtnCount, operateList.length);
  }, [operateList, showBtnCount]);

  const handleMenuClick = ({ key }: any) => {
    const targetPermission = operateList.find((permission) => permission.event === key);
    targetPermission && onClick && onClick(targetPermission);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {dropDownOperate.map((item) => (
        <Menu.Item key={item.event || item.name}>{item.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={cs(styles.operateBtns, classNames)}>
      {/* 更多按钮显示在前面 */}
      {moreBtnPosition && !!dropDownOperate.length && (
        <Dropdown overlay={menu}>
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
        <Dropdown overlay={menu}>
          <Button type={moreBtnType || 'link'}>
            操作 <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default Operate;
