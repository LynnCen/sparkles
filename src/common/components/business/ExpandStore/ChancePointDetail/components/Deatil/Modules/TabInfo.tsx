/**
 * @Description 基础信息
 */

import { FC } from 'react';
import { DynamicDetail } from '@/common/components/business/StoreDetail';
import { ModuleDetailsType } from '../type';
import styles from '../index.module.less';

/** 基础信息表单传参类型 */
interface TabBaseInfoProps {
  data: ModuleDetailsType,
  [p: string]: any;
}

/** 基础信息表单组件 */
const TabBaseInfo: FC<TabBaseInfoProps> = ({
  data,
  // container,
  // dynamicTabContentRefs,
  setHintStr,
  ...props
}) => {

  return (
    <div
      className={styles.tabInfo}>
      <DynamicDetail
        // anchorCustomStyle={{
        //   position: 'absolute',
        //   top: '20px',
        //   bottom: '0'
        // }}
        title=''
        // container={container}
        // dynamicTabContentRefs={dynamicTabContentRefs}
        setHintStr={setHintStr}
        isStandard // 标准版本不需要显示【附加资料】
        ignoreAttach // 标准版本不需要显示【附加资料】
        data={data}
        {...props}
      />
    </div>
  );
};

export default TabBaseInfo;
