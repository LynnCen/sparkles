import { Image } from 'antd';
import { FC, useMemo } from 'react';
import { QiniuImageUrl } from '@/common/utils/qiniu';
import PolygonMap from './PolygonMap';
import DynamicFloorInfo from './DynamicFloorInfo';
import DynamicFloorDesc from './DynamicFloorDesc';
import styles from './index.module.less';
import { ControlType } from '@/common/enums/control';
import { FilePreview } from '@/views/resaudit/components';
import { VideoPlay } from '@/views/resmng/pages/real-detail/components';
import MapMarker from '@/views/resmng/pages/real-detail/components/MapMarker';
import SubForm from '@/views/resmng/pages/real-detail/components/SubForm';

const { PreviewGroup } = Image;

const Info: FC<any> = ({ controlType, info }) => {

  /* methods */
  // const isUrlTypeImage = (url: string) => {
  //   return url && (url.includes('img.linhuiba.com/') || url.includes('pmsimage.location.pub/'));
  // };

  const isUploadInfo: boolean = useMemo(() => {
    return controlType === ControlType.UPLOAD.value && info && info.includes(']') && (Array.isArray(JSON.parse(info)));
  }, [info, controlType]);

  const isPolygonMap: boolean = useMemo(() => {
    return controlType === ControlType.MAP_POLYGON.value && info;
  }, [info, controlType]);

  const isControlAddress: boolean = useMemo(() => {
    return controlType === ControlType.ADDRESS.value && info;
  }, [info, controlType]);

  const isFloorInfo: boolean = useMemo(() => {
    return controlType === ControlType.FLOOR_INFO.value && info;
  }, [info, controlType]);

  const isFloorDesc: boolean = useMemo(() => {
    return controlType === ControlType.FLOOR_DESC.value && info;
  }, [info, controlType]);

  const isSubForm: boolean = useMemo(() => {
    return controlType === ControlType.SUB_FORM.value && info;
  }, [info, controlType]);

  const initUploadItem = (info: any) => {
    const files = JSON.parse(info) || [];
    return (
      <div className={styles.uploadItem}>
        <PreviewGroup>
          {
            files.map((obj:any, index) => {
              const { type, name, url, coordinateUrl } = obj;
              const isImage = type.includes('image');
              const isVideo = type.includes('video');
              if (isImage) {
                return <div key={index} className={styles.imgContainer}><Image width={104} height={104} src={QiniuImageUrl(coordinateUrl || url)}/></div>;
              }

              if (isVideo) {
                return <VideoPlay key={index} src={url}/>;
              }

              return <FilePreview key={index} filename={name} url={url}/>;
            })
          }
        </PreviewGroup>
      </div>
    );



  };

  const initItemValue = (info: any) => {
    if (isUploadInfo) {
      // 上传类型，图片、文件
      return initUploadItem(info);
    } else if (isPolygonMap) {
      // 地理围栏
      return <PolygonMap value={JSON.parse(info)} />;
    } else if (isControlAddress) {
      // 地址解析
      if (info) {
        const { address, longitude, latitude } = JSON.parse(info);
        return (<MapMarker address={address} center={{ longitude, latitude }} />);
      } else {
        return <></>;
      }
    } else if (isFloorInfo) {
      // 楼层信息
      return <DynamicFloorInfo value={info}/>;
    } else if (isFloorDesc) {
      // 楼层描述
      return <DynamicFloorDesc value={info}/>;
    } else if (isSubForm) {
      return <SubForm data={JSON.parse(info)} />;
    } else {
      // 其他，直接展示
      return <span>{typeof info === 'string' ? info?.replace(/\\n/g, '') || '' : ''}</span>;
    }
  };

  return initItemValue(info);
};

export default Info;
