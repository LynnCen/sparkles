import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { Button, Col, Row } from 'antd';
import { FC, useState } from 'react';
import styles from '../entry.module.less';
import { PointMatchData } from '../ts-config';

const Drawer: FC<any> = ({ open, setOpen, curInfo }) => {
  const [mainHeight, setMainHeight] = useState<number>(0);

  const Info = [
    { label: '姓名', value: curInfo?.joinName },
    { label: '加盟商编号', value: curInfo?.joinCode },
    { label: '手机号', value: 14261485769 },
    { label: '意向城市', value: curInfo?.joinCity },
    { label: '投资预算', value: '50万' },
    { label: '客户背景', value: '互联网企业离职创业' },
  ];
  const communicationInfo = [
    { label: '初次沟通时间', value: curInfo?.joinDate, type: 'text' },
    {
      label: '选址须知沟通情况：已沟通 ',
      value: [
        {
          url: 'https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_site_%20selection.png',
          name: '1.png',
        },
      ],
      type: 'images',
    },
    {
      label: '工程条件确认书：已沟通',
      value: [
        {
          url: 'https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_%20engineering.png',
          name: '1.png',
        },
      ],
      type: 'images',
    },
  ];
  const defaultColumns = [
    {
      title: '点位名称',
      key: 'name',
      width: 100,
      render: (text) => <div className='c-006'>{text}</div>
    },
    {
      title: '城市',
      key: 'city',
      width: 100,
    },
    {
      title: '面积(m²)',
      key: 'area',
      width: 100,
    },
    {
      title: '日均客流',
      key: 'flow',
      width: 100,
    },
    {
      title: '租金(万元/年)',
      key: 'rent',
      width: 150,
    },
    {
      title: '保本日销售额(元)',
      key: 'breakEvenSale',
      width: 150,
    },
    {
      title: '匹配日期',
      key: 'date',
      width: 100,
    },
    {
      title: '当前进展',
      key: 'schedule',
      width: 100,
    },
    {
      title: '是否选定',
      key: 'isChecked',
      width: 100,
    },
    {
      title: '否决原因',
      key: 'reason',
      width: 100,
    }

  ];
  const loadData = async () => {
    return { dataSource: PointMatchData, count: PointMatchData.length };
  };
  return (
    <V2Drawer open={open} onClose={() => setOpen(false)}>
      <V2Container
        style={{ height: 'calc(100vh - 48px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <div className={styles.top}>
                <span className={styles.topText}>{curInfo?.joinName}的加盟申请</span>
                <Button type='primary' className={styles.topBtn}
                  onClick={() => window.open('https://staticres.linhuiba.com/project-custom/locationpc/file/北京合生汇购物中心1001.pdf ') }
                >
          导出报告
                </Button>
              </div>

              <div className={styles.baseInfo}>
                <div className={styles.title}>基本信息</div>
                <Row gutter={16}>
                  {Info.map((item, index) => (
                    <Col span={8} key={index}>
                      <V2DetailItem label={item.label} value={item.value} />
                    </Col>
                  ))}
                </Row>
              </div>

              <div className={styles.communication}>
                <div className={styles.title}>沟通记录</div>
                <Row gutter={16}>
                  {communicationInfo.map((item, index) => (
                    <Col span={8} key={index}>
                      {item.type === 'images' ? (
                        <V2DetailItem label={item.label} type={item.type} assets={item.value} />
                      ) : (
                        <V2DetailItem
                          label={item.label}
                          value={item.value}
                          type={item.type}
                        />
                      )}
                    </Col>
                  ))}
                </Row>
              </div>

              <div className={styles.point}>
                <div className={styles.title}>点位匹配情况</div>
              </div>
            </>
          ),
        }}
      >
        <V2Table
          onFetch={loadData}
          // filters={params}
          defaultColumns={defaultColumns}
          rowKey='id'
          // 64是分页模块的总大小， 62是table头部
          scroll={{ y: mainHeight - 64 - 20 }}
          hideColumnPlaceholder
        />
      </V2Container>

    </V2Drawer>
  );
};
export default Drawer;
