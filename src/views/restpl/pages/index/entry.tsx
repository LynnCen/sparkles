import { resTemplateList } from '@/common/api/template';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { PlusOutlined } from '@ant-design/icons';
import { FC, useMemo, useState } from 'react';
import Filters from './components/Filters';
import TemplateModal from './components/Modal/TemplateModal';
import TemplateTable from './components/TemplateTable';
import styles from './entry.module.less';
import { TemplateModalInfo } from './ts-config';
import { KeepAlive } from 'react-activation';
import { refactorPermissions } from '@lhb/func';

const Template: FC<any> = () => {
  const [templateModalInfo, setTemplateModalInfo] = useState<TemplateModalInfo>({
    visible: false,
  });
  const [params, setParams] = useState({});
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
      }
      return res;
    });
  }, [operateExtra]);

  const { loadData, onSearch, ...methods } = useMethods({
    loadData: async (params) => {
      const result = await resTemplateList(params);
      setOperateExtra(result?.meta?.permissions || []);
      return {
        dataSource: result.objectList,
        count: result.totalNum,
      };
    },
    // 查询/重置
    onSearch(filter: any) {
      setParams({ ...params, ...filter });
    },
    handleCreate() {
      setTemplateModalInfo({ visible: true });
    },
  });

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <div className={styles.content}>
          <Filters onSearch={onSearch} />
          <div style={{ marginBottom: '10px' }}>
            <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />
          </div>
          <TemplateTable
            params={params}
            setTemplateModalInfo={setTemplateModalInfo}
            loadData={loadData}
            onSearch={onSearch}
          />
          <TemplateModal
            templateModalInfo={templateModalInfo}
            setTemplateModalInfo={setTemplateModalInfo}
            onSearch={onSearch}
          />
        </div>
      </div>
    </KeepAlive>
  );
};

export default Template;
