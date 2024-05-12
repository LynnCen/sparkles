// 需求详情
import { FC, useEffect, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
import { getRequirementSelection } from '@/common/api/demand-management';
import V2Container from '@/common/components/Data/V2Container';
import Top from './components/Top';
import Main from './components/Main';
import { contrast } from '@lhb/func';
import { refactorSelectionNew } from '@/common/utils/ways';
import cs from 'classnames';

import styles from './index.module.less';
import RecordDetail from './components/RecordDetail';

const Detail:FC <{
  onRefresh?: any,
  data:any,
  onRightExtra?:(visible:boolean)=>void
}> = ({
  onRefresh,
  data = {},
  onRightExtra
}) => {
  const [detail, setDetail] = useState<any>({});
  const [selection, setSelection] = useState<any>({
    locxxRequirementStages: []// 需求阶段
  });
  const [detailRightExtraData, setDetailRightExtraData] = useState<any>({
    visible: false,
    callInstanceId: ''
  }); // 右侧是否显示详情

  const mainRef = useRef<any>(null);

  const methods = useMethods({
    init() {
      methods.getDetail();
      methods.getSelection();
      mainRef.current?.init();
    },
    getDetail() {
      // locxx需求详情
      // https://yapi.lanhanba.com/project/307/interface/api/64014
      get('/locxx/requirement/detail', { id: data.id }, { proxyApi: '/lcn-api' }).then((res:any) => {
        setDetail(res);
      }).finally(() => {
      });
    },
    onRefresh() {
      onRefresh?.();
      methods.getDetail();
    },
    getSelection() {
      getRequirementSelection({ modules: 'locxxRequirementStage' }).then((response) => {
        setSelection(val => ({ ...val,
          locxxRequirementStages: refactorSelectionNew({ selection: contrast(response, 'locxxRequirementStages', []) }),
        }));
        methods.getSelection = () => {};
      });
    },
    handleRightExtra(id:number|string, visible:boolean = false) {
      setDetailRightExtraData({
        ...detailRightExtraData,
        callInstanceId: id,
        visible,
      });
      onRightExtra?.(visible);
    }
  });

  useEffect(() => {
    data.id && methods.init();
  }, []);

  return <div className={cs(styles.detailContainer)} >
    <div className={styles[detailRightExtraData.visible ? 'flex' : 'nonFlex']}>
      <V2Container
        className={styles.leftExtra}
        extraContent={{
          top: <div>
            <Top detailData={detail} onRefresh={methods.onRefresh}/>
          </div>
        }}
      >
        <Main
          detailData={detail}
          setDetail={setDetail}
          selection={selection}
          ref={mainRef}
          onRefresh={methods.onRefresh}
          handleRightExtra={methods.handleRightExtra}
        />
      </V2Container>
      {detailRightExtraData.visible && <div className={styles.rightExtra} >
        <RecordDetail
          detailRightExtraData={detailRightExtraData}
          handleRightExtra={methods.handleRightExtra}
        />
      </div>}
    </div>
  </div>;
};

export default Detail;
