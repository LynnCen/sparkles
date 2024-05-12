/**
 * @Description 商圈报告中的机会点
 */


import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { getDynamicDetail } from '@/common/api/expandStore/chancepoint';
import { useMethods } from '@lhb/hook';
import { ChildreClass } from '../../ts-config';
import { PageHeader, PageFooter } from '../Layout';
import { isArray } from '@lhb/func';
import { analysisTableTitle } from '@/common/components/business/DynamicComponent/config';
import cs from 'classnames';
import styles from './index.module.less';
import Map from './Map';

const Chancepoint: FC<any> = ({
  id,
  token,
  tenantId,
  businessDetail, // 商圈详情
  homeData,
  targetChildClass,
  // computeModuleMap,
  // moduleMapCount
}) => {
  const [listData, setListData] = useState<any[]>([]); // 机会点列表数据
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    +id && loadData();
  }, [id]);
  // useEffect(() => {
  //   if (listData.length > 0) {
  //     computeModuleMap('chancePoint', true);
  //   }
  // }, [listData]);

  const {
    loadData,
  } = useMethods(({
    loadData: async () => {
      const targetData = await getDynamicDetail({
        page: 1,
        size: 3, // 展示3个
        modelClusterId: id,
        dynamicTemplateType: 2, // 动态表头模版类型 ： 1：机会点， 2:选址地图商圈  默认1
        pdfPageUserToken: token,
      });
      const { objectList, totalNum } = targetData || {};
      // let arr:any = {};
      // const res = objectList?.map((item) => {
      //   item?.columns?.map((i) => {
      //     const res = analysisTableTitle(i);
      //     arr = {
      //       ...arr,
      //       [i.identification]: res
      //     };
      //   });
      //   // 是否包含有动态配置的机会点名称
      //   return {
      //     id: item.id,
      //     // 固定写死项目
      //     name: item.name,
      //     accountName: item.accountName,
      //     statusName: item.statusName,
      //     // 动态表头项目
      //     ...arr,
      //   };
      // });
      // console.log(`res`, res);
      setListData(isArray(objectList) ? objectList : []);
      setTotal(totalNum || 0);
    }
  }));
  return (
    <>
      {
        listData?.length > 0 ? <div className={cs(ChildreClass, targetChildClass || '', styles.chancepointCon)}>
          <PageHeader
            // moduleCount={Number(moduleMapCount.chancePoint)}
            title='机会点位'
          />
          <div className={styles.mainCon}>
            <div className='c-666 mb-8'>
              区域内有<span className='c-222 bold'>{total}</span>个关联机会点位
            </div>
            <Map
              data={listData}
              businessDetail={businessDetail}
            />
            {
              listData?.map((item, index: number) => <div key={index} className={styles.chancepointItem}>
                <Row>
                  <Col span={20} className='ellipsis font-weight-500'>
                    机会点{index + 1}-{item.name}
                  </Col>
                  <Col span={4} className='rt'>
                    <a href={`${process.env.STORE_ASSISTANT_URL}/standardstore/chancepointdetail?id=${item.id}&tenantId=${tenantId}`}>查看详情</a>
                  </Col>
                </Row>
                <Row>
                  {
                    item?.columns?.map((fieldsItem, i: number) => <Col
                      key={i}
                      span={12}
                      className='mt-10 fs-14'
                    >
                      <span className='c-666'>{fieldsItem.propertyName}：</span>
                      <span className='c-222 bold'>{analysisTableTitle(fieldsItem) || '-'}</span>
                    </Col>)
                  }
                </Row>
              </div>)
            }
          </div>
          <div className={styles.footerCon}>
            <PageFooter logo={homeData?.tenantLogo}/>
          </div>
        </div> : <></>
      }
    </>
  );
};

export default Chancepoint;
