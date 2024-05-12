import { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import StoreOperationModal from './Modal/StoreOperationModal';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { getChancePointTableDetail } from '@/common/api/location';
import { dynamicTemplateType } from './ts-config';

const ChancePointTable: FC<any> = ({ tenantId }) => {
  const [modalInfo, setModalInfo] = useState<any>({
    visible: false, // 是否展示Modal
    isModule: false, // 是否模块信息导入
    // isSiteSelection: false, // 是否选址地图导入
  });
  const [assets, setAssets] = useState<any>([]);
  const [siteSelectionFile, setSiteSelectionFile] = useState<any>([]);

  const closeHandle = () => {
    setModalInfo((state) => ({
      ...state,
      visible: false
    }));
  };

  const loadImportInfo = async () => {
    getChancePointTableDetail({ tenantId,
      dynamicTemplateType: dynamicTemplateType.changePoint }).then(result => {
      if (result && result.urlName) {
        setAssets([{ url: result.url, name: result.urlName }]);
      }
    });
    getChancePointTableDetail({ tenantId,
      dynamicTemplateType: dynamicTemplateType.siteSelection }).then(result => {
      if (result && result.urlName) {
        setSiteSelectionFile([{ url: result.url, name: result.urlName }]);
      }
    });
  };

  useEffect(() => {
    if (!modalInfo.visible) {
      loadImportInfo();
    }
  }, [modalInfo]);


  return (
    <div>
      <div>
        <Button
          onClick={() => {
            setModalInfo({
              visible: true, // 是否展示Modal
              isModule: true, // 是否模块信息导入
              // isSiteSelection: false, // 是否选址地图导入
            });
          }}
          type='primary'>
          导入模块信息
        </Button>
        {(assets.length > 0) && <Row>
          <Col span={8}>
            <V2DetailItem type='files'filePreviewHide assets={assets}/>
          </Col>
        </Row>}
      </div>

      <div className='mt-20'>
        <Button
          onClick={() => {
            setModalInfo({
              visible: true, // 是否展示Modal
              isModule: false, // 是否模块信息导入
              // isSiteSelection: true, // 是否选址地图导入
            });
          }}
          type='primary'>
          导入选址地图表头
        </Button>
        {(siteSelectionFile.length > 0) && <Row>
          <Col span={8}>
            <V2DetailItem type='files'filePreviewHide assets={siteSelectionFile}/>
          </Col>
        </Row>}
      </div>
      <StoreOperationModal modalInfo={modalInfo} closeHandle={closeHandle} tenantId={tenantId}/>
    </div>
  );
};

export default ChancePointTable;
