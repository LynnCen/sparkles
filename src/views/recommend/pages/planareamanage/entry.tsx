/**
 * 网规区域管理
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useState } from 'react';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
// import ModalForm from '../map/components/ModalForm';
import { deepCopy, refactorPermissions } from '@lhb/func';
import ImportModal from '@/common/components/business/ImportModal';
const data = [
  {
    id: 1,
    isFather: true,
    name: '古墩路1331号周边范围',
    planNum: 3,
    openedNum: 1,
    chanceNum: 4,
    planFootNum: 3,
    footedNum: 3,
    children: [
      {
        id: 11,
        name: '天街森谷渡北店',
        period: '已开业',
        score: '90分',
        flow: 1987,
        weekendFlow: 2396,
        province: '浙江省',
        city: '杭州市',
        district: '余杭区',
        address: '荆长路金家北400米',
      },
      {
        id: 12,
        name: '天街森谷河坊店',
        period: '装修中',
        score: '93分',
        flow: 2413,
        weekendFlow: 3087,
        province: '浙江省',
        city: '杭州市',
        district: '余杭区',
        address: '文一西路188号',
      },
      {
        id: 13,
        name: '天街森谷EFC店',
        period: '机会点',
        score: '88分',
        flow: 1492,
        weekendFlow: 1580,
        province: '浙江省',
        city: '杭州市',
        district: '余杭区',
        address: '同顺街文一西路交叉路口',
      },
    ],
  },
  {
    id: 2,
    isFather: true,
    name: '中山中路267号周边范围',
    planNum: 2,
    openedNum: 2,
    chanceNum: 6,
    planFootNum: 4,
    footedNum: 1,
    children: [
      {
        id: 21,
        name: '天街森谷中山店',
        period: '已开业',
        score: '95分',
        flow: 2701,
        weekendFlow: 3269,
        province: '浙江省',
        city: '杭州市',
        district: '上城区',
        address: '河坊街1-8号',
      },
      {
        id: 22,
        name: '天街森谷定安店',
        period: '已开业',
        score: '92分',
        flow: 2164,
        weekendFlow: 2351,
        province: '浙江省',
        city: '杭州市',
        district: '上城区',
        address: '江城路6371室',
      },
      {
        id: 23,
        name: '天街森谷望江店',
        period: '已踩点',
        score: '89分',
        flow: 1580,
        weekendFlow: 1752,
        province: '浙江省',
        city: '杭州市',
        district: '上城区',
        address: '望江路第二岔路口',
      },
    ],
  },
];

const PlanAreaManage = () => {
  const [cacheData, setCacheData] = useState<any>(data);
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams(values);
  };

  const [visible, setVisible] = useState(false);
  // const [modalData, setModalData] = useState<any>({
  //   visible: false,
  // });

  // const [assignedModal, setAssignedModal] = useState<any>({
  //   visible: false,
  //   detail: null,
  // });

  const loadData = async (params) => {
    const deleteId = params?.deleteId || -1;
    const filterData = cacheData.filter((item) => {
      return item.id !== deleteId;
    });
    setCacheData(filterData);

    let searchData = deepCopy(filterData);
    if (params?.keyword) {
      searchData = searchData.filter((item) => {
        return item.name.includes(params.keyword);
      });
    }
    if (params?.period) {
      searchData.forEach((item) => {
        item.children = item.children.filter((child) => {
          return child.period.includes(params.period);
        });
      });
    }

    return {
      dataSource: searchData,
      count: data.length,
    };
  };

  const { ...methods } = useMethods({
    handleImport() {
      setVisible(true);
    },
  });

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <Filter onSearch={onSearch} />
      <Operate
        showBtnCount={4}
        operateList={refactorPermissions([
          {
            event: 'import',
            name: '导入网规区域',
            type: 'primary',
          },
        ])}
        onClick={(btns) => methods[btns.func]()}
      />
      <List params={params} loadData={loadData} onSearch={onSearch} />

      <ImportModal
        visible={visible}
        closeHandle={() => setVisible(false)}
        title='批量导入网规区域'
        fileName='网规区域导入模版.xlsx'
      />
      {/* nox接口下线，创建拓店废弃， 该弹窗不会再出现 */}
      {/* <ModalForm
        modalData={modalData}
        modalHandle={() => setModalData({ visible: false })}
        assignedModal={assignedModal}
        assignedHandle={setAssignedModal}
      /> */}
    </div>
  );
};

export default PlanAreaManage;

