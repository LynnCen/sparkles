import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import SearchForm from '@/common/components/Form/SearchForm';
import FormThreeLevelIndustry from '@/common/components/FormBusiness/FormThreeLevelIndustry';
import TableList from './components/TableList/index';
import EditModal from '@/views/brandCenter/components/EditModal';
import DetailDrawer from './components/Drawer';
import { Cascader, Button } from 'antd';
import { useMethods } from '@lhb/hook';
import { brandSelection } from '@/common/api/brand-center';
import { deepCopy, matchQuery } from '@lhb/func';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';

const defaultTab = { key: '0', label: '全部品牌' };

const BrandCenter: FC<any> = () => {
  const tableRef = useRef();
  const [params, setParams] = useState({});
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<any>();
  const [tabItems, setTabItems] = useState<any[]>([defaultTab]);
  const [activeKey, setActiveKey] = useState<string | undefined>('0');
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    methods.getSelection();
  }, []);

  const methods = useMethods({
    getSelection: async () => {
      const res = await brandSelection();
      if (Array.isArray(res.types)) {
        const types = res.types.map(itm => ({
          key: `${itm.id}`,
          label: itm.name,
        }));
        setTabItems([defaultTab, ...types]);
      }
    },
    onSearch(values: any) {
      let vals = deepCopy(values);
      if (vals.industryIds) {
        if (vals.industryIds.length > 0) {
          vals = Object.assign(vals, {
            oneIndustryId: vals.industryIds[0],
          });
        }
        if (vals.industryIds.length > 1) {
          vals = Object.assign(vals, {
            twoIndustryId: vals.industryIds[1],
          });
        }
        if (vals.industryIds.length > 2) {
          vals = Object.assign(vals, {
            threeIndustryId: vals.industryIds[2],
          });
        }
      } else {
        vals = Object.assign(vals, {
          oneIndustryId: undefined,
          twoIndustryId: undefined,
          threeIndustryId: undefined,
        });
      }
      delete vals.industryIds;
      setParams({ ...params, ...vals, });
    },
    onReset() {
      setParams({
        type: (activeKey && (+activeKey > 0)) ? +activeKey : undefined,
      });
    },
    onRefresh() {
      (tableRef?.current as any).onload?.();
    }
  });

  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey);
    setParams({ ...params, ...{
      type: (activeKey && (+activeKey > 0)) ? +activeKey : undefined,
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
            <V2Tabs items={tabItems} activeKey={activeKey} onChange={onTabChange}/>
            <SearchForm
              colon={false}
              onOkText='搜索'
              onSearch={methods.onSearch}
              onReset={methods.onReset}
              rightOperate={
                permissions.find(item => item.event === 'brandLibrary:create') && <Button type='primary' onClick={() => setEditModalVisible(true)}>{permissions.filter(item => item.event === 'brandLibrary:create')[0].name || '新增品牌'}</Button>
              }>
              <V2FormInput
                label='名称查找'
                name='name'
                placeholder='请输入品牌名称/ID'
                maxLength={50}/>
              <FormThreeLevelIndustry
                label='选择行业'
                name='industryIds'
                allowClear={true}
                config={{
                  changeOnSelect: true,
                  showCheckedStrategy: Cascader.SHOW_CHILD,
                  showSearch: true,
                  maxTagCount: 'responsive'
                }}
                placeholder='选择所属行业'
              />
              <V2FormRangeInput
                label='门店数量'
                name={['minShopCount', 'maxShopCount']}
                min={0}
                max={9999999}
                precision={0}
              />
            </SearchForm>
          </>
        }}
      >
        <TableList
          ref={tableRef}
          params={params}
          setPermissions={setPermissions}
          openDetail={(id) => {
            setCurrentId(id);
            setDrawerVisible(true);
          }}/>
        <EditModal visible={editModalVisible} setVisible={setEditModalVisible} onOK={methods.onRefresh}/>
        <DetailDrawer id={currentId} open={drawerVisible} setOpen={setDrawerVisible} onRefresh={methods.onRefresh} onReset={methods.onReset}/>
      </V2Container>
    </div>
  );
};

export default BrandCenter;
