/**
 * @Description 审批工作台tabs项目
 */

import { FC } from 'react';
import V2Tabs from '@/common/components/Data/V2Tabs';
import styles from '../entry.module.less';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { MSG_STATUS_ENUMS } from '../ts-config';

/** 消息tab项 */
const massgeTabsItems = [
  {
    key: String(MSG_STATUS_ENUMS.NOT_READ),
    label: `待阅`,
  },
  {
    key: String(MSG_STATUS_ENUMS.HAS_READ),
    label: `已阅`,
  },
];

const WorkbenchTabs:FC<any> = ({
  form, // 表单信息
  msgActivityKey, // 消息类型当前选中项目
  onSearch, // 点击搜索
  isMsgTab, // 是否为消息tab
  onMsgTabChange // 消息tab切换
}) => {
  //
  return (
    <div className={styles.workbenchTop}>
      <SearchForm
        onOkText='搜索'
        form={form}
        className={styles.form}
        showResetBtn={false}
        onSearch={onSearch}
      >
        <V2FormInput label='名称搜索' name='keyword' />
      </SearchForm>

      { isMsgTab ? (
        <div className={styles.msgTabs}>
          <V2Tabs
            activeKey={msgActivityKey}
            items={massgeTabsItems}
            type='card'
            onChange={onMsgTabChange}
          />
        </div>) : <></>
      }
    </div>
  );

};

export default WorkbenchTabs;
