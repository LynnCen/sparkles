import { circleList } from '@/common/api/circle';
import SearchTree from '@/common/business/SearchTree';
import Operate from '@/common/components/Operate';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';
import DetailForm from './components/DetailForm';
import styles from './entry.module.less';
import { refactorPermissions } from '@lhb/func';

const Circle: FC<any> = () => {
  /* data */
  const [metaPermissions, setMetaPermissions] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [circleInfo, setCircleInfo] = useState({});

  /* methods */
  const { loadData, handleSelect, ...methods } = useMethods({
    loadData: async () => {
      const result = await circleList({});
      setTreeData(result.businessCircleResponseList);
      const permissions = result.meta.permissions.map((item) => {
        return { ...item, type: 'primary' };
      });
      setMetaPermissions(permissions);
    },
    handleCreate() {
      setCircleInfo({});
    },
    handleSelect(_, { node }) {
      setCircleInfo({
        random: Math.random(),
        id: node.id,
        name: node.name,
        cityId: [node.provinceId, node.cityId, node.districtId],
        address: node.address,
        level: node.level,
        explain: node.explain,
        shape: node.shape,
        permissions: node.permissions,
        radius: node.radius,
        ...(node.shape === 0
          ? {
            circle: {
              longitude: node.coordinateList[0].longitude,
              latitude: node.coordinateList[0].latitude,
            },
          }
          : {
            polygon: {
              path: node.coordinateList,
            },
          }),
      });
    },
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.search}>
          <SearchTree
            data={treeData}
            fieldNames={{
              title: 'name',
              key: 'id',
              children: 'childList',
            }}
            inputConfig={{
              placeholder: '请输入商圈名称',
            }}
            onSelect={handleSelect}
            height={550}
          >
            <Operate
              operateList={refactorPermissions(metaPermissions)}
              onClick={(btn: FormattingPermission) => methods[btn.func]()}
            />
          </SearchTree>
        </div>
        <div className={styles.form}>
          <DetailForm circleInfo={circleInfo} setCircleInfo={setCircleInfo} onSearch={loadData} />
        </div>
      </div>
    </div>
  );
};

export default Circle;
