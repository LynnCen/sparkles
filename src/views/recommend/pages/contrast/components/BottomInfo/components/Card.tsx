/**
 * @Description
 */
import { isArray, isNotEmptyAny } from '@lhb/func';
import { DataType, colorChart } from '../../../ts-config';
import styles from '../index.module.less';
import { FC, useMemo, useState } from 'react';
import Histogram from './Histogram';
import { Empty, Select, Table, Tooltip } from 'antd';
import cs from 'classnames';
import BaseInfo from './BaseInfo';
import AddStoreTendency from './AddStoreTendency';
import IconFont from '@/common/components/IconFont';
import CityTypeHis from './CityTypeHis';
const Card:FC<any> = ({
  label,
  selectedInfo,
  data,
  dataType,
  options,
  setState,
  selectedBrand,
  curSelected,
  extarTips, // 标题额外的气泡提示
  otherScreens, // 外部传递其他筛选条件 React.Node
  noborder,
  noLengend, // 不需要 lengend
}) => {
  const [type, setType] = useState<string>(DataType.CHART);
  // 处理成chart需要的yData数据
  const handleData = (data) => {
    const arr:any = [];
    data?.map((item) => {
      item?.dataList?.map((val, i) => {
        arr[i] = arr[i] ? [...arr[i], val?.value] : [val?.value];
      });
    });
    return arr;
  };
  // 处理成chart需要的xData数据
  const getChartTitle = (data) => {
    const arr:any = [];
    data?.map((item) => {
      arr.push(item.title);
    });
    return arr;
  };
  // 表格表头
  const columns = useMemo(() => {
    const res:any = [{
      title: '品牌名称',
      dataIndex: 'brand',
      key: 'brand',
    }];
    data?.map((item) => {
      res.push({
        title: item?.title,
        dataIndex: `value${item?.positionId}`,
        key: `value${item?.positionId}`
      });
    });
    return res;
  }, [data]);
  // 表格数据
  const tableData = useMemo(() => {
    const res:any = [];
    selectedInfo?.map((item) => {
      res.push({
        brand: item.shortName || item.name
      });
    });

    data?.map((item) => {
      item?.dataList?.map((i, index) => {
        res[index] = {
          ...res[index],
          // 不符合的话与后端联系新增字段
          [`value${item.positionId}`]: i?.value
        };
      });
    });
    return res;
  }, [selectedInfo, type, data]);

  return <div>
    <div className={styles.top}>
      <div className={styles.title}>
        {label}

        {extarTips ? <Tooltip title={extarTips}>
          <span>
            <IconFont
              iconHref='iconxq_ic_shuoming_normal1'
              style={{ width: '14px', height: '14px' }}
              className='ml-4 c-999'
            />
          </span>
        </Tooltip> : <></>}

        {/* 额外筛选项目 */}
        <div className={styles.screensContain}>
          {isArray(options) && options?.length
            ? <Select
              style={{ width: 160 }}
              options={options}
              defaultValue={options[0]?.value}
              onChange={(e) => { setState(e); }}
            />
            : <></>}
          {/* 其他筛选条件 */}
          { otherScreens || <></>}
        </div>
      </div>
      {/* 图标切换那妞 */}
      <div className={styles.typeBox}>
        <div
          className={cs(styles.text, type === DataType.CHART && styles.selected)}
          onClick={() => setType(DataType.CHART)}>
            图表
        </div>
        <div
          className={cs(styles.text, type === DataType.TABLE && styles.selected)}
          onClick={() => setType(DataType.TABLE)}>
            表格
        </div>
      </div>
    </div>
    <div className={cs(styles.chartContain,
      (noborder || (dataType === 'cityTypeCharts' && type === DataType.TABLE)) && styles.boderNone)}
    >
      {/* 柱状图 */}
      {
        !dataType && (isArray(handleData(data)) && handleData(data).length) && type === DataType.CHART
          ? <Histogram
            className={styles.echarts}
            xData={getChartTitle(data)}
            yData={handleData(data)}
            direction='vertical'
            data={data}
          /> : <></>
      }
      {/* 表格 */}
      {
        !dataType && (isArray(handleData(data)) && handleData(data).length) && type === DataType.TABLE ? <Table
          sticky={true}
          pagination={false}
          columns={columns}
          dataSource={tableData}
          className={styles.tableInfo}
          rowKey='brand'
        /> : <></>
      }

      {/* 省市门店数量对比  */}
      {dataType === 'storeNumCharts'
        ? <BaseInfo
          type={type}
          data={data}
        /> : <></>}

      {/* 品牌城市对比 */}
      {dataType === 'cityTypeCharts' && isNotEmptyAny(data)
        ? <CityTypeHis
          data={data}
          type={type}
          selectedBrand={selectedBrand}
        />
        : <></>}

      {/* 新增门店趋势 */}
      {
        dataType === 'addStoreTendency'
          ? <AddStoreTendency
            xData={getChartTitle(data)}
            yData={handleData(data)}
            data={data}
            type={type}
            columns={columns}
            tableData={tableData}
            selectedInfo={selectedInfo}
            curSelected={curSelected}
            valueName='新增门店数'
          /> : <></>
      }

      {/* 闭店趋势 */}
      {
        dataType === 'closeStoreTendency'
          ? <AddStoreTendency
            xData={getChartTitle(data)}
            yData={handleData(data)}
            data={data}
            type={type}
            columns={columns}
            tableData={tableData}
            selectedInfo={selectedInfo}
            curSelected={curSelected}
            valueName='关闭门店数'
          /> : <></>
      }

      {/* 空数据 */}
      {
        (isArray(data) && data.length) ? <></> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      {/* 图例 */}
      {!noLengend && <div className={styles.legend}>
        {
          selectedInfo?.map((item, index) => <span className='ml-20' key={index}>
            <span
              style={{
                borderColor: colorChart[index]
              }}
              className={styles.legendColor}
            ></span>
            <span>{item.name}</span>
          </span>)
        }
      </div>
      }
    </div>

  </div>;
};
export default Card;
