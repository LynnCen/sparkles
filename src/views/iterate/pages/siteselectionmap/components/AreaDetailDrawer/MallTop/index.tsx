/**
 * @Description 商场类型的头部
 */

import { FC } from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import { beautifyThePrice, isArray } from '@lhb/func';
import cs from 'classnames';
import styles from './index.module.less';
import ImgGroup from './ImgGroup';
import LabelRow from '../LabelRow';
import Gather from './Gather';
import EmptyImg from 'src/common/components/Empty/Img';

const { Text } = Typography;

const ShowItem = ({
  label,
  value,
  extra = '',
}) => {
  return <div>
    <div className='fs-12 c-666'>
      {label}
    </div>
    <div className={cs('mt-2', styles.showItemValCon)}>
      <div className='fs-18 bold c-222'>{value || '-'}</div>
      {
        extra ? <div className={styles.showItemExtra}>{extra}</div> : <></>
      }
    </div>
  </div>;
};
const MallTop: FC<any> = ({
  detail,
  pdfDataStatus,
  getPDFStatus,
  createTaskPermission, // 创建拓店任务按钮权限
  disabledCreateTask, // 拓店任务按钮禁用权限
  historyTaskPermission, // 拓店任务历史按钮权限
  setHistoryVisible,
  setShowCreateDrawer,
}) => {

  return (
    <div className={cs(styles.mallTopContainer, 'mt-40')}>
      {/* 图片部分 */}
      {
        isArray(detail.picList) && detail.picList.length > 0 ? <ImgGroup imgs={detail.picList}/> : <EmptyImg className={styles.emptyCon}/>
      }
      {/* 内容部分 */}
      <div className={styles.contentCon}>
        <Row gutter={12} className='mb-12'>
          <Col span={9} className='fs-20 c-222 bold'>
            <Text
              style={{ width: 230 }}
              ellipsis={ { tooltip: detail?.areaName }}
              className={'fs-20 c-222 bold'}
            >
              {detail?.areaName || '-'}
            </Text>
          </Col>
          <Col span={15}>
            <Gather
              detail={detail}
              pdfDataStatus={pdfDataStatus}
              getPDFStatus={getPDFStatus}
              createTaskPermission={createTaskPermission}
              disabledCreateTask={disabledCreateTask}
              historyTaskPermission={historyTaskPermission}
              setHistoryVisible={setHistoryVisible}
              setShowCreateDrawer={setShowCreateDrawer}
            />
          </Col>
        </Row>
        <LabelRow id={detail.id} isMall/>
        <Row className='mt-15'>
          {
            detail.projectOrientation ? <Col span={8}>
              <ShowItem
                label='项目定位'
                value={detail.projectOrientation}
              />
            </Col> : <></>
          }
          {
            detail.mallPassFlow ? <Col span={8}>
              <ShowItem
                label='日均客流'
                // value={detail.mallPassFlow}
                value={beautifyThePrice(detail.mallPassFlow, ',', 0)}
                extra={detail.flowRank || ''}
              />
            </Col> : <></>
          }
          {
            detail.population3km ? <Col span={8}>
              <ShowItem
                label='3km居住人口'
                // value={detail.population3km}
                value={beautifyThePrice(detail.population3km, ',', 0)}
                extra={detail.peopleRank || ''}
              />
            </Col> : <></>
          }
        </Row>
        {
          detail.placeDescription ? <>
            <Divider/>
            <div className={cs('c-222 fs-14', styles.desCon)}>
              <span className={cs('c-666', styles.labelCon)}>商圈描述</span>
              <span>{detail.placeDescription}</span>
            </div>
          </> : <></>
        }
      </div>
    </div>
  );
};

export default MallTop;
