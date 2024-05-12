import { FC, useState, useEffect, useRef } from 'react';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import SearchForm from '@/common/components/Form/SearchForm';
import TableList from './components/TableList';
import DetailDrawer from './components/Drawer';
import { brandSelection } from '@/common/api/brand-center';
import { deepCopy, matchQuery } from '@lhb/func';
import dayjs from 'dayjs';

const tabItems = [
  { key: '0', label: '全部品牌' },
  { key: '1', label: '品牌新增' },
  { key: '2', label: '品牌修改' },
  { key: '3', label: '品牌删除' },
];

const Approve: FC<any> = () => {
  const tableRef = useRef();
  const [params, setParams] = useState({});
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentReviewId, setCurrentReviewId] = useState<any>();
  const [currentBrandId, setCurrentBrandId] = useState<any>();
  const [activeKey, setActiveKey] = useState<string | undefined>('0');
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  useEffect(() => {
    methods.getSelection();
  }, []);

  const methods = useMethods({
    getSelection: async () => {
      const res = await brandSelection();
      if (Array.isArray(res.status)) {
        const statuses = res.status.map(itm => ({
          value: itm.id,
          label: itm.name,
        }));
        setStatusOptions(statuses);
      }
    },
    onSearch(values: any) {
      // console.log('onSearch1 原始筛选项', deepCopy(values));
      let vals = deepCopy(values);
      if (Array.isArray(vals.commitTime) && vals.commitTime.length === 2) {
        vals = Object.assign(vals, {
          commitTimeStart: dayjs(vals.commitTime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          commitTimeEnd: dayjs(vals.commitTime[1]).format('YYYY-MM-DD') + ' 23:59:59',
        });
      } else {
        vals = Object.assign(vals, {
          commitTimeStart: undefined,
          commitTimeEnd: undefined,
        });
      }
      delete vals.commitTime;

      // console.log('onSearch2 修改后筛选项', deepCopy(vals));
      // console.log('onSearch3 提交参数', { ...params, ...vals });
      setParams({ ...params, ...vals });
    },
    onReset() {
      setParams({
        operateType: (activeKey && (+activeKey > 0)) ? +activeKey : undefined,
      });
    },
    onRefresh() {
      (tableRef?.current as any).onload?.();
    }
  });

  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey);
    setParams({ ...params, ...{
      operateType: (activeKey && (+activeKey > 0)) ? +activeKey : undefined,
    }, });
  };

  return (
    <div className={styles.container}>
      <V2Container
        /*
          减去高度设置90 = 顶部条高度48 + container上margin16 + container下margin16 + container上padding10；
          减去高度大于这个值，页面底部留白大于预期；
          减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；

          如果是作为外部加载页面，比如邻汇吧后台，不需要考虑顶部条高度48和container上下margin各16，则为10px
        */
        style={{ height: matchQuery(location.search, 'source') ? 'calc(100vh - 10px)' : 'calc(100vh - 90px)' }}
        extraContent={{
          top: <>
            <V2Tabs items={tabItems} onChange={onTabChange}/>
            <SearchForm
              colon={false}
              onOkText='搜索'
              onSearch={methods.onSearch}
              onReset={methods.onReset}
            >
              <V2FormRangePicker
                label='提交时间'
                name='commitTime'
              />
              <V2FormInput
                label='品牌名称'
                name='brandName'
                maxLength={50}
              />
              <V2FormSelect
                label='审核状态'
                name='reviewStatus'
                options={statusOptions}
              />
            </SearchForm>
          </>
        }}
      >
        <TableList
          ref={tableRef}
          params={params}
          openDetail={(reviewId, brandId) => {
            console.log('openDetail', reviewId, brandId);
            setCurrentReviewId(reviewId);
            setCurrentBrandId(brandId);
            setDrawerVisible(true);
          }}/>
        <DetailDrawer
          reviewId={currentReviewId}
          brandId={currentBrandId}
          open={drawerVisible}
          setOpen={setDrawerVisible}
          onRefresh={methods.onRefresh}/>
      </V2Container>
    </div>
  );
};

export default Approve;
