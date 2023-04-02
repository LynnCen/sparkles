/**
 * @Author Pull
 * @Date 2021-09-15 15:03
 * @project index
 */
import React from 'react';
import { DatePicker, Radio, Card, Checkbox, Form } from 'antd';
import styles from './styles.less';
import classNames from 'classnames';
import { checkbox, radioGroup } from './constants';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import useChannelAna from '@/pages/ChannelAnalysis/useChannelAna';
import { DualAxes } from '@ant-design/charts';
const { Item } = Form;

const Index = () => {
  const { query, handleQuery, chartData } = useChannelAna();

  const config = {
    data: chartData,
    height: 400,
    xField: 'year',
    yField: ['value', 'count'],
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <PageHeaderWrapper>
      <Card>
        <section className={styles.query}>
          <Form layout="inline" onValuesChange={handleQuery}>
            <span className={styles['query-item']}>
              <Item name="time">
                <DatePicker.RangePicker />
              </Item>
            </span>

            {checkbox.map(({ title, key }) => (
              <span className={classNames(styles['query-item'], styles['query-radio'])}>
                <Item name={key} key={key} valuePropName="checked">
                  <Checkbox>{title}</Checkbox>
                </Item>
              </span>
            ))}

            <Item name="userType">
              <Radio.Group buttonStyle="solid">
                {radioGroup.map(({ title, key }) => (
                  <Radio.Button value={key} key={key}>
                    {title}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Item>
          </Form>
        </section>

        <section>{chartData.length ? <DualAxes {...config} /> : null}</section>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Index;
