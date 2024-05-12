import { industryList } from '@/common/api/industry';
import SearchTree from '@/common/business/SearchTree';
import Operate from '@/common/components/Operate';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';
import DetailTable from './components/DetailTable';
import IndustryModal from './components/Modal/IndustryModal';
import styles from './entry.module.less';
import { IndustryInfo } from './ts-config';
import { recursionEach, refactorPermissions } from '@lhb/func';
import { KeepAlive } from 'react-activation';

const Industry: FC<any> = () => {
  const [industryModalInfo, setIndustryModalInfo] = useState<IndustryInfo>({});
  const [industryTableInfo, setIndustryTableInfo] = useState<IndustryInfo>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableDisplay, setTableDisplay] = useState<string>('none');
  const [treeData, setTreeData] = useState([]);
  const [metaPermissions, setMetaPermissions] = useState([]);
  const [selectedId, setSelectedId] = useState<number>();

  const { loadData, onSelect, resetDetailTableInfo, ...methods } = useMethods({
    loadData: async () => {
      const result = await industryList({});
      setTreeData(result.industryResponseList);
      const permissions = result.meta.permissions.map((item) => {
        return { ...item, type: 'primary' };
      });
      setMetaPermissions(permissions);
      resetDetailTableInfo(result.industryResponseList);
    },
    onSelect(_, e) {
      setSelectedId(e.node.id);
      setIndustryTableInfo({ ...e.node });
      setTableDisplay('');
    },
    handleCreate() {
      setIndustryModalInfo({});
      setModalVisible(true);
    },
    resetDetailTableInfo(response) {
      if (selectedId) {
        recursionEach(response, 'childList', (item: any) => {
          if (selectedId === item.id) {
            setIndustryTableInfo(item);
            return;
          }
        });
      }
    },
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.search}>
            <SearchTree
              data={treeData}
              inputConfig={{
                placeholder: '请输入行业名称',
              }}
              fieldNames={{
                title: 'name',
                key: 'id',
                children: 'childList',
              }}
              onSelect={onSelect}
              height={550}
            >
              <Operate
                operateList={refactorPermissions(metaPermissions)}
                onClick={(btn: FormattingPermission) => methods[btn.func]()}
              />
            </SearchTree>
          </div>
          <DetailTable
            onSearch={loadData}
            tableDisplay={tableDisplay}
            setTableDisplay={setTableDisplay}
            industryTableInfo={industryTableInfo}
            setModalVisible={setModalVisible}
            setIndustryModalInfo={setIndustryModalInfo}
          />
          <IndustryModal
            onSearch={loadData}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            industryModalInfo={industryModalInfo}
            setIndustryModalInfo={setIndustryModalInfo}
            treeData={treeData}
          />
        </div>
      </div>
    </KeepAlive>
  );
};

export default Industry;
