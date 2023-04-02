/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @Author Pull
 * @Date 2021-09-14 15:27
 * @project index
 */
import React, { useEffect, useState } from 'react';
import { Card, DatePicker, Statistic, Row, Col, Spin, Table } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import {
  queryUserCount,
  queryMessage,
  queryGroupCount,
  queryTotalSession,
  queryTotalUser,
  queryTotalGroup,
} from './service';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import useTime from './useTime';

interface Count {
  onlineCount: number;
  onlineGroupCount: number;
  totalMessageCount: number;
  singleMessageCount: number;
  groupMessageCount: number;
}
interface datasource {
  types?: string;
  total?: number;
  today?: number;
  [k: string]: any;
}
const DataView = () => {
  const { startTime, endTime } = useTime();
  const [totalUser, setTotalUser] = useState(0);
  const [totalGroup, setTotalGroup] = useState(0);
  const [totalSession, setTotalSession] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineGroupCount, setOnlineGroupCount] = useState(0);
  const [totalMessageCount, setTotalMessageCount] = useState(0);
  const [singleMessageCount, setSingleMessageCount] = useState(0);
  const [groupMessageCount, setGroupMessageCount] = useState(0);
  const [dataSource, setDataSource] = useState<any>([]);
  const columns = [
    { title: '', dataIndex: 'type', key: 'type' },
    { title: '总计', dataIndex: 'total', key: 'type' },
    { title: '今日', dataIndex: 'today', key: 'today' },
  ];
  //   计算总和
  function sum(arr: []): number {
    let sumCount = 0;
    arr.forEach((e: any) => {
      sumCount += e.count;
    });
    return sumCount;
  }
  useEffect(() => {
    const datasourceTem: datasource[] = [
      { type: '文字消息（条）', today: 0, total: 0, key: 1 },
      { type: '语音', today: 0, total: 0, key: 3 },
      { type: '图片', today: 0, total: 0, key: 2 },
      { type: '视频', today: 0, total: 0, key: 4 },
      { type: '文件', today: 0, total: 0, key: 5 },
      { type: '红包（个数）', today: 0, total: 0, key: 6 },
      { type: '转账', today: 0, total: 0, key: 7 },
      { type: '音视频', today: 0, total: 0, key: 8 },
    ];
    const totalMessage = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 15];
    //   总用户数
    queryTotalUser({}).then((res) => {
      setTotalUser(res.count);
    });
    //   总群数
    queryTotalGroup({}).then((res) => {
      setTotalGroup(res.count);
    });
    //   总会话数
    queryTotalSession({}).then((res) => {
      setTotalSession(res.count);
    });
    // 活跃人数
    queryUserCount({
      start_time: startTime,
      end_time: endTime,
    }).then((res) => {
      setOnlineCount(res.count);
    });
    // 活跃群数
    queryGroupCount({
      start_time: startTime,
      end_time: endTime,
    }).then((res) => {
      setOnlineGroupCount(res.count);
    });

    // 今日总消息数&& table
    queryMessage({
      types: JSON.stringify(totalMessage),
      chat_type: 0,
      start_time: startTime,
      end_time: endTime,
    }).then((res) => {
      res.forEach((e: any) => {
        const index = datasourceTem.findIndex((it) => it.key == e.type);
        if (datasourceTem[index]) {
          datasourceTem[index].today = e.count;
        }
      });
      setTotalMessageCount(sum(res));
    });
    // table 总计
    queryMessage({
      types: JSON.stringify(totalMessage),
      chat_type: 0,
    }).then((res) => {
      res.forEach((e: any) => {
        const index = datasourceTem.findIndex((it) => it.key == e.type);
        if (datasourceTem[index]) {
          datasourceTem[index].total = e.count;
        }
      });
      setDataSource(datasourceTem);
    });
    // 今日个人消息数
    queryMessage({
      types: JSON.stringify(totalMessage),
      chat_type: 1,
      start_time: startTime,
      end_time: endTime,
    }).then((res) => {
      setSingleMessageCount(sum(res));
    });
    // 今日群消息数
    queryMessage({
      types: JSON.stringify(totalMessage),
      chat_type: 2,
      start_time: startTime,
      end_time: endTime,
    }).then((res) => {
      setGroupMessageCount(sum(res));
    });
  }, []);

  return (
    <PageHeaderWrapper>
      <Card title="概况">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="总用户数" value={totalUser} />
          </Col>
          <Col span={4}>
            <Statistic title="总群数" value={totalGroup} />
          </Col>
          <Col span={4}>
            <Statistic title="总会话数" value={totalSession} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="今日上线" value={onlineCount} />
          </Col>
          <Col span={4}>
            <Statistic title="今日活跃群" value={onlineGroupCount} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="今日总消息数" value={totalMessageCount} />
          </Col>
          <Col span={4}>
            <Statistic title="今日个人消息数" value={singleMessageCount} />
          </Col>
          <Col span={4}>
            <Statistic title="今日群消息数" value={groupMessageCount} />
          </Col>
        </Row>
        <Row>
          <h1 style={{ color: 'rgba(0, 0, 0, 0.45)' }}>消息统计分类</h1>
        </Row>
        <Row gutter={16}>
          <Col span={10}>
            <Table columns={columns} dataSource={dataSource} pagination={false} />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default DataView;
