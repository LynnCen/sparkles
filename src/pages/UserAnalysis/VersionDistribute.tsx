import React, { useEffect, useState } from 'react';
import { DatePicker, Select, Radio, Popover, Button, Checkbox } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Line } from '@ant-design/charts';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface.d';

// import { useIntl } from 'umi';
import './index.less';

const VersionDistribute: React.FC<{}> = () => {
  // const { formatMessage } = useIntl();
  const [version, setVersion] = useState(1);
  const [versions, setVersions] = useState([
    { key: '全部版本', label: '全部版本', value: 1, checked: true },
    { key: '其他版本', label: '其他版本', value: 2, checked: true },
  ]);
  const [timespan, setTimespan] = useState<RangeValue<Moment>>([
    moment().subtract(3, 'd'),
    moment(),
  ]);
  const [defaultKey, setDefaultKey] = useState('new');

  const [data, setData] = useState([]);
  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  useEffect(() => {
    asyncFetch();
  }, []);

  const onCheckVersion = (key: string, checked: boolean) => {
    console.log(key, checked);
    setVersions(
      Array.from(versions, function (item) {
        if (key === item.key) {
          return { ...item, checked };
        }
        return { ...item };
      }),
    );
  };

  const config = {
    data,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat((v / 1000000000).toFixed(1), ' B');
        },
      },
    },
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  // @ts-ignore
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
            {[
              { label: 'new', value: 'new', key: 'new' },
              { label: 'active', value: 'active', key: 'active' },
            ].map((item) => {
              return (
                <Radio.Button
                  onClick={() => setDefaultKey(item.key)}
                  key={item.key}
                  value={item.value}
                >
                  {item.key}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>

        <div className="newuser-chart">
          <Line {...config} />
        </div>

        <div>
          <Popover
            content={() => {
              return (
                <div className={'version_checkbox'}>
                  {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
                  {versions.map((version) => {
                    return (
                      <Checkbox
                        key={version.value}
                        value={version.value}
                        checked={version.checked}
                        onChange={(e) => onCheckVersion(version.key, e.target.checked)}
                      >
                        {version.label}
                      </Checkbox>
                    );
                  })}
                </div>
              );
            }}
            placement="topLeft"
            trigger={'click'}
          >
            <Button type={'primary'}>+版本对比</Button>
          </Popover>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};

export default VersionDistribute;
