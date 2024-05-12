/**
 * @Description 顶部部分
 */
import { FC, useState } from 'react';
import { Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { debounce } from '@lhb/func';
import styles from '../index.module.less';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import IconFont from '@/common/components/IconFont';

enum tabKeyEnum {
  Recom = '0',
  Collect = '1',
}

const tabItems = [
  { label: '推荐商圈', key: tabKeyEnum.Recom },
  { label: '收藏商圈', key: tabKeyEnum.Collect }
];

const Top: FC<any> = ({
  // isReset, // 是否重置参数
  detailData, // 详情
  searchKeywords,
  setSearchKeywords, // 设置搜索关键词
  searchParams, // 接口入参
  setSearchParams, // 设置接口请求参数
  totalInfo, // 总商圈个数和已开门店个数
  setIsFavourList, // 按照tab切换设置是否收藏列表
  setDetailData,
}) => {
  const [form] = Form.useForm();

  const [tabActiveKey, setTabActiveKey] = useState<string>(tabKeyEnum.Recom);

  // useEffect(() => {
  //   if (!isReset) return;
  //   form.resetFields(); // 清空搜索关键词
  //   setSelectedSort(sortType[0]); // 重置排序为默认
  // }, [isReset]);

  const methods = useMethods({
    onSearch: debounce((e: any) => { // 搜索
      const keywords = e?.target?.value;
      setSearchKeywords(keywords);

      if (tabActiveKey === tabKeyEnum.Recom) { // 处在推荐列表搜索时才改变推荐列表
        setSearchParams({
          ...searchParams,
          name: keywords
        });
      }
    }, 300),

  });

  const tabChange = (active: string) => {
    setTabActiveKey(active);
    setIsFavourList(active === tabKeyEnum.Collect);

    // 切换回推荐列表时，如果搜索词和前次请求时有变动，重新请求
    if (active === tabKeyEnum.Recom && searchKeywords !== searchParams.name) {
      setSearchParams({
        ...searchParams,
        name: searchKeywords
      });
    }
    if (detailData?.visible) {
      // 详情页时切换tab，执行返回相同处理
      setDetailData({
        id: null,
        visible: false,
        detail: null
      });
    }
  };

  return (
    <div className={styles.topSection}>
      <div className={styles.tabWrapper}>
        <V2Tabs
          items={tabItems}
          activeKey={tabActiveKey}
          onChange={tabChange}
        />
      </div>
      {
        detailData?.visible
          ? <></>
          : <>
            <div className='pt-12 pl-12 pr-12'>
              <V2Form form={form}>
                <V2FormInput
                  name='name'
                  placeholder='查询地点'
                  config={{ allowClear: true }}
                  prefix={<IconFont iconHref='icon-shousuo'/>}
                  onChange={(e: any) => methods.onSearch(e)}/>
              </V2Form>
            </div>
            <div className={styles.countCon}>
              共{ tabActiveKey === tabKeyEnum.Recom ? '推荐' : '收藏' } <span className='bold c-006 fs-14'>{totalInfo?.totalNum || 0}</span> 个商圈
            </div>
          </>
      }
    </div>
  );
};

export default Top;
