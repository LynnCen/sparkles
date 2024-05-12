
/**
 * @description 规划模型配置
 */
import {
  FC,
  useState,
} from 'react';

import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';
import V2Operate from '@/common/components/Others/V2Operate';
import PlanningTableList from './components/PlanningTableList';
import PlanningModelModal, { PlanningModelValuesProps } from './components/PlanningModelModal';

const operateList = [
  {
    name: '新增模型', // 必填
    event: 'create', // 必填
    type: 'primary', //  非必填，默认为link
  },
];

const PlanModelConfig: FC<any> = ({ tenantId, mainHeight }) => {
  // 用于刷新table数据
  const [params, setParams] = useState<any>({});
  const [planningModelData, setPlanningModelData] = useState<PlanningModelValuesProps>({
    visible: false,
  });

  /* methods */
  const methods = useMethods({
    onSearch(values) {
      setParams({
        ...params,
        ...values,
      });
    },
    handleCreate() {
      setPlanningModelData({
        ...planningModelData,
        visible: true,
        tenantId
      });
    },
  });

  return (
    <>
      <V2Operate operateList={refactorPermissions(operateList)} onClick={(btn) => methods[btn.func]()} />
      <PlanningTableList
        onSearch={() => {
          methods.onSearch();
        }}
        setPlanningModelData={setPlanningModelData}
        params={params}
        mainHeight={mainHeight}
        tenantId={tenantId}
      />
      <PlanningModelModal
        setPlanningModelData={setPlanningModelData}
        planningModelData={planningModelData}
        onSearch={methods.onSearch}
      />
    </>
  );
};

export default PlanModelConfig;
