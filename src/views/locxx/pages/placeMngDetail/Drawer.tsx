/**
 * @Description 详情抽屉
 */
import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import V2Drawer from 'src/common/components/Feedback/V2Drawer/index';
import Detail from './entry';

// eslint-disable-next-line no-empty-pattern
const PlaceMngDrawer:FC<any> = forwardRef(({ onRefresh, onClose: onDrawerClose }, ref) => {
  useImperativeHandle(ref, () => ({
    init
  }));


  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const drawerWrapper: any = useRef();
  const detail: any = useRef();

  const init = (id) => {
    console.log(id, 222);


    setId(id);
    setOpen(true);

    setTimeout(() => {
      drawerWrapper.current.getBodyElement() && (drawerWrapper.current.getBodyElement().scrollTop = 0);
      detail.current.init instanceof Function && detail.current.init();
    }, 0);
  };

  const onClose = () => {
    setOpen(false);
    onDrawerClose?.();
  };



  return (<>
    {open && <V2Drawer onRef={drawerWrapper} open={open} onClose={onClose} maskClosable={false} push={false}
      contentWrapperStyle={{
        minWidth: 'auto',
        width: '1008px',
      }}>
      <Detail
        ref={detail}
        detailId={id as any}
        onRefresh={onRefresh}
      />
    </V2Drawer>}
  </>
  );
});

export default PlaceMngDrawer;

