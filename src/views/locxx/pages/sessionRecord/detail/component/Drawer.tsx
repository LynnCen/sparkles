// 会话记录详情-抽屉
import { useState, FC, useImperativeHandle, forwardRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import Detail from './index';
import V2Drawer from '@/common/components/Feedback/V2Drawer';

const Component:FC<any> = forwardRef((props, ref) => {

  const [timestamp, setTimestamp] = useState(+new Date()); // 时间戳，用于在 id 不更新的时候打开弹窗，更新弹窗
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>();

  useImperativeHandle(ref, () => ({
    init: (id) => {
      unstable_batchedUpdates(() => {
        setTimestamp((val) => val + 1);
        setId(id);
        setOpen(true);
      });
    }
  }));

  return <V2Drawer open={open} onClose={() => setOpen(false)} destroyOnClose>
    {!!id && <Detail id={id} key={timestamp} open={open} onRefresh={props.onRefresh}/>}
  </V2Drawer>;
});

export default Component;
