/**
 * @Description 加盟商创建/编辑时的表单
 */
import { FC, useRef, useState } from 'react';
import { Spin, Button } from 'antd';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import V2Title from '@/common/components/Feedback/V2Title';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import styles from './index.module.less';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import FranchiseeForm from './components/FranchiseeForm';

const FranchiseeCreateDrawer: FC<any> = ({
  drawerData,
  setDrawerData,
  onCreated,
}) => {
  const formRef: any = useRef(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  const [submitting, setSubmitting] = useState<boolean>(false); // 提交中

  const methods = useMethods({
    /**
     * @description 提交编辑信息
     */
    confirmHandle() {
      (formRef.current as any).confirmHandle();
    },
    /**
     * @description 取消按钮
     */
    cancelHandle() {
      // 关闭弹窗时
      V2Confirm({
        onSure: () => {
          this.confirmClose();
        },
        zIndex: 1010,
        title: '操作提示',
        content: '退出后将不保存当前操作，请确认是否退出。',
      });
    },

    confirmClose() {
      (formRef.current as any).confirmClose();
      setDrawerData({
        open: false,
        templateId: '', // 模板id
        id: '', // 编辑时的id
      });
    },

    onSuccess(fid: number) {
      onCreated && onCreated(fid);
      this.confirmClose();
    }
  });

  return (
    <V2Drawer
      bodyStyle={{
        padding: 0,
      }}
      open={drawerData.open}
      onClose={methods.cancelHandle}
      className={cs('dynamicComponent', styles.formDrawer)}
    >
      <V2Container
        style={{ height: '100vh' }}
        emitMainHeight={h => setMainHeight(h)}
        className={styles.container}
        extraContent={{
          top: (
            <V2Title
              text='新增加盟商'
              className={styles.containerTop}
            />
          ),
          bottom: <div className={styles.containerBottom}>
            <Button type='primary' loading={submitting} onClick={methods.confirmHandle} className='ml-12'>
              确定
            </Button>
            <Button onClick={methods.cancelHandle}>取消</Button>
          </div>
        }}
      >
        <div>
          <Spin spinning={loading}>
            {/* 创建/编辑加盟商 */}
            <FranchiseeForm
              ref={formRef}
              drawerData={drawerData}
              mainHeight={mainHeight}
              setLoading={setLoading}
              setSubmitting={setSubmitting}
              onSuccess={methods.onSuccess}
              wrapperStyle={{
                paddingLeft: '40px'
              }}
              contentStyle={{
                paddingRight: '220px'
              }}
            />
          </Spin>
        </div>
      </V2Container>
    </V2Drawer>
  );
};

export default FranchiseeCreateDrawer;
