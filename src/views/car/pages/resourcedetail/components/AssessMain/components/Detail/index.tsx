import { FC, ReactNode, useEffect } from 'react';
import { Row, Col, Form, Divider } from 'antd';
import {
  DetailTable,
  MapPolygon,
  Floor
} from './components';
import { Group } from '@/views/car/pages/resourcedetail/ts-config';
import { ControlType, getValues } from '../../../../utils';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { LocationMap } from '@/common/components/business/StoreDetail';
import V2Title from '@/common/components/Feedback/V2Title';
import styles from './index.module.less';
const { useForm } = Form;
interface DetialProps {
  data?: Group[];
  actions?: ReactNode;
};

export const colSpans24 = [10, 8, 11, 12, 13, 16, 15, 4];

const Detail: FC<DetialProps> = ({ data = [] }) => {
  const [form] = useForm();
  // 渲染多个组件
  const renderComponents = (components: { controlType: number, value: any, propertyName?: string, columns?: any, propertyGroupConfig?: any }[]) => {
    return components.map((component, index) => {
      const { controlType, value, propertyName, columns, } = component;
      return (
        <Col
          key={index}
          span={
            colSpans24.includes(controlType)
              ? 24
              : 8 }
        >
          {renderComponent(controlType, value, columns, propertyName)}
        </Col>);
    });
  };

  const renderComponent = (type: number, value: any, columns?: any, propertyName?:any): ReactNode => {
    switch (type) {
    // 渲染图片或者视频
      case ControlType.UPLOAD.value:
        if (value) {
          return (
            <V2DetailItem label={propertyName} type='files' assets={renderFiles(value)}/>
          );
        }
        return null;
      case ControlType.MAP_POLYGON.value:
        const { path } = value || {};
        return (
          <V2DetailItem label={'地理围栏'}>
            <MapPolygon path={path}/>
          </V2DetailItem>
        );
      case ControlType.ADDRESS.value:
        return (
          <V2DetailItem label={propertyName} value={value?.address} >
            <LocationMap lng={value?.longitude} lat={value?.latitude} />
          </V2DetailItem>);
      case ControlType.FLOOR_DESC.value:
        return <V2DetailItem label={propertyName}>
          <Floor dataSource={value.floorDescriptionList} columns={columns as any}/>
        </V2DetailItem>;
      case ControlType.FLOOR_INFO.value:
      case ControlType.CHANNEL_DESC.value:
      case ControlType.HISTORY_PRICE.value:
        return (
          <V2DetailItem label={propertyName}>
            <DetailTable dataSource={value} columns={columns as any}/>
          </V2DetailItem>
        );
        // 良辰说不再有当前控件
      // case ControlType.CURRENT_PRICE.value:
      //   window.alert('当前报价');
      //   const { list, reportPrice, otherPrice, orderPrice, remark } = value;
      //   return (
      //     <CurrentPrice
      //       dataSource={list}
      //       reportPrice={reportPrice}
      //       orderPrice={orderPrice}
      //       columns={columns}
      //       otherPrice={otherPrice}
      //       remark={remark}
      //     />);
        // 只在移动端展示
      // 落位区域
      // case ControlType.SPOT_POSITION.value:
      //   window.alert('落位区域');
      //   if (value) {
      //     const { type, url, name } = value;
      //     return (
      //       <Row gutter={16}>
      //         <PreviewGroup>
      //           <Col>
      //             {renderFile(type, url, name)}
      //           </Col>
      //         </PreviewGroup>
      //       </Row>
      //     );
      //   }
      //   return null;
      default:
        return (
          <V2DetailItem label={propertyName} value={value} />
        );
    }
  };

  // 渲染多个音视频组件
  const renderFiles = (files: { type: 'image'| 'video', url: string, name?: string }[]) => {
    const newFiles:any = [];
    files.map((item) => {
      let originalUrl = item?.url || '';
      if (originalUrl.indexOf('middle-file.linhuiba.com/') > -1) {
        originalUrl += '';
      } else if (originalUrl.indexOf('-linhuiba_watermark') === -1) { // 来自邻汇吧项目的图
        originalUrl += '-linhuiba_watermark';
      } else if (originalUrl.indexOf('pmsimage.location.pub') > -1) { // 来自pms项目的图
        originalUrl += '-pms_original';
      }
      newFiles.push({ url: originalUrl, name: item?.name, type: item?.type });
    });
    return newFiles;
  };

  useEffect(() => {
    if (!data.length) {
      return;
    }
    form.setFieldsValue(getValues(data));
  }, [form, data]);
  return (
    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} className={styles.formContainer}>
      {
        data.map((item, index) => {
          const { groupId, groupName, propertyList } = item;
          return (
            <>
              {propertyList?.length ? <V2Title
                id={groupId}
                type='H2'
                divider
                text={groupName}
              /> : null}
              <Row gutter={16}>
                {
                  renderComponents(propertyList as any)
                }
              </Row>
              {/* 有子元素且不是最后一项需要分割线 */}
              {(propertyList?.length && index !== data.length - 1) ? <Divider/> : null}
            </>);
        })
      }
    </Form>
  );
};

export default Detail;
