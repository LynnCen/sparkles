import { FC, useState } from 'react';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import { urlParams } from '@lhb/func';
import PropertyTreeDraw from './components/Draw/PropertyTreeDraw';
import { PropertyTreeDrawInfo } from './ts-config';
import TableList from './components/TableList';
const ModelConfigDetail: FC<any> = () => {
  const id: number = urlParams(location.search)?.id;

  const [propertyTreeDrawInfo, setPropertyTreeDrawInfo] = useState<PropertyTreeDrawInfo>({
    visible: false,
    disabledOIds: [],
    modelId: id,
  });

  const [params, setParams] = useState<any>({});
  const [editData, setEditData] = useState<any>({
    visible: false,
    data: {},
  });

  const methods = useMethods({
    onSearch() {
      setParams({});
    },
    showEdit(visible = false, data: any = {}) {
      setEditData({
        ...editData,
        visible,
        data,
      });
    },
    addHandle() {
      methods.showEdit(true);
    },
  });

  return (
    <div className={styles.container}>
      <TableList
        modelId={id}
        params={params}
        onSearch={() => {
          methods.onSearch();
        }}
        propertyTreeDrawInfo={propertyTreeDrawInfo}
        setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
      />

      <PropertyTreeDraw
        onSearch={methods.onSearch}
        propertyTreeDrawInfo={propertyTreeDrawInfo}
        setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
      />
    </div>
  );
};

export default ModelConfigDetail;
