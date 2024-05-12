import { FC, useRef, useState, useMemo, useEffect } from 'react';
import styles from '../../entry.module.less';
import { Form } from 'antd';
import Search from './components/Search';
import TableList from './components/TableList';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';
import HandleDrawer from '../HandleDrawer';
import DetailDrawer from '../DetailDrawer';
import TransmitModal from '../TransmitModal';

// 问题反馈 资源纠错
const CorrectResourceError: FC<any> = ({ mainHeight, activeValue }) => {
  const handleDrawer: any = useRef();
  const detailDrawer: any = useRef();
  const transmitModal: any = useRef();
  const tableRef: any = useRef();
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({});
  const [unDoNum, setUnDoNum] = useState<any>([]);

  const items = [
    { value: 1, label: '全部', num: 0 },
    { value: 2, label: '待处理', num: 0 },
    { value: 3, label: '已处理', num: 0 },
  ];

  const options = useMemo(() => {
    if (Array.isArray(items) && items.length) {
      const tempArr = items.map(item => {
        if (item.value === 2) {
          item.num = unDoNum;
        }
        return item;
      });

      return Array.isArray(tempArr) && tempArr.length ? tempArr.map(item => {
        item.label = item.num > 0 ? `${item.label}（${item.num}）` : item.label;
        return item;
      }) : [];
    } else {
      return [];
    }
  }, [unDoNum, items]);

  const methods = useMethods({
    onSearch(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      setParams({
        ..._params,
        ...data,
      });
    },
    // 操作
    onOperate(event, row) {
      switch (event) {
        case 'handle':
          handleDrawer.current.init(row.id);
          break;
        case 'detail':
          detailDrawer.current.init(row.id);
          break;
        case 'transfer':
          transmitModal.current.init(row.id);
          break;
      }
    }
  });

  useEffect(() => {
    if (activeValue) {
      methods.onSearch({ type: activeValue });
    }
  }, [activeValue]);

  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: mainHeight }}
        extraContent={{
          top: <Search tabOptions={options} onSearch={methods.onSearch} searchForm={searchForm} />
        }}>
        <TableList tableRef={tableRef} onOperate={methods.onOperate} setUnDoNum={setUnDoNum} params={params}/>
      </V2Container>
      {/* 处理 */}
      <HandleDrawer ref={handleDrawer} onConfirm={methods.onSearch}/>
      {/* 转交 */}
      <TransmitModal ref={transmitModal} onConfirm={methods.onSearch}/>
      {/* 详情 */}
      <DetailDrawer ref={detailDrawer}/>
    </div>
  );
};
export default CorrectResourceError;
