import { FC, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';

interface CustomerTabsProps {
  tabs: any[];
  onChange: (value: string) => void;
}

const CustomerTabs: FC<CustomerTabsProps> = ({ tabs, onChange, children }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs.length ? tabs[0].value : '');

  const onActiveTab = (key: string) => {
    onChange(key);
    setActiveTab(key);
  };

  return (
    <div className={styles.tabsWrap}>
      <ul className={styles.tabsChange}>
        {tabs.map((item) => (
          <li
            className={cs(activeTab === item.value && styles.active)}
            key={item.value}
            onClick={() => onActiveTab(item.value)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <div>{children}</div>
    </div>
  );
};

export default CustomerTabs;
