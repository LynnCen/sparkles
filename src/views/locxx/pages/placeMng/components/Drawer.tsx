/**
 * @Description 记录抽地抽屉
 */
import { FC, forwardRef, useImperativeHandle, useRef, useState, } from 'react';
import V2Drawer from 'src/common/components/Feedback/V2Drawer/index';
import FollowRecordList from './FollowRecordList';
import { getRecordList } from '@/common/api/locxx';


const PlaceMngRecordDrawer:FC<any> = forwardRef(({ gotoDetail, onClose: onDrawerClose }, ref) => {
  useImperativeHandle(ref, () => ({
    init
  }));


  const [id, setId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [title, setTitle] = useState(null);

  const [open, setOpen] = useState(false);

  const drawerWrapper: any = useRef();

  const init = async(obj) => {

    setId(obj.tenantPlaceId);
    setTenantId(obj.tenantPlaceTntId);
    setTitle(obj.title);
    setOpen(true);
    getRecords(obj.tenantPlaceId, obj.tenantPlaceTntId);
    setTimeout(() => {
      drawerWrapper.current.getBodyElement() && (drawerWrapper.current.getBodyElement().scrollTop = 0);
    }, 0);
  };

  const onClose = () => {
    setOpen(false);
    onDrawerClose?.();
  };
  const getRecords = (tenantPlaceId, tenantPlaceTntId) => {
    getRecordList({ page: 1, size: 20, tenantPlaceId, tenantPlaceTntId }).then(() => {
    });
  };

  return (<>
    {open && <V2Drawer onRef={drawerWrapper} open={open} onClose={onClose} maskClosable={false} push={false} contentWrapperStyle={{
      minWidth: 'auto',
      width: '390px',
    }}>
      <FollowRecordList id={id} tenantId={tenantId} title={title} gotoDetail={gotoDetail}></FollowRecordList>
    </V2Drawer>}
  </>
  );
});

export default PlaceMngRecordDrawer;

