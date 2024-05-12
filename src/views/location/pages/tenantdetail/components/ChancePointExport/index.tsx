/**
 * @Description 机会点导出模版配置
 */
import { FC, useEffect, useState } from 'react';
import { Button, Col, Row, Spin } from 'antd';
import ImportModal from './Modal/ImportModal';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { getChancePointTemplateDetail } from '@/common/api/location';

// 导入模板类型-标准版机会点导出模板
const ImportTypeChancepointExport = 13;

const ChancePointExport: FC<any> = ({ tenantId }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [assets, setAssets] = useState<any>([]);
  const onImport = () => {
    setVisible(true);
  };

  const closeHandle = () => {
    setVisible(false);
  };

  const loadImportInfo = async () => {
    setSpinning(true);
    getChancePointTemplateDetail({
      tenantId,
      type: ImportTypeChancepointExport
    }).then(result => {
      if (result && result.urlName) {
        setAssets([{ url: result.url, name: result.urlName }]);
      }
    }).finally(() => {
      setSpinning(false);
    });
  };

  useEffect(() => {
    if (!visible) {
      loadImportInfo();
    }
  }, [visible]);


  return (
    <div>
      <Spin spinning={spinning}>
        <Button onClick={onImport} className='mr-12' type='primary'>
          导入模块信息
        </Button>
        {(assets.length > 0) && <Row>
          <Col span={8}>
            <V2DetailItem type='files' filePreviewHide assets={assets}/>
          </Col>
        </Row>}
      </Spin>
      <ImportModal
        visible={visible}
        closeHandle={closeHandle}
        tenantId={tenantId}
        importType={ImportTypeChancepointExport}
      />
    </div>
  );
};

export default ChancePointExport;
