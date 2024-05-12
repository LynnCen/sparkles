import { FC, useRef, useState } from 'react';
import InviteForm from './InviteForm';
import TableList from './TableList';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';

const WechatNote: FC<any> = ({
  mainHeight
}) => {
  const [params, setParams] = useState({});
  const [newHeight, setNewHeight] = useState<number>(0);
  const tableRef = useRef<any>(null);

  const methods = useMethods({
    onRefreshTable() {
      setParams({ ...params });
    }
  });
  return (
    <V2Container
      style={{ height: mainHeight }}
      emitMainHeight={(h) => setNewHeight(h)}
      extraContent={{
        top: <InviteForm onRefresh={methods.onRefreshTable} />
      }}
    >
      <TableList
        params={params}
        ref={tableRef}
        mainHeight={newHeight}
      />
    </V2Container>
  );
};

export default WechatNote;
