/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import type { UserModelState } from '@/models/user';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, DatePicker, message, Button, List } from 'antd'
import TableModal from './component/index';
import { bindVersion } from './service'
import type { DataType } from './data'

interface PropsType {
    user?: UserModelState;
}
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};
const FormItem = Form.Item;
const BindVersion: React.FC<PropsType> = () => {
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [decriptionLists, setDecriptionLists] = useState<DataType[]>([]);
    const [form] = Form.useForm();

    const onFinish = async (values: any, decriptionLists: DataType[]) => {
        const { version, end_time, android_time, ios_time, pc_time } = values
        const ids = decriptionLists.map((item) => item._id);
        const hide = message.loading("正在配置...");
        try {
            hide()
            const res = await bindVersion({
                version,
                end_time: end_time ? end_time.valueOf() : null,
                android_time: android_time ? android_time.valueOf() : null,
                ios_time: ios_time ? ios_time.valueOf() : null,
                pc_time: pc_time ? pc_time.valueOf() : null,
                ids: ids ? JSON.stringify(ids) : null
            })
            if (res) {
                message.success("配置成功")
                form.setFieldsValue({
                    version: null,
                    end_time: null,
                    android_time: null,
                    ios_time: null,
                    pc_time: null
                })
                setDecriptionLists([])
            }
        } catch (error) {
            hide();
            message.error(error)
        }
    };
    return <PageHeaderWrapper>
        <Card title='编辑'>
            <Form {...formLayout} onFinish={(values) => onFinish(values, decriptionLists)} form={form}>
                <FormItem
                    name="version"
                    label={"版本号"}
                    rules={[
                        {
                            required: true,
                            message: `请输入版本号`,
                        },
                    ]}
                >
                    <Input style={{ width: 150 }} />
                </FormItem>
                <FormItem
                    name="end_time"
                    label={"开发完成时间"}
                    rules={[
                        {
                            required: true,
                            message: `请输入开发完成时间`,
                        },
                    ]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </FormItem>
                <FormItem
                    name="android_time"
                    label={"Android应用市场更新时间"}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </FormItem>
                <FormItem
                    name="ios_time"
                    label={"iOS应用市场更新时间"}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </FormItem>
                <FormItem
                    name="pc_time"
                    label={"PC更新时间"}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </FormItem>
                <FormItem
                    label='更新内容'
                >
                    <Button type="ghost" onClick={() => handleModalVisible(true)}>从任务选择</Button>
                    <List
                        dataSource={decriptionLists}
                        renderItem={item => <List.Item>{item.desc}</List.Item>}
                        style={{ maxHeight: 510, overflowY: "auto", display: 'flex' }}
                    />
                </FormItem>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
        {createModalVisible && (
            <TableModal
                onCancel={() => handleModalVisible(false)}
                updateModalVisible={createModalVisible}
                Confirm={(value) => {
                    setDecriptionLists(value)
                }}
            />
        )}
    </PageHeaderWrapper>
}
export default BindVersion