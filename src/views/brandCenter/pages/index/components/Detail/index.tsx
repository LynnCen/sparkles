import { FC, forwardRef, useState, useImperativeHandle } from 'react';
import { Affix } from 'antd';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Top from './Top';
import Basic from './Basic';
import ShopImages from './ShopImages';
import ShopFiles from './ShopFiles';
import { brandDetail } from '@/common/api/brand-center';
import { useMethods } from '@lhb/hook';
import Sale from './Sale';
import Attention from './Attention';
import Extra from './Extra';
import Location from './Location';
import Enterprise from './Enterprise';
import Contact from './Contact';

const tabItems = [
  { key: '1', label: '基本信息' },
  { key: '2', label: '销售信息' },
  { key: '3', label: '影响力' },
  { key: '4', label: '扩展信息' },
  { key: '5', label: '选址要求' },
  { key: '6', label: '联系人' },
  { key: '7', label: '所属公司' },
  { key: '8', label: '门店照片' },
  { key: '9', label: '附件' },
];

/*
  品牌详情
*/
const DetailMain: FC<any> = forwardRef(({
  id,
  container,
  onRefresh,
  onReset,
  setOpen,
}, ref) => {
  const [activeKey, setActiveKey] = useState<string>('1');
  useImperativeHandle(ref, () => ({
    onload: () => {
      methods.getDetail();
    },
  }));

  const [tabAffixed, setTabAffixed] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const methods = useMethods({
    async getDetail() {
      const data = await brandDetail({ id });
      setDetail(data);
    },
    changeDetail(obj: any, doRefresh = true) {
      setDetail({
        ...detail,
        ...obj,
      });
      // 门店照片删除和附件删除，是不需要刷新列表的
      doRefresh && onRefresh();
    }
  });
  const renderChild = () => {
    switch (activeKey) {
      case '1':
        return <Basic detail={detail || {}} companyName={detail.titleInfo?.companyName}/>;
      case '2':
        return <Sale info={detail.saleInfo || {}} />;
      case '3':
        return <Attention info={detail.attentionInfo || {}} />;
      case '4':
        return <Extra info={detail.extraInfo || {}} />;
      case '5':
        return <Location info={detail.locationInfo || {}} />;
      case '6':
        return <Contact id={detail.titleInfo?.id} />;
      case '7':
        return <Enterprise info={detail.enterpriseInfo || {}} />;
      case '8':
        return <ShopImages info={detail.brandPicture || []} id={detail.titleInfo?.id} permissions={detail.permissions} changeDetail={methods.changeDetail}/>;
      case '9':
        return <ShopFiles info={detail.brandAnnex || []} id={detail.titleInfo?.id} permissions={detail.permissions} changeDetail={methods.changeDetail}/>;
      default:
        return null;
    }
  };
  return (
    <>
      <Top
        target={() => container}
        tabAffixed={tabAffixed}
        detail={detail.titleInfo || {}}
        permissions={detail.permissions || []}
        gainHonor={detail.gainHonor || {}}
        honorRankInfo={detail.honorRankInfo || {}}
        getDetail={methods.getDetail}
        onReset={onReset}
        setOpen={setOpen}
        onRefresh={onRefresh}
      />
      <Affix target={() => container} offsetTop={0} onChange={(affixed) => setTabAffixed(!!affixed)}>
        <V2Tabs items={tabItems} activeKey={activeKey} onChange={setActiveKey}/>
      </Affix>
      {
        renderChild()
      }
    </>
  );
});

export default DetailMain;
