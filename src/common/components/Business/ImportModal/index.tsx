/**
 * @Description 可包含上传历史的导入组件
 * TODO 待自测
 */

import { FC, useState } from 'react';
import { post } from '@/common/request/index';
import { refactorPermissions } from '@lhb/func';
import V2ImportModal from '../../SpecialBusiness/V2ImportModal';
import IconFont from '../../Base/IconFont';
import V2Operate from '../../Others/V2Operate';
import { useMethods } from '@lhb/hook';
const ImportModal: FC<any> = ({
  visible,
  setVisible,
  templateId,
  importModalLoading,
  customUploadFetch,
}) => {
  const [filters, setFilters] = useState<any>({}); // 用来刷新数据

  const methods = useMethods({
    async loadData() {
      const templateResult = await post('/dynamic/radarMapRecords', { templateId }, { proxyApi: '/blaster', needHint: true });
      const data: any[] = templateResult.objectList?.map((item) => {
        return {
          key: item.id,
          time: item.createTime,
          file: item.name,
          url: item.url,
          operation: [
            { event: 'department:download', name: '下载' },
          ]
        };
      }) || [];
      return {
        dataSource: data,
        count: data.length,
      };
    },
    handleDownload(record) {
      window.open(`${record.url}?attname=${record.file}`);

    }
  });

  const defaultColumns: any[] = [
    { title: '导入时间', key: 'time', width: '160px', importWidth: true },
    {
      title: '导入文件',
      key: 'file',
      width: '268px',
      importWidth: true,
      staticTooltipTitle(text) {
        return text;
      },
      render(text) {
        return <><IconFont iconHref='pc-common-icon-file_icon_excel' style={{ marginRight: '7px' }}/>{text}</>;
      },
    },
    {
      title: '操作',
      key: 'operation',
      width: 'auto',
      render: (val: any[], record: any) => (
        <V2Operate
          operateList={refactorPermissions(val)}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      )
    },
  ];


  return (
    <V2ImportModal
      visible={visible}
      setVisible={setVisible}
      title='点位评分信息'
      assets={[{ name: '评分表模板.xlsx', url: 'https://staticres.linhuiba.com/project-custom/saas-manage/file/评分表模板v4.xlsx' }]}
      onSubmitExcel={customUploadFetch}
      modalConfig={{
        confirmLoading: importModalLoading,
      }}
      minorModule={{ // 次要弹窗（默认是历史列表的弹窗）
        modalConfig: {
          footer: null
        },
        tableConfig: {
          rowKey: 'key',
          filters: filters,
          onFetch: methods.loadData,
          defaultColumns: defaultColumns,
          hideColumnPlaceholder: true,
          scroll: { x: 'max-content', y: 300 },
          voluntarilyEmpty: false
        },
        onMinorBtnClick() {
          setFilters({});
        }
      }}
    />
  );
};

export default ImportModal;
