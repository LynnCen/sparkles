import { FC, useState, useEffect, useRef } from 'react';
import { Descriptions, Button } from 'antd';
import { shopRecommendDetail } from '@/common/api/recommend';
import styles from '../entry.module.less';
import Tables from '@/common/components/FilterTable';
// import ModalForm from './ModalForm';
// import ModalAssigned from './ModalAssigned';

const Result: FC<any> = ({
  id,
  aggregatedData,
  targetHighlight
}) => {
  const tableRef = useRef(null);
  const [detail, setDetail] = useState<any>({});
  const [fold, setFold] = useState<boolean>(false);
  // const [modalData, setModalData] = useState<any>({
  //   visible: false
  // });
  // const [assignedModal, setAssignedModal] = useState<any>({
  //   visible: false,
  //   detail: null
  // });
  const columns = [
    {
      title: '序号',
      key: 'id',
      // width: 200,
      render: (value, record, index) => (index + 1)
    },
    {
      title: '区域',
      key: 'area',
      render: (value, record, index) => (
        <Button type='link' onClick={() => targetHighlight(record)}>
          区域{index + 1}
        </Button>
      )
    },
    // {
    //   title: '操作',
    //   key: 'permissions',
    //   render: () => (
    //     <Button type='link' onClick={() => createHandle()}>
    //       创建踩点任务
    //     </Button>
    //   )
    // },
    // {
    //   key: 'permissions',
    //   title: '区域最佳点位',
    //   // width: 200,
    //   // fixed: 'right',
    //   render: (value, record) => (
    //     // <Button
    //     //   operateList={refactorPermissions(value)}
    //     //   onClick={(btn: any) => methods[btn.func](record)}/>
    //     <Button type='text' onClick={(record) => targetHighlight(record)}>
    //       { record.name }
    //     </Button>
    //   ),
    // },
  ];
  const mockData = {
    categoryStr: '高消费人群、商务白领',
    ageStr: '20-30岁、30-40岁、40-50岁',
    marriageStr: '已婚已育',
    educationStr: '本科、硕士及以上',
  };
  useEffect(() => {
    getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Array.isArray(aggregatedData) && aggregatedData.length) {
      // 手动触发一次
      (tableRef.current as any).onload();
    }
  }, [aggregatedData]);

  const getDetail = () => {
    // setDetail({
    //   province: '浙江省',
    //   city: '杭州市',
    //   district: '滨江区',
    //   industry: '夸父炸串',
    //   shopCategory: '商场',
    //   scope: '2KM',
    //   industryEcology: '撸串',
    //   industryEcologyNum: 199,
    //   unitPriceMin: '33',
    //   unitPriceMax: '3333',
    //   synergyBrand: '夸父小吃',
    //   competitiveBrand: '无良印品',
    //   housePriceMin: '28000',
    //   housePriceMax: '58000'
    // });
    shopRecommendDetail({ id })
      .then((res) => {
        setDetail(res);
      });
  };

  // const targetHighlight = (item: any) => {
  //   console.log(item);
  // };

  const loadData = () => {
    return Promise.resolve({
      dataSource: aggregatedData || []
    });
  };

  // const createHandle = () => {
  //   setModalData({ visible: true });
  // };

  return (
    <div className={styles.resultCon}>
      <div className='right'>
        <Button type='primary' onClick={() => setFold(!fold)}>{ fold ? '展开' : '收起' }</Button>
      </div>
      <div className={ fold ? 'hide' : '' }>
        <Descriptions title='选址要求' column={24}>
          <Descriptions.Item
            label='意向开店行业'
            span={24}>
            { detail.preferIndustryName }
          </Descriptions.Item>
          <Descriptions.Item
            label='意向店铺类型'
            span={24}>
            { detail.shopCategoryName }
          </Descriptions.Item>
          <Descriptions.Item
            label='参考辐射范围'
            span={24}>
            { detail.scopeName }
          </Descriptions.Item>
          <Descriptions.Item
            label='周边商业氛围'
            span={24}>
            { detail.industryEcologyList && detail.industryEcologyList.map((val) => val.name).join('/') }，共{detail.industryEcologyNum}家
          </Descriptions.Item>
          <Descriptions.Item
            label='目标客单价'
            span={24}>
            {detail.unitPriceMin} - {detail.unitPriceMax}
            {detail.unitPriceMin || detail.unitPriceMax ? '元' : ''}
          </Descriptions.Item>
          <Descriptions.Item
            label='周边客群消费水平'
            span={24}>
            { detail.consumptionLevelName || '-' }
          </Descriptions.Item>
          <Descriptions.Item
            label='周边客群分类'
            span={24}>
            { mockData.categoryStr }
          </Descriptions.Item>
          <Descriptions.Item
            label='年龄状况'
            span={24}>
            { mockData.ageStr }
          </Descriptions.Item>
          <Descriptions.Item
            label='婚育状况'
            span={24}>
            { mockData.marriageStr }
          </Descriptions.Item>
          <Descriptions.Item
            label='学历状况'
            span={24}>
            { mockData.educationStr }
          </Descriptions.Item>
          <Descriptions.Item
            label='周边二手房价'
            span={24}>
            {detail.housePriceMin} - {detail.housePriceMax}
            {detail.housePriceMin || detail.housePriceMax ? '元' : ''}
          </Descriptions.Item>
          <Descriptions.Item
            label='协同品牌'
            span={24}>
            {detail.synergyBrand || '-'}
          </Descriptions.Item>
          <Descriptions.Item
            label='竞争品牌'
            span={24}>
            {detail.competitiveBrand || '-'}
          </Descriptions.Item>
        </Descriptions>

        <Tables
          ref={tableRef}
          columns={columns}
          onFetch={loadData}
          pagination={false}
          className='mt-20'
          rowKey={(record) => `${record.index}-${record.score}`}
          bordered={true}/>
      </div>
      {/* <ModalForm
        modalData={modalData}
        modalHandle={() => setModalData({ visible: false })}
        assignedHandle={setAssignedModal}/>
      <ModalAssigned
        modalData={assignedModal}
        modalHandle={() => setAssignedModal({ visible: false, detail: null })}/> */}
    </div>
  );
};

export default Result;
