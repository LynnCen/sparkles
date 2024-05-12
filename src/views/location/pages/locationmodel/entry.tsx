import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import V2Operate from '@/common/components/Others/V2Operate';
import List from './components/List';
import EditModal from './components/EditModal';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';

const operateList: any = [{
  name: '新增模型',
  event: 'create',
  type: 'primary',
}];

const Locationmodel: FC<any> = () => {
  const [filters, setFilters] = useState<any>({});
  const [modalData, setModalData] = useState<any>({
    visible: false,
    data: {},
  });

  const methods = useMethods({
    onSearch() {
      setFilters({});
    },
    handleCreate() {
      setModalData({ visible: true });
    },
  });
  return (
    <div className={styles.container}>
      <V2Container
        /*
            减去高度设置80 = 顶部条高度48 + container上margin16 + container下margin0 + container上padding16 + container下padding16；
            减去高度大于这个值，页面底部留白大于预期；
            减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；
          */
        style={{ height: 'calc(100vh - 96px)' }}
        extraContent={{
          top: <div className='mb-10'>
            <V2Operate operateList={refactorPermissions(operateList)} onClick={(btn) => methods[btn.func]()} />
          </div>
        }}
      >
        <List
          filters={filters}
          setModalData={setModalData}
          onSearch={methods.onSearch}
        />
        <EditModal
          modalData={modalData}
          setModalData={setModalData}
          onSearch={methods.onSearch}
        />
      </V2Container>
    </div>
  );
};

export default Locationmodel;
