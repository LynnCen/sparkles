/**
 * @description 需求详情 抽屉
 */
import { FC, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useMethods } from '@lhb/hook';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import Detail from '../Detail';

const DetailDrawer:FC <{
  ref?: any,
  onRefresh: any
}> = forwardRef(({ onRefresh }, ref) => {
  const [detailDrawerData, setDetailDrawerData] = useState<any>({
    visible: false,
    id: '',
    rightExtraVisible: false
  });

  /** 右侧内容样式 */
  const drawerContentWrapperStyle = useMemo(() => {

    return {
      width: detailDrawerData.rightExtraVisible ? '86%' : '70%',
      minWidth: detailDrawerData.rightExtraVisible ? '1208px' : '1008px',
      maxWidth: detailDrawerData.rightExtraVisible ? '1502px' : '1152px',
    };

  }, [detailDrawerData.rightExtraVisible]);

  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const methods = useMethods({
    init(id:string|number) {
      setDetailDrawerData({
        ...detailDrawerData,
        visible: true,
        id
      });
    },
    onClose() {
      setDetailDrawerData({
        ...detailDrawerData,
        visible: false,
      });
    },
    onRightExtra(visible: boolean = false) {
      setDetailDrawerData({
        ...detailDrawerData,
        rightExtraVisible: visible,
      });
    }
  });

  useEffect(() => {
    // 关闭时清空右侧内容
    if (!detailDrawerData.visible) {
      setDetailDrawerData({
        ...detailDrawerData,
        rightExtraVisible: false
      });
    }
  }, [detailDrawerData.visible]);

  return <V2Drawer
    bodyStyle={{ padding: 0 }}
    open={detailDrawerData.visible}
    // afterOpenChange={() => { mainRef?.current?.init(); }}
    onClose={methods.onClose}
    destroyOnClose={true}
    maskClosable={true}
    contentWrapperStyle={drawerContentWrapperStyle}
  >
    <Detail
      onRefresh={onRefresh}
      data={detailDrawerData}
      onRightExtra={methods.onRightExtra}/>
  </V2Drawer>;
});

export default DetailDrawer;
