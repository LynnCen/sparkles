import { FC, useMemo, useState } from 'react';
import IconFont from '@/common/components/IconFont';
import ManageTable from './ManageTable';
// import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import styles from './index.module.less';
import { FiltersProps } from '@/views/analysis/pages/index/ts-config';
import { downloadFile } from '@lhb/func';
import { Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getStoreExport } from '@/common/api/flow';
import V2Title from '@/common/components/Feedback/V2Title';
interface Props {
  industry: boolean;
  filters: FiltersProps;
  store: any;
  permissionResult: any[];
  hasOrderPermission?: boolean;
}

const ManegeAnalysis: FC<Props> = ({
  industry,
  filters,
  store,
  permissionResult,
  hasOrderPermission
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const showExportBth = useMemo(() => {
    return !!(permissionResult || []).find((item) => item.enCode === 'flow:storeStatistic:exportData');
  }, [permissionResult]);

  const uploadExcel = async () => {
    setIsExporting(true);
    const { start, end, storeIds, dateScope } = filters;
    getStoreExport({ start, end, dateScope, storeId: storeIds })
      .then((res) => {
        setIsExporting(false);
        res && downloadFile({ url: res.url });
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  return (
    <>
      {/* <TitleTips name='数据明细' tips='如数值显示“—”，请检查是否导入对应日期订单明细。'>
        {showExportBth &&
          (
            <Button
              className={styles.exportBtn}
              loading={isExporting}
              type='text'
              shape='circle'
              icon={<IconFont iconHref='icondownload' className='color-primary-operate' onClick={uploadExcel} />} />
          )}
      </TitleTips> */}
      <V2Title
        divider
        type='H2'
        className='mt-24 mb-16'
        extra={<>
          {
            showExportBth ? <Button
              className={styles.exportBtn}
              loading={isExporting}
              type='text'
              shape='circle'
              icon={<IconFont iconHref='icondownload' className='color-primary-operate' onClick={uploadExcel} />} /> : null
          }
        </>
        }>
        <span>数据明细</span>
        <Tooltip title='如数值显示“—”，请检查是否导入对应日期订单明细。'>
          <InfoCircleOutlined className='ml-5 fn-14 c-999' />
        </Tooltip>
      </V2Title>

      <ManageTable
        industry={industry}
        filters={filters}
        store={store}
        hasOrderPermission={hasOrderPermission}
      />
    </>
  );
};

export default ManegeAnalysis;
