/**
 * @Description 拓店任务管理（加盟商首页下面table的各区域完成情况的查看更多跳转过来）
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { data } from './ts-config';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import ExpandTaskModal from './components/Modal/ExpandTaskModal';
import Drawer from './components/Drawer';

const { Link } = Typography;
const ExpendTaskMng = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [curInfo, setCurInfo] = useState<any>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams({ ...values });
  };

  const onClick = record => {
    setOpen(true);
    setCurInfo(record);
  };

  const loadData = async params => {
    console.log(111, params);
    let searchData = data;
    if (params.joinName) {
      searchData = searchData.filter(item => {
        return item.joinName.includes(params.joinName);
      });
    }

    if (params.joinCity) {
      searchData = searchData.filter(item => {
        return item.joinCityId === params.joinCity[1];
      });
    }

    if (params.feeStatus) {
      searchData = searchData.filter(item => {
        return item.feeStatus === params.feeStatus;
      });
    }

    if (params.currentStatus) {
      searchData = searchData.filter(item => {
        return item.currentStatus === params.currentStatus;
      });
    }

    if (params.joinDate) {
      searchData = searchData.filter(item => {
        return (
          dayjs(item.joinDate, 'YYYY/M/D').isAfter(dayjs(params.joinDate[0])) &&
          dayjs(item.joinDate, 'YYYY/M/D').isBefore(dayjs(params.joinDate[1]))
        );
      });
    }

    if (params.locationDays && params.locationDays.min) {
      searchData = searchData.filter(item => {
        return (
          item.locationDays > params.locationDays.min && item.locationDays < params.locationDays.max
        );
      });
    }

    if (params.responsibleName) {
      searchData = searchData.filter(item => {
        return item.responsibleName.includes(params.responsibleName);
      });
    }

    return { dataSource: searchData, count: searchData.length };
  };

  const defaultColumns = [
    {
      title: '加盟商姓名',
      key: 'joinName',
      fixed: true,
      width: 50,
      render: (text, record) => <Link onClick={() => onClick(record)}>{text}</Link>,
    },
    {
      title: '加盟商编号',
      key: 'joinCode',
      width: 80,
    },
    {
      title: '意向加盟城市',
      key: 'joinCity',
      width: 130,
    },
    {
      title: '加盟日期',
      key: 'joinDate',
      width: 130,
    },
    {
      title: '选取费收取情况',
      key: 'feeStatus',
      width: 180,
    },
    {
      title: '选址责任人',
      key: 'responsibleName',
      width: 80,
    },
    {
      title: '当前状态',
      key: 'currentStatus',
      width: 80,
    },
    {
      title: '匹配点位数',
      key: 'matchSpotNum',
      width: 110,
    },
    {
      title: '选定点位',
      key: 'chooseSpot',
    },
    {
      title: '落位天数',
      key: 'locationDaysStr',
      width: 110,
      render: (text, record) =>
        record.locationDaysRed ? <div className='c-f23'>{text}</div> : text,
    },
  ];

  const onCreateTask = () => {
    setVisible(true);
  };

  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20')}
      style={{ height: 'calc(100vh - 84px)' }}
      emitMainHeight={h => setMainHeight(h)}
      extraContent={{
        top: (
          <>
            <Filter onSearch={onSearch} />
            <Button type='primary' onClick={onCreateTask} className='mb-16'>
              创建拓店任务
            </Button>
          </>
        ),
      }}
    >
      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        rowKey='id'
        // scroll={{ x: 'max-content', y: 250 }}
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 16 }}
      />
      <ExpandTaskModal visible={visible} setVisible={setVisible} />
      <Drawer open={open} setOpen={setOpen} curInfo={curInfo} />
    </V2Container>
  );
};

export default ExpendTaskMng;
