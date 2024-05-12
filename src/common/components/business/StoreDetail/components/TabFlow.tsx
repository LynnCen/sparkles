import { FC } from 'react';
import { Row, Image } from 'antd';
import { isArray } from '@lhb/func';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailInfo from '@/common/components/business/DetailInfo';

const TabFlow: FC<any> = ({ result, isTargetShop, isFood }) => {
  return (
    <>
      {isFood || isTargetShop ? null : (
        <>
          <TitleTips name='周边聚客点' showTips={false} />
          <Row>
            <DetailInfo title='学校数量(个)' value={result?.flowInformation?.schoolCount} />
            <DetailInfo title='写字楼数量(个)' value={result?.flowInformation?.officeBuildingCount} />
            <DetailInfo title='小区数量(个)' value={result?.flowInformation?.communityCount} />
          </Row>
        </>
      )}

      <TitleTips name='客流信息' showTips={false} />
      {isFood ? (
        <>
          <DetailInfo title='周边3公里人口数量（人）' value='170000' />
          <DetailInfo title='门前客流动线' value='客流主动线' />
          <DetailInfo title='工作日日均客流（人/天）' value='4000' />
          <DetailInfo title='节假日日均客流（人/天）' value='6000' />
          <DetailInfo title='目标客群' value='中档消费人群' />
          <DetailInfo title='目标客群占比（%）' value='40' />
          <DetailInfo title='目标消费年龄' value='20-40' />
          <DetailInfo title='目标消费年龄占比（%）' value='70' />
        </>
      ) : (
        <>
          <Row>
            <DetailInfo title='门前人流动线' value={result?.flowInformation?.flowLineName} />
            {!isTargetShop && (
              <DetailInfo title='距门口人流动线的距离(米)' value={result?.flowInformation?.flowLineDistance} />
            )}
            <DetailInfo title='工作日日均客流（人次）' value={result?.flowInformation?.flowWeekday} />
            <DetailInfo title='节假日日均客流（人次）' value={result?.flowInformation?.flowWeekend} />
            <DetailInfo title='备注' value={result?.flowInformation?.flowRemark} />
            <DetailInfo span={24} title='客流证明材料一'>
              {isArray(result?.flowInformation?.flowEvidenceImageUrl) ? (
                <>
                  {result.flowInformation.flowEvidenceImageUrl.map((item, idx) => (
                    <Image key={idx} width={150} height={150} src={item} />
                  ))}
                </>
              ) : (
                '-'
              )}
              {/* // <List split={false} size='small'>
                //   {result?.flowInformation?.flowEvidenceImageUrl.map((item, idx) => (
                //     <List.Item key={'list-' + idx}>
                //       <Button
                //         key={idx}
                //         type='link'
                //         onClick={() => {
                //           downloadFile({
                //             name: item.name,
                //             url: item.url,
                //             downloadUrl: item.url + '?attname=' + item.name,
                //           });
                //         }}
                //       >
                //         {item.name}
                //       </Button>
                //     </List.Item>
                //   ))}
                // </List> */}
            </DetailInfo>

            <DetailInfo span={24} title='客流证明材料二'>
              {isArray(result?.flowInformation?.flowEvidenceExcelUrl) ? (
                // <List split={false} size='small'>
                //   {result?.flowInformation?.flowEvidenceExcelUrl.map((item, idx) => (
                //     <List.Item key={'list-' + idx}>
                //       <Button
                //         key={idx}
                //         type='link'
                //         onClick={() => {
                //           downloadFile({
                //             name: item.name,
                //             url: item.url,
                //             downloadUrl: item.url + '?attname=' + item.name,
                //           });
                //         }}
                //       >
                //         {item.name}
                //       </Button>
                //     </List.Item>
                //   ))}
                // </List>
                <>
                  {result.flowInformation.flowEvidenceExcelUrl.map((item, index) => (
                    <a href={item} key={index} target='_blank'>
                      {item}
                    </a>
                  ))}
                </>
              ) : null}
            </DetailInfo>
            {!isTargetShop ? (
              <>
                <DetailInfo title='进店率(%)' value={result?.flowInformation?.intoRate} />
                <DetailInfo title='转化率(%)' value={result?.flowInformation?.conversionRate} />
              </>
            ) : null}
          </Row>
          {/* 店铺类型-商场 */}
          {isTargetShop ? (
            <>
              <TitleTips name='客群信息' showTips={false} />
              <Row>
                <DetailInfo title='目标客群'>
                  {result?.flowInformation?.targetConsumptionLevelName || '-'}
                  {result?.flowInformation?.targetConsumptionLevel ? (
                    <span>，占比{result?.flowInformation?.consumptionLevelRate}%</span>
                  ) : null}
                </DetailInfo>
                <DetailInfo title='目标客群年龄'>
                  {result?.flowInformation?.targetConsumptionAgeName || '-'}
                  {result?.flowInformation?.targetConsumptionAge ? (
                    <span>，占比{result?.flowInformation?.consumptionAgeRate}%</span>
                  ) : null}
                </DetailInfo>
              </Row>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default TabFlow;
