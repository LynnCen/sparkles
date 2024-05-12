/**
 * @Description 顶部部分
 */
import { FC, useState } from 'react';
import { Row, Col, Dropdown, Form } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { debounce } from '@lhb/func';
import cs from 'classnames';
import styles from '../index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import IconFont from '@/common/components/IconFont';


const sortType = [
  {
    key: 'default',
    label: '默认排序'
  },
  {
    key: 'totalScore',
    label: '益禾堂评分从高到低'
  },
  {
    key: 'mainBrandsScore',
    label: '奶茶行业评分从高到低'
  }
];

const Top: FC<any> = ({
  // isReset, // 是否重置参数
  detailData, // 详情
  setDetailData, // 设置详情
  setSearchKeywords, // 设置搜索关键词
  searchParams, // 接口入参
  setSearchParams, // 设置接口请求参数
  totalInfo, // 总商圈个数和已开门店个数
}) => {
  const [form] = Form.useForm();
  const [selectedSort, setSelectedSort] = useState<any>(sortType[0]);
  // 枚举定义来源：https://yapi.lanhanba.com/project/546/interface/api/59660
  const dropdownItems = [
    {
      key: sortType[0].key,
      label: (
        <div onClick={() => methods.sortHandle(sortType[0])}>
          {sortType[0].label}
        </div>
      ),
    },
    {
      key: sortType[1].key,
      label: (
        <div onClick={() => methods.sortHandle(sortType[1])}>
          {sortType[1].label}
        </div>
      ),
    },
    {
      key: sortType[2].key,
      label: (
        <div onClick={() => methods.sortHandle(sortType[2])}>
          {sortType[2].label}

        </div>
      ),
    },
  ];

  // useEffect(() => {
  //   if (!isReset) return;
  //   form.resetFields(); // 清空搜索关键词
  //   setSelectedSort(sortType[0]); // 重置排序为默认
  // }, [isReset]);

  const methods = useMethods({
    sortHandle(target: any) { // 排序
      const { key } = target;
      setSelectedSort(target);
      setSearchParams({
        ...searchParams,
        sortField: key === sortType[0].key ? null : key, // 默认排序时传null
        sort: 'desc'
      });
    },
    onSearch: debounce((e: any) => { // 搜索
      const keywords = e?.target?.value;
      setSearchKeywords(keywords);
      setSearchParams({
        ...searchParams,
        name: keywords
      });
      // 搜索时返回列表
      setDetailData({
        id: null,
        visible: false,
      });
    }, 300),

  });

  return (
    <div className={styles.topSection}>
      <div className='pt-16 pl-12 pr-12'>
        <Row align='middle'>
          <Col span={8} className='fs-16 bold c-222'>
            商圈列表
          </Col>
          {detailData?.visible ? <></> : <Col span={16}>
            <Dropdown
              menu={{
                items: dropdownItems,
                selectable: true,
                defaultSelectedKeys: [dropdownItems[0].key] // 默认选中项
              }}
              placement={'bottom'}
            >
              <div
                className={cs(
                  selectedSort.key !== sortType[0].key ? 'c-006' : 'c-333',
                  'fs-14 rt pointer',
                  styles.rankCon
                )}>
                <span className='pr-4'>
                  {selectedSort.label}
                </span>
                <CaretDownOutlined className={styles.triangleIcon}/>
              </div>
            </Dropdown>

          </Col>}
        </Row>
        <V2Form form={form} className='mt-10'>
          <V2FormInput
            name='name'
            placeholder='查询地点'
            config={{ allowClear: true }}
            prefix={<IconFont iconHref='icon-shousuo'/>}
            onChange={(e: any) => methods.onSearch(e)}/>
        </V2Form>
      </div>
      {
        detailData?.visible
          ? <></>
          : <div className={styles.countCon}>
              共 <span className='bold c-006 fs-14'>{totalInfo?.totalNum || 0}</span> 个商圈
          </div>
      }
    </div>
  );
};

export default Top;
