/**
 * @Description 规划管理空数据展示
 */

import { FC, useState } from 'react';

import styles from '../index.module.less';
import { Button } from 'antd';
import { useMethods } from '@lhb/hook';
// import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { post } from '@/common/request';
import { TabsEnums } from '@/views/recommend/pages/networkplan/ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface EmptyRenderProps {
  mainHeight: number;
  type?: TabsEnums;
  successCb?: () => void;
}


const EmptyRender: FC<EmptyRenderProps> = ({
  mainHeight,
  type = TabsEnums.HEAD_OFFICE,
  successCb
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // 根据type返回不同的title和content
  const versionType = () => {
    switch (type) {
      case '1': // 规划管理
        return {
          title: '规划版本名称',
          content: '您还没有建立规划版本，建立后即可开始规划',
        };

      default: // 分公司
        return {
          title: '规划管理',
          content: '总部还未建立规划版本，请稍作等待~',
        };
    }
  };

  const methods = useMethods({
    handleAdd() { // 新建版本
      // V2Confirm({
      //   onSure: (modal: any) => {
      //     // https://yapi.lanhanba.com/project/546/interface/api/59681
      //     post('/plan/create',).then(() => {
      //       successCb?.();
      //       message.success('创建成功');
      //       modal.destroy();
      //     });
      //   },
      //   content: '是否建立规划版本？'
      // });
      setLoading(true);
      V2Message.warning('新建版本中，请稍等～');
      // https://yapi.lanhanba.com/project/546/interface/api/59681
      post('/plan/create',).then(() => {
        successCb?.();
        V2Message.success('创建成功');
        // modal.destroy();
        setLoading(false);
      }).finally(() => {
        setLoading(false);
      });
    },
  });

  return (
    <>
      <div className={styles['network-plan']} style={{ height: mainHeight }}>
        <div className={styles['left-box']}>
          <div className={styles['left-box-title']}>{versionType().title}</div>
          <div className={styles['left-box-content']}>{versionType().content}</div>
          <div className={styles['btn']}>
            {type === TabsEnums.HEAD_OFFICE && <Button loading={loading} type='primary' onClick={methods.handleAdd}>新建版本</Button>}
          </div>
        </div>
        <div className={styles['right-box']}></div>
      </div>
    </>
  );
};

export default EmptyRender;
