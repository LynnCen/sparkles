import { FC, ReactNode } from 'react';
import { Typography, Row, Col, Image } from 'antd';
import {
  PageContainer,
  Description,
  DetailTable,
  MapMarker,
  MapPolygon,
  VideoPlay,
  CurrentPrice,
  Floor
} from './components';
import { Group } from './store/site';
import { FilePreview } from '@/views/resaudit/components';
import { ControlType } from '@/common/enums/control';
import { QiniuImageUrl } from '@/common/utils/qiniu';
import SubForm from './components/SubForm';

const { Text } = Typography;

interface DetailProps {
  data?: Group[]
};

const colSpans24 = [4, 5, 6, 11, 12, 13, 15, 16, 27];
const colSpans8 = [8, 10];

const { PreviewGroup } = Image;


const Detail: FC<DetailProps> = ({ data = [] }) => {

  // 渲染多个组件
  const renderComponents = (components: { controlType: number, value: any, propertyName?: string, columns?: any, }[]) => {
    return components.map((component, index) => {
      const { controlType, value, propertyName, columns } = component;
      return (
        <Col
          key={index}
          span={
            colSpans24.includes(controlType)
              ? 24
              : colSpans8.includes(controlType) ? 8 : 8}>
          <Description
            label={propertyName}>
            {renderComponent(controlType, value, columns)}
          </Description>
        </Col>);
    });
  };

  const renderComponent = (type: number, value: any, columns?: any): ReactNode => {
    // const tableTtype = [11, 12, 13,16]
    switch (type) {
      // 渲染图片或者视频
      case ControlType.UPLOAD.value:
        return (
          <Row gutter={16}>
            {renderFiles(value)}
          </Row>
        );
      case ControlType.MAP_POLYGON.value:
        const { path } = value;
        return (<MapPolygon path={path} />);
      case ControlType.ADDRESS.value:
        const { address, longitude, latitude } = value;
        return (<MapMarker address={address} center={{ longitude, latitude }} />);
      case ControlType.FLOOR_DESC.value:
        if (value && value.floorDescriptionList && columns) {
          return <Floor dataSource={value.floorDescriptionList} columns={columns as any} />;
        }
        return null;
      case ControlType.FLOOR_INFO.value:
      case ControlType.CHANNEL_DESC.value:
      case ControlType.HISTORY_PRICE.value:
        if (value && columns) {
          return (<DetailTable dataSource={value} columns={columns as any} />);
        }
        return null;
      case ControlType.CURRENT_PRICE.value:
        const { list, reportPrice, otherPrice, orderPrice, remark } = value || {};
        if (list && columns) {
          return (
            <CurrentPrice
              dataSource={list}
              reportPrice={reportPrice}
              orderPrice={orderPrice}
              columns={columns}
              otherPrice={otherPrice}
              remark={remark}
            />);
        }
        return null;
      // 落位区域
      case ControlType.SPOT_POSITION.value:
        if (value) {
          const { type, url, name } = value;
          return (
            <Row gutter={16}>
              <PreviewGroup>
                <Col>
                  {renderFile(type, url, name)}
                </Col>
              </PreviewGroup>
            </Row>
          );
        }
        return null;
      // 子表单
      case ControlType.SUB_FORM.value:
        if (value && value.length) {
          return <SubForm data={value} />;
        }
        return <></>;
      default:
        return (<Text> {value || '-'}</Text>);
    }
  };

  // 渲染多个音视频组件
  const renderFiles = (files: { type: 'image' | 'video', url: string, name?: string }[]) => {
    return (
      <PreviewGroup>{
        files.map((file: any, index) => {
          const { type, url, coordinateUrl, name } = file;
          return (
            <Col key={index}>
              {renderFile(type, coordinateUrl || url, name)}
            </Col>
          );
        })
      }
      </PreviewGroup>
    );
  };

  // 渲染单个音视频组件
  const renderFile = (type: 'image' | 'video', src: string, name?: string) => {

    // 需要兼容处理通过saas后台上传的图片
    if (type && (type === 'image' || type.includes('image'))) {
      return (
        <Image
          src={QiniuImageUrl(src) || ''}
          width={80}
          height={80}
          alt={name} />
      );
    }

    if (type && (type === 'video' || (type as string).includes('video'))) {
      return (<VideoPlay src={src} />);
    }

    if (src.indexOf('img') > -1 || src.indexOf('pmsimage') > -1) { // 部分老数据没有type和name值
      return (
        <Image
          src={QiniuImageUrl(src) || ''}
          width={80}
          height={80}
          alt={name} />
      );
    }

    return (
      <FilePreview filename={name} url={src} />
    );
  };

  return (
    <>
      {
        data.map(item => {
          const { groupId, groupName, propertyList } = item;
          return (
            <PageContainer
              title={groupName}
              key={groupId}
              id={groupId as any}>
              <Row gutter={16}>
                {
                  renderComponents(propertyList as any)
                }
              </Row>
            </PageContainer>
          );
        })
      }
    </>
  );
};

export default Detail;
