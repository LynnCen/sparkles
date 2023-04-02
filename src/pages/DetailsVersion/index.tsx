
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { UserModelState } from '@/models/user';
import { Tabs, Card, Timeline, List } from 'antd';
import { queryList } from './service';
import type { DataType } from './data';
import moment from 'moment';


interface PropsType {
    user?: UserModelState;
    dataSource?: DataType[]
    tabKey?: string
}
const { TabPane } = Tabs;
enum filterTime {
    "android_time" = 2,
    "ios_time",
    "pc_time"
}
const RenderTimeLine: React.FC<PropsType> = (props) => {
    const time = filterTime[props.tabKey || '']
    return (
        <Timeline mode={"left"} style={{ width: 400 }}>
            {
                (props.dataSource || []).map((item) => (
                    <Timeline.Item label={item.version} key={item._id}>
                        <div>
                            <span style={{ marginRight: 18 }}>{`开发完成时间：${moment(item.end_time).format("YY-MM-DD")}`}</span>
                            <span>{`应用市场更新时间：${moment(item[time]).format("YY-MM-DD")}`}</span>
                        </div>
                        <List
                            size="small"
                            header={"更新内容"}
                            bordered={false}
                            split={false}
                            dataSource={item.details}
                            renderItem={it => <List.Item>{it.desc}</List.Item>}
                        />
                    </Timeline.Item>)



                )
            }
        </Timeline>
    )
}
const DetailsVersion: React.FC<PropsType> = () => {
    const [tabKey, setTabKey] = useState<string>("2")
    const [dataSource, setDataSource] = useState<DataType[]>([])
    const getList = async () => {
        const res = await queryList({ page: 1, row: 20, os: tabKey })
        setDataSource(res.data)
    }
    useEffect(() => {
        getList()
    }, [tabKey])
    const callback = (key: string) => setTabKey(key)

    return (
        <PageHeaderWrapper>
            <Card>
                <Tabs defaultActiveKey={tabKey} onChange={callback} tabBarGutter={100} >
                    <TabPane tab="Android" key={"2"} >
                        <RenderTimeLine dataSource={dataSource} tabKey={tabKey} />
                    </TabPane>
                    <TabPane tab="iOS" key={"3"}>
                        <RenderTimeLine dataSource={dataSource} tabKey={tabKey} />
                    </TabPane>
                    <TabPane tab="PC" key={"4"}>
                        <RenderTimeLine dataSource={dataSource} tabKey={tabKey} />
                    </TabPane>
                </Tabs>
            </Card>

        </PageHeaderWrapper>
    )

}
export default DetailsVersion