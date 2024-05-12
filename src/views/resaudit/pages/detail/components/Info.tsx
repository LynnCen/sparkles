import { Image } from 'antd';
import { FC, useEffect, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { resTemplateList, resTemplateDetail } from '@/common/api/template';
import { examineOrderDetail } from '@/common/api/audit';
import { urlParams } from '@lhb/func';
import { QiniuImageUrl } from '@/common/utils/qiniu';
import PolygonMap from '@/views/resaudit/pages/approvalDetail/components/PolygonMap';
import DynamicFloorInfo from './DynamicFloorInfo';
import DynamicFloorDesc from './DynamicFloorDesc';
import MapMarker from '@/views/resmng/pages/real-detail/components/MapMarker';
import { ControlType } from '@/common/enums/control';
import { VideoPlay } from '@/views/resmng/pages/real-detail/components';
import { FilePreview } from '@/views/resaudit/components';
import SubForm from '@/views/resmng/pages/real-detail/components/SubForm';

const { PreviewGroup } = Image;

const Info: FC<any> = ({ onCategoryTemplateId }) => {
  const { examineOrderId, resourceType, categoryId } = urlParams(location.search);
  const [categoryTemplateId, setCategoryTemplateId] = useState(0);

  // 模板数据
  const [basicGroupId, setBasicGroupId] = useState<number | null>(null);
  const [descriptionGroupId, setDescriptionGroupId] = useState<number | null>(null);
  const [basicGroupName, setBasicGroupName] = useState('');
  const [descriptionGroupName, setDescriptionGroupName] = useState('');
  const [propertyList, setPropertyList] = useState<any>([]);
  const [basicItems, setBasicItems] = useState<any>([]);
  const [descriptionItems, setDescriptionItems] = useState<any>([]);

  /* hooks */
  useEffect(() => {
    getData();
  }, []);

  /* methods */
  const isControlTypeUpload = (propertyId: number) => {
    return isPropertyFitControlType(propertyId, ControlType.UPLOAD.value);
  };

  const isControlPolygonMap = (propertyId: number) => {
    return isPropertyFitControlType(propertyId, ControlType.MAP_POLYGON.value);
  };

  const isControlAddress = (propertyId: number) => {
    return isPropertyFitControlType(propertyId, ControlType.ADDRESS.value);
  };

  const isControlFloorInfo = (propertyId: number) => {
    return isPropertyFitControlType(propertyId, ControlType.FLOOR_INFO.value);
  };

  const isControlFloorDesc = (propertyId: number) => {
    return isPropertyFitControlType(propertyId, ControlType.FLOOR_DESC.value);
  };


  const isPropertyFitControlType = (propertyId: number, controlType: number) => {
    const properties = (propertyList as any)?.filter((p: any) => p.propertyId === propertyId);
    return properties.length && properties[0].controlType === controlType;
  };

  useEffect(() => {
    if (categoryTemplateId) {
      getTemplateDetail();
    }
  }, [categoryTemplateId]);

  useEffect(() => {
    if (basicGroupId || descriptionGroupId) {
      getDetail();
    }
  }, [basicGroupId, descriptionGroupId]);

  const {
    getData,
    getCategoryTemplate,
    getTemplateDetail,
    getDetail,
    initSection,
    initItemValue,
    initUploadValue,
  } = useMethods({
    getData: async () => {
      await getCategoryTemplate();
    },

    getCategoryTemplate: async () => {
      const tmplResult = await resTemplateList({ resourcesType: resourceType, useType: 0 });
      if (tmplResult.objectList.length) {
        const tmplId = tmplResult.objectList[0].id;
        setCategoryTemplateId(tmplId);
        onCategoryTemplateId(tmplId);
      }
    },
    getTemplateDetail: async () => {
      const result = await resTemplateDetail({
        categoryId,
        categoryTemplateId,
      });
      if (result.propertyGroupVOList) {
        let tmpProList = [];
        result.propertyGroupVOList.forEach((propGroup) => {
          if (propGroup.name === '基本信息') {
            setBasicGroupId(propGroup.id);
            setBasicGroupName(propGroup.name);
            tmpProList = tmpProList.concat(propGroup.propertyConfigList);
          } else if (['图文描述', '图文信息', '描述信息'].includes(propGroup.name)) {
            setDescriptionGroupId(propGroup.id);
            setDescriptionGroupName(propGroup.name);
            tmpProList = tmpProList.concat(propGroup.propertyConfigList);
          }
        });
        setPropertyList(tmpProList);
      }
    },

    getDetail: async () => {
      if (!examineOrderId) {
        return;
      }
      const { examineDetailList = [] } = await examineOrderDetail({ examineOrderId });

      const items = examineDetailList.filter((itm: any) => itm.resourceInfo !== '{}' && itm.resourceInfo !== '[]');
      setBasicItems(items.filter((itm) => itm.propertyGroupId === basicGroupId) || []);
      setDescriptionItems(items.filter((itm) => itm.propertyGroupId === descriptionGroupId) || []);
    },

    initSection: (groupName: string, groupItems: any[], isBasicInfo: boolean = false) => {
      return (
        (groupItems && groupItems.length) ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{groupName}</h3>
            <div className={cs(styles.sectionItemWrap, isBasicInfo ? styles.sectionItemWrapBasic : {})}>
              {
                groupItems?.map((itm: any) => (
                  <div key={itm.propertyId} className={styles.item}>
                    <span className={styles.itemLabel}>{itm.propertyName}：</span>
                    { initItemValue(itm) }
                  </div>
                ))
              }
            </div>
          </div>
        ) : <></>
      );
    },

    initItemValue: (itm: any) => {
      if (isControlTypeUpload(itm.propertyId)) {
        // 上传类型，图片、文件
        const uploadDatas = JSON.parse(itm.resourceInfo);
        if (Array.isArray(uploadDatas) && uploadDatas.length) {
          return initUploadValue(uploadDatas);
        }
      } else if (isControlPolygonMap(itm.propertyId)) {
        // 地理围栏
        return <PolygonMap value={JSON.parse(itm.resourceInfo)} />;
      } else if (isControlAddress(itm.propertyId)) {
        // 地址解析
        if (itm.resourceInfo) {
          const { address, longitude, latitude } = JSON.parse(itm.resourceInfo);
          return (<MapMarker address={address} center={{ longitude, latitude }} />);
        } else {
          return <></>;
        }
      } else if (isControlFloorInfo(itm.propertyId)) {
        // 楼层信息
        return <DynamicFloorInfo value={itm.resourceInfo}/>;
      } else if (isControlFloorDesc(itm.propertyId)) {
        // 楼层描述
        return <DynamicFloorDesc value={itm.resourceInfo}/>;
      } else if (isPropertyFitControlType(itm.propertyId, ControlType.SUB_FORM.value)) {
        // 子表单
        return <SubForm data={JSON.parse(itm.resourceInfo)} />;
      } else {
        // 其他，直接展示
        return <span className={styles.itemValue}>{itm.resourceInfo.replace(/\n/g, '').replace(/<br\/>/g, '')}</span>;
      }
    },

    initUploadValue: (datas: any) => {
      return (
        <div className={styles.uploadItem}>
          <PreviewGroup>
            {
              datas.map((obj:any, index) => {
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


    }



  });

  return (
    <div className={styles.content}>
      { initSection(basicGroupName, basicItems, true) }
      { initSection(descriptionGroupName, descriptionItems, false) }
    </div>
  );
};

export default Info;
