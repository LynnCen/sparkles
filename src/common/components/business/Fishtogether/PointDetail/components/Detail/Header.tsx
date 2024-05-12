/*
  机会点详情头部标题行
*/
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import { Button, Space, message } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import { useMethods } from '@lhb/hook';
import { exportYNChancepointPdf } from '@/common/api/fishtogether';
import { downloadFile } from '@/common/utils/ways';
import V2Operate from '@/common/components/Others/V2Operate';
import { refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';

const Header: FC<any> = ({
  detail,
  isPoint, // 是否作为点位详情，true则detail代表点位评估详情，false则id代表机会点详情
  setImportInfo,
  setFormDrawerData,
  setAssociatedTaskModal // 打开关联拓店任务弹窗
  // setImportChancePointId
}) => {
  const [loading, setLoading] = useState(false);
  const [operateList, setOperateList] = useState<any>([]);

  const methods = useMethods({
    // 目前导入、导出、编辑只能针对机会点详情，不能针对点位评估详情
    handleExportReport() {
      bigdataBtn('0b63137b-86a9-42f0-b421-3e0f5aff75b1', '机会点', '机会点详情pc端导出报告', '导出了机会点详情');
      setLoading(true);
      exportYNChancepointPdf({ id: detail.id })
        .then((res) => {
          if (res?.url) {
            downloadFile({
              name: res?.name,
              url: res.url,
            });
          } else {
            message.warning('表格数据异常或无数据');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    handleImport() {
      setImportInfo({ visible: true, id: detail.id });
    },

    // 关联拓店任务
    handleAssociate() {
      setAssociatedTaskModal(true);
    },

    handleUpdate() {
      setFormDrawerData({
        id: detail.id,
        open: true,
        templateId: '',
        importPermission: detail.permissions?.filter((item) => item.event === 'ynChancePoint:import'),
      });
    },
  });

  useEffect(() => {
    if (Array.isArray(detail.permissions)) {
      const permissions = detail.permissions.filter(
        (item) => item.event === 'ynChancePoint:update' || item.event === 'ynChancePoint:import' || item.event === 'ynChancePoint:associate'
      );
      if (Array.isArray(permissions) && permissions.length) {
        setOperateList(refactorPermissions(permissions.map((item) => ({ ...item, type: 'default' }))));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  return Object.keys(detail).length ? (
    <V2Title
      text={detail.chancePointName || detail.reportName}
      className={styles.titleRow}
      extra={
        <Space>
          <V2Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
          {/* 机会点详情时可导出，点位详情时不可使用 */}
          {!isPoint && <Button type='primary' onClick={methods.handleExportReport} loading={loading} className='ml-4'>导出报告</Button>}
        </Space>
      }
    />
  ) : <></>;
};

export default Header;
