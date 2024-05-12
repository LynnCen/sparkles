/**
 * @Description 拓店任务详情-基本信息
 */

import { Row, Col } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Title from '@/common/components/Feedback/V2Title';
import TaskTypeItem from './components/TaskTypeItem';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getFranchiseeDetail } from '@/common/api/expandStore/franchisee';

interface Props {
  title?:string
  detail: any;
  open: boolean;
  canEditType?: boolean;
  refresh?: Function;
}

const TaskBasic: FC<Props> = ({
  title,
  detail,
  open, // 拓店任务详情抽屉是否打开
  canEditType = false, // 是否可变更类型
  refresh,
}) => {
  const [franDetail, setFranDetail] = useState<any>({});

  useEffect(() => {
    if (detail && !detail.franchiseeDetail && detail.standardFranchiseeId) {
      // 有拓店任务数据，但未包含加盟商信息，需要额外请求加盟商详情
      // 机会点详情中拓店任务模块属于这种情况
      getFranchiseeDetail({ id: detail.standardFranchiseeId }).then(data => {
        isNotEmptyAny(data) && setFranDetail(data);
      });
    }
  }, [detail]);

  const infos = useMemo(() => {
    return [
      { label: '任务名称', value: detail?.name },
      /* 任务类型Item，自定义node */
      { node: <TaskTypeItem
        detail={detail}
        open={open}
        canEditType={canEditType}
        refresh={refresh}
      /> },
      { label: '签约类型', value: detail?.signTypeName },
      { label: '加盟商姓名', value: detail?.franchiseeDetail?.name || franDetail?.name },
      { label: detail?.franchiseeDetail?.uniqueName || franDetail?.uniqueName || '加盟商唯一标识', value: detail?.franchiseeDetail?.uniqueId || franDetail?.uniqueId },
      { label: '目标城市', value: detail?.targetArea },
      { label: '第一意向区域', value: detail?.firstArea },
      { label: '第二意向区域', value: detail?.secondArea },
      { label: '期望落位日期', value: detail?.expectDropInDate },
      /* 机会点详情拓店任务信息模块返回的是developManage */
      { label: '开发经理', value: detail?.manager || detail?.developManager },
    ];
  }, [detail, franDetail]);

  return detail ? (
    <>
      {title && <V2Title
        type='H2'
        text={title}
        divider
        className='mt-16'
      />}
      <Row gutter={16}>
        {
          isArray(infos) ? infos.map(({ label, value, node }: any, index: number) => (
            <Col span={8} key={index}>
              { node || <V2DetailItem label={label} value={value} />}
            </Col>
          )) : <></>
        }
      </Row>
    </>
  ) : (
    <></>
  );
};

export default TaskBasic;
