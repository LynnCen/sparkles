//
import { FC, useEffect, useState } from 'react';
import cs from 'classnames';
import './index.less';

interface ToolbarNavProps {
  items?: Item[];
  value?: string;
  onChange?: (key?: string) => void;
}

interface Item {
  label?: string;
  key?: string;
  display?: any;
}

const ToolbarNav: FC<ToolbarNavProps> = ({ items = [], value, onChange }) => {
  const [activeKey, setActiveKey] = useState<string | undefined>();

  useEffect(() => {
    setActiveKey(value);
  }, [value]);

  return (
    <>
      {
        items.length > 1 && (
          <div className='toolbarNav-wrapper'>
            <div className='toolbarNav' style={{ padding: items.length ? 4 : 0 }}>
              {items.map(item => {
                const { label, key } = item;
                const onClick = () => {
                  setActiveKey(key);
                  onChange?.(key);
                };
                const itemCls = cs('toolbarNavItem', { 'toolbarNavItem-active': activeKey === key });
                return (
                  <div className={itemCls} onClick={onClick} key={key} >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </>
  );
};

export default ToolbarNav;
