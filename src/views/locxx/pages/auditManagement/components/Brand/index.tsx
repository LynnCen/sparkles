import { FC, useState, useRef } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import Search from './components/Search';
import TableList from './components/TableList';
import styles from '../../entry.module.less';
import { Form } from 'antd';
import { useMethods } from '@lhb/hook';
import ReplaceModal from './components/ReplaceModal';

// 审核管理品牌页面
const Component:FC<any> = ({ mainHeight }) => {
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({ topStatus: 1 });
  const tableRef: any = useRef();
  const [topStatus, setTopStatus] = useState(1);
  const [visible, setVisible] = useState<boolean>(false); // 控制代认证弹窗显示
  // const AUDIT_STATUS_AWAIT_AUDIT = 1;// 待审核

  const methods = useMethods({
    onSearch(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      // const { topStatus } = _params;
      // if (topStatus === AUDIT_STATUS_AWAIT_AUDIT) {
      //   searchForm.setFieldValue('status', null);
      //   _params.status = null;
      // }
      setParams(state => ({ ...state, ..._params, topStatus, ...data, }));
    },
  });

  return (<div className={styles.container}>
    <V2Container
      style={{ height: mainHeight }}
      extraContent={{
        top: <Search
          onSearch={methods.onSearch}
          searchForm={searchForm}
          topStatus={topStatus}
          setTopStatus={setTopStatus}
          setVisible={setVisible}/>
      }}>
      <TableList tableRef={tableRef} params={params} topStatus={topStatus}></TableList>
    </V2Container>

    <ReplaceModal visible={visible} setVisible={setVisible} onRefresh={() => tableRef?.current?.onload(true)}/>
  </div>);
};

export default Component;
