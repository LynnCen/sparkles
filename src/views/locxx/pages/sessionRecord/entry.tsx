import { FC, useRef, useState } from 'react';
import styles from './entry.module.less';
import Search from './components/Search';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';
import TableList from './components/TableList';
import V2Tabs from '@/common/components/Data/V2Tabs';

/**
 * @description: 会话记录
 * @return {*}
 */
const SessionRecord: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState(0);
  const [params, setParams] = useState({
    type: 1
  });
  const tableRef = useRef<any>(null);

  const items: any = [
    { key: 1, label: 'locxx' },
    { key: 2, label: 'location' },
    { key: 3, label: 'pms' }
  ];

  const methods = useMethods({
    onSearch(val) {
      setParams({ ...val });
    }
  });

  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            <V2Tabs onChange={(type: any) => setParams({ ...params, type })} items={items}/>
            <Search onSearch={methods.onSearch} />
          </>
        }}
      >
        <TableList
          params={params}
          ref={tableRef}
          mainHeight={mainHeight}
        />
      </V2Container>
    </div>
  );
};

export default SessionRecord;
