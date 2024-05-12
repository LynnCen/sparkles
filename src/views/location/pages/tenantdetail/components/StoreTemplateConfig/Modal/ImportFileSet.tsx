/**
 * @Description 导入文件配置的字段，可以使用该组件
 *
 *  目前使用场景
 *    摆客自定义组件-日均客流预测
 *    摆客自定义组件-参照转化率
 *    摆客自定义组件-参照租金
 */

import { FC, useEffect, useState } from 'react';
import V2ImportModal from 'src/common/components/SpecialBusiness/V2ImportModal/index';
import V2Operate from '@/common/components/Others/V2Operate';
import IconFont from '@/common/components/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { downloadFile, isArray, refactorPermissions } from '@lhb/func';
import { customControlTypeRecords, dynamicTemplateUpdateProperty } from '@/common/api/location';
import { useMethods } from '@lhb/hook';

export interface ImportFileConfigProps {
  id: number | null;
  identification: string;
  visible: boolean;
  importType: 'flow' | 'conversion' | 'rent' | '';
}

export interface ImportFileSetProps {
  tenantId: number;
  templateId: number;
  config: ImportFileConfigProps;
  setConfig: Function;
}

const typeInfos = {
  flow: {
    title: '日均客流预测转化系数维护',
    templateFile: {
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/baike/客流转化系数维护模版.xlsx',
      name: '客流转化系数维护模版.xlsx'
    },
  },
  conversion: {
    title: '参考转化率数据维护',
    templateFile: {
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/baike/参考转化率数据模板.xlsx',
      name: '参考转化率数据模板.xlsx'
    },
  },
  rent: {
    title: '参考租金数据维护',
    templateFile: {
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/baike/参考租金数据模板.xlsx',
      name: '参考租金数据模板.xlsx'
    },
  }
};

const ImportFileSet: FC<ImportFileSetProps> = ({
  tenantId,
  templateId,
  config,
  setConfig,
}) => {
  const [assets, setAssets] = useState<any[]>([]); // 最新的模版
  const [requesting, setRequesting] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({}); // 用来刷新数据

  const typeInfo = typeInfos[config.importType] || {};

  useEffect(() => {
    config.visible && setFilters({});
  }, [config.visible]);

  useEffect(() => {
    if (!config.importType) {
      setAssets([]);
      return;
    };
    const typeInfo = typeInfos[config.importType] || {};
    setAssets([typeInfo.templateFile]);
  }, [config]);

  // 确定导入
  const submitHandle = (data) => {
    const { file } = data || {};
    const { name, url } = file?.[0] || {};
    if (!(name && url)) {
      V2Message.error('上传组件异常，未获取到上传后的的地址');
      return;
    }
    setRequesting(true);
    const params = {
      templateId,
      propertyConfigRequestList: [
        {
          ...config,
          templateRestriction: JSON.stringify({ url, urlName: name })
        },
      ],
    };

    dynamicTemplateUpdateProperty(params).then(() => {
      V2Message.success('导入成功');
      setConfig(state => ({
        ...state,
        visible: false,
      }));
    }).finally(() => {
      setRequesting(false);
    });
  };

  const methods = useMethods({
    async loadData (params: any) {
      if (!config.visible) {
        return {
          dataSource: [],
          count: 0,
        };
      }

      const { objectList, totalNum } = await customControlTypeRecords({
        ...params,
        tenantId: +tenantId,
        templateId,
        identification: config.identification,
      });
      const dataSource = isArray(objectList) ? objectList.map(itm => ({
        key: itm.id,
        time: itm.createTime,
        file: itm.name,
        url: itm.url,
        operation: [
          { event: 'department:download', name: '下载' },
        ]
      })) : [];
      return {
        dataSource,
        count: totalNum || 0,
      };
    },
    handleDownload(val) {
      if (val.url && val.file) {
        downloadFile({
          name: val.file,
          url: `${val.url}?attname=${encodeURIComponent(val.file)}`,
        });
      }
    }
  });

  const defaultColumns: any[] = [
    { title: '导入时间', key: 'time', width: '180px' },
    {
      title: '导入文件',
      key: 'file',
      width: '280px',
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
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      )
    },
  ];

  return (
    <V2ImportModal
      title={typeInfo.title}
      visible={config.visible}
      setVisible={(visible) => setConfig((state) => ({ ...state, visible }))}
      stageTopRender={<>上侧插槽</>}
      assets={assets}
      onSubmitExcel={submitHandle}
      modalConfig={{ confirmLoading: requesting }}
      formConfig={{ layout: 'horizontal' }}
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
          scroll: { y: 300 },
          voluntarilyEmpty: false
        },
        onMinorBtnClick() {
          return new Promise((res) => {
            // 历史数据接口调用
            setTimeout(() => {
              setFilters({});
              res(true);
            }, 1);
          });
        }
      }}
    />
  );
};

export default ImportFileSet;
