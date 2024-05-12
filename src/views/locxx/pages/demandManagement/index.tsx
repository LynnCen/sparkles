import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import { Badge, Form } from 'antd';
import Search from './components/Search';
import TableList from './components/TableList';
import { useMethods } from '@lhb/hook';
import { KeepAlive, useActivate } from 'react-activation';
import { matchQuery } from '@lhb/func';
import V2Container from '@/common/components/Data/V2Container';
import { useLocation } from 'react-router-dom';
import { urlParams } from '@lhb/func';
import Edit from './components/Edit/index';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { get } from '@/common/request/index';
import { DemandStatus, DemandStatusName, TwoLevelTab } from './ts-config';

// 交易平台/需求管理
const DemandManagementIndex: FC<{ provideFor?:String }> = ({ provideFor = 'demandManagement' }) => {

  const [allNum, setAllNum] = useState(0);
  const [myNum, setMyNum] = useState(0);
  const oriTabs = provideFor === 'demandManagement'
    ? [
      { label: '全部', key: '1', showDot: false, color: 'transparent' },
      { label: '待外呼', key: '4', showDot: false, color: 'transparent' },
      { label: '待跟进', key: '5', showDot: allNum > 0 || myNum > 0, color: allNum > 0 || myNum > 0 ? 'red' : 'transparent' },
      { label: '有需求', key: '6', showDot: false, color: 'transparent' },
      { label: '无需求', key: '7', showDot: false, color: 'transparent' }
    ]
    : [
      { label: '待审核', key: '2', showDot: false, color: 'transparent' },
      { label: '已审核', key: '3', showDot: false, color: 'transparent' }
    ];

  const tableRef: any = useRef();
  const editRef = useRef<any>(null);

  const [searchForm] = Form.useForm();
  const [params, setParams] = useState({ oneLevelTab: '1' });
  const [permissions, setPermissions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [twoLevelTab, setTwoLevelTab] = useState(1);

  const { search } = useLocation();
  const { id } = urlParams(search);

  useEffect(() => {
    setParams((state) => ({ ...state, id, oneLevelTab: provideFor === 'demandManagement' ? '1' : '2' }));
    setActiveKey(provideFor === 'demandManagement' ? '1' : '2');
    methods.getTwoLevelTabNum();
  }, []);

  useActivate(() => {
    // 编辑和删除等会改变列内容的操作，返回时需要携带
    // example: dispatchNavigate('/passengerFlow?reset=1')
    const reset = matchQuery(window.location.href, 'reset');
    if (reset) { // 建议在编辑或者删除时使用
      tableRef.current.onload(true); // 使用当前page，不会把page页码变成1
    } else {
      methods.onSearch(); // 会把page页码变成1，size变成默认的页面展示条数
    }
  });

  const methods = useMethods({
    onSearch(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      activeKey === DemandStatus.WAIT_FOLLOW_UP && methods.getTwoLevelTabNum();
      setParams({
        ..._params,
        ...data,
      });
    },
    // 新增/编辑需求
    edit(id, type?:string, record?:any) {
      editRef.current?.init(id, type, record);
    },
    // 需求保存回调
    editComplete(demandStageName?:string) {
      // 切换到相应的需求阶段tab
      if (demandStageName) {
        setActiveKey(DemandStatusName[demandStageName]);
        methods.onSearch({ oneLevelTab: DemandStatusName[demandStageName] });
      }
      tableRef.current.onload(true);
      activeKey === DemandStatus.WAIT_FOLLOW_UP && methods.getTwoLevelTabNum();
    },
    tabChange(key:string) {
      setActiveKey(key);
      setTwoLevelTab(1);
      methods.onSearch({ oneLevelTab: key });
      key === DemandStatus.WAIT_FOLLOW_UP && methods.getTwoLevelTabNum();
    },
    getTwoLevelTabNum() {
      // locxx待办数量
      // https://yapi.lanhanba.com/project/307/interface/api/63797
      get('/locxx/requirement/todoNumber', { oneLevelTab: activeKey, twoLevelTab: twoLevelTab || 1 }, { proxyApi: '/lcn-api' }).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setAllNum(res.find(item => item.twoLevelTab === TwoLevelTab.ALL)?.num || 0);
          setMyNum(res.find(item => item.twoLevelTab === TwoLevelTab.PENDING_FIRST_VISIT)?.num || 0);
        }
      });
    }
  });

  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 100px)' }}
        extraContent={{
          top: <>
            <V2Tabs
              activeKey={activeKey}
              onChange={methods.tabChange}
              items={oriTabs && oriTabs.map((item) => ({ label: <Badge dot={item?.showDot} offset={[2, 2]} color={item?.color}>{item?.label || ''}</Badge>, key: item?.key }))}
            />
            <div style={{ display: selectedRowKeys?.length ? 'none' : 'block' }}>
              <Search
                onSearch={methods.onSearch}
                searchForm={searchForm}
                permissions={permissions}
                edit={methods.edit}
                type={activeKey}
                twoLevelTab={twoLevelTab}
                setTwoLevelTab={setTwoLevelTab}
                allNum={allNum}
                myNum={myNum}
              />
            </div>
          </>,
        }}>
        <TableList
          tableRef={tableRef}
          params={params}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          permissions={permissions}
          setPermissions={setPermissions}
          edit={methods.edit}
          type={activeKey}
          twoLevelTab={twoLevelTab}
          updateDemandTwoLevelNum={methods.getTwoLevelTabNum}
        />
      </V2Container>

      {/* 编辑 */}
      <Edit ref={editRef} onConfirm={methods.editComplete}/>

    </div>
  );
};
export default ({ provideFor }) => (
  <KeepAlive saveScrollPosition='screen' provideFor={provideFor}>
    <DemandManagementIndex provideFor={provideFor}/>
  </KeepAlive>
);
