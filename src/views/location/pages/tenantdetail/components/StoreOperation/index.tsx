import { FC, useEffect, useState } from 'react';
import { Button, Col, Row, Spin } from 'antd';
import StoreOperationModal from './Modal/StoreOperationModal';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { overviewDelete, overviewShow } from '@/common/api/location';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const StoreOperation: FC<any> = ({ tenantId }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [assets, setAssets] = useState<any>([]);
  const onImport = () => {
    setVisible(true);
  };

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const closeHandle = () => {
    setVisible(false);
  };

  const confirmHandle = () => {
    setVisible(false);
    onRefresh();
  };

  const onDelete = () => {
    V2Confirm({
      onSure: (modal: any) => overviewDelete({ tenantId }).then(() => {
        onRefresh();
        modal.destroy();
      }),
      title: '删除文件',
      content: '确定删除该文件？'
    });

  };

  const loadImportInfo = async () => {
    setSpinning(true);
    setAssets([]);
    overviewShow({ tenantId }).then(result => {
      if (result && result.urlName) {
        setAssets([{ url: result.url, name: result.urlName }]);
      }
    }).finally(() => {
      setSpinning(false);
    });
  };

  useEffect(() => {
    loadImportInfo();
  }, [refresh]);


  return (
    <div>
      <Spin spinning={spinning}>
        <Button onClick={onImport} className='mr-12' type='primary'>
          导入模块信息
        </Button>
        {(assets.length > 0) && <Row>
          <Col span={8}>
            <V2DetailItem type='files'filePreviewHide assets={assets} filesBtnExtra={[{ content: '删除', onClick: onDelete }]}/>
          </Col>
        </Row>}
      </Spin>
      <StoreOperationModal visible={visible} closeHandle={closeHandle} confirmHandle={confirmHandle} tenantId={tenantId}/>
    </div>
  );
};

export default StoreOperation;
