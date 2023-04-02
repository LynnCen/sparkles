import React, { useEffect, useState } from 'react';
import { DatePicker, Select, Radio, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Line } from '@ant-design/charts';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface.d';

import { updateValidItems } from './helper';

// import { useIntl } from 'umi';
import './index.less';

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const config = {
  data,
  height: 400,
  xField: 'year',
  yField: 'value',
  point: {
    size: 5,
    shape: 'diamond',
  },
  label: {
    style: {
      fill: '#aaa',
    },
  },
};

const NewUsers: React.FC<{}> = () => {
  // const { formatMessage } = useIntl();

  const [ch, setCh] = useState(1);
  const [version, setVersion] = useState(1);
  const [versions, setVersions] = useState([
    { key: '全部版本', label: '全部版本', value: 1, checked: true },
    { key: '其他版本', label: '其他版本', value: 2, checked: true },
  ]);
  const [timespan, setTimespan] = useState<RangeValue<Moment>>([
    moment().subtract(3, 'd'),
    moment(),
  ]);
  const [showItems, setShowItems] = useState(updateValidItems(timespan as [Moment, Moment]));
  const [defaultKey, setDefaultKey] = useState(showItems.filter((item) => item?.enable)[0]?.value);

  useEffect(() => {
    const items = updateValidItems(timespan as [Moment, Moment]);
    setShowItems(items);
    setDefaultKey(items.filter((item) => item?.enable)[0]?.value);
  }, [timespan]);

  const columns = [
    { title: 'Year', dataIndex: 'year' },
    { title: 'Value', dataIndex: 'value' },
  ];

  return (
    <PageHeaderWrapper>
      <div className="newuser-header">
        <DatePicker.RangePicker
          onChange={(val) => {
            if (!val) return;
            setTimespan(val);
          }}
          value={timespan}
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
        />
        <Select value={ch} onSelect={(val) => setCh(val)}>
          <Select.Option key={1} value={1}>
            全部渠道
          </Select.Option>
          <Select.Option key={2} value={2}>
            其他渠道
          </Select.Option>
        </Select>
        <Select value={version} onSelect={(val) => setVersion(val)}>
          {versions.map((versionItem) => {
            return (
              <Select.Option key={versionItem.value} value={versionItem.value}>
                {versionItem.label}
              </Select.Option>
            );
          })}
        </Select>
      </div>

      <div>
        <div className="newuser-chart-header">
          <Radio.Group value={defaultKey}>
            {showItems.length >= 1 &&
              showItems.map((item) => {
                return (
                  <Radio.Button
                    onClick={() => setDefaultKey(item?.key)}
                    disabled={!item?.enable}
                    key={item?.key}
                    value={item?.value}
                  >
                    {item?.key}
                  </Radio.Button>
                );
              })}
          </Radio.Group>
        </div>

        <div className="newuser-chart">
          <Line {...config} />
        </div>

        <div>
          <Table key={'year'} columns={columns} dataSource={data} />,
        </div>
      </div>
    </PageHeaderWrapper>
  );
};

export default NewUsers;
