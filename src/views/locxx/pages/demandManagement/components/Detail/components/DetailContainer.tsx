/**
 * @description 需求详情页
 * 别问我为什么又复制了一遍，抽屉改详情页开发加自测就给了 1H，嵌套层级较多，那肯定是复制
 */

import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
import { getRequirementSelection } from '@/common/api/demand-management';
import V2Container from '@/common/components/Data/V2Container';
import { contrast } from '@lhb/func';
import { refactorSelectionNew } from '@/common/utils/ways';
import { Spin } from 'antd';
import Top from './Top';
import Main from './Main';

import styles from '../index.module.less';

const DetailContainer:FC <{
  ref?: any,
  onRefresh: any
}> = forwardRef(({ onRefresh }, ref) => {
  const [detail, setDetail] = useState({});
  const [selection, setSelection] = useState<any>({
    locxxRequirementStages: []// 需求阶段
  });
  const [requesting, setRequesting] = useState(false);

  const mainRef = useRef<any>(null);

  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const methods = useMethods({
    init(id:string|number) {
      methods.getDetail(id);
      methods.getSelection();
    },
    getDetail(id:string|number) {
      // locxx需求详情
      // https://yapi.lanhanba.com/project/307/interface/api/64014
      setRequesting(true);
      get('/locxx/requirement/detail', { id }, { proxyApi: '/lcn-api' }).then((res:any) => {
        setDetail(res);
      }).finally(() => {
        setRequesting(false);
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
  });

  return <Spin spinning={requesting}>
    <V2Container
      style={{ height: 'calc(100vh - 88px)' }}
      className={styles.detailContainer}
      extraContent={{
        top: <div>
          <Top detailData={detail} onRefresh={methods.onRefresh}/>
        </div>
      }}
    >
      <Main detailData={detail} setDetail={setDetail} selection={selection} ref={mainRef} onRefresh={methods.onRefresh}></Main>
    </V2Container>
  </Spin>;
});

export default DetailContainer;
