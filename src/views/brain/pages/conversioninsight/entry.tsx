/**
 * 网规区域管理
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import ConversionList from './components/ConversionList';
import { useEffect, useState } from 'react';
import { QrcodeOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
// https://www.npmjs.com/package/qrcode.react?activeTab=readme
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import V2Container from '@/common/components/Data/V2Container';

const StoreData = () => {
  const [selectedNo, setSelectedNo] = useState<string>('');

  const data = [
    {
      id: 1,
      no: '1129001',
      storeNum: 31,
      storeName: '某网红蛋糕(来福士广场店),某网红蛋糕(日月光店),某网红蛋糕(芮欧百货店)...',
      time: '2022/8/30',
      status: '洞察完成',
      text: '餐饮消费水平101元-150元,居住社区房价(分段)40,000元-59,000元,年龄(分段)25岁-40岁,子女年龄0岁-5岁',
      qrcode: (
        <QrcodeOutlined
          onClick={() => {
            setIsShow(true);
            setSelectedNo('1129001');
          }}
        />
      ),
    },
    {
      id: 2,
      no: '1129002',
      storeNum: 30,
      storeName: '某鞋服品牌(合生汇店),某鞋服品牌(上品店),某鞋服品牌(新奥购物中心C区)...',
      time: '2022/9/10',
      status: '洞察完成',
      text: '年龄（分段）_31岁-35岁,子女年龄_2岁-5岁,学历_本科,酒店消费水平_151-300元,APP偏好_摄影,APP偏好_健康',
      qrcode: (
        <QrcodeOutlined
          onClick={() => {
            setIsShow(true);
            setSelectedNo('1129002');
          }}
        />
      ),
    },
    {
      id: 3,
      no: '1129003',
      storeNum: 33,
      storeName: '某糖水铺品牌(梁弄店),某糖水铺品牌(柯桥滨海店),某糖水铺(星光大道店)...',
      time: '2022/9/20',
      status: '洞察完成',
      text: '年龄（分段）_18岁-24岁,餐饮消费水平_151-200元,APP偏好_旅游,APP偏好_摄影,到访偏好_美食,到访偏好_美化',
      qrcode: (
        <QrcodeOutlined
          onClick={() => {
            setIsShow(true);
            setSelectedNo('1129003');
          }}
        />
      ),
    },
    {
      id: 4,
      no: '1129004',
      storeNum: 45,
      storeName: '某餐饮品牌(杭州紫橙国际店),某餐饮品牌(杭州中盛府保利中心店),某餐饮品牌(杭州泽怀广场店)...',
      time: '2022/9/26',
      status: '洞察完成',
      text: '年龄（分段）_31岁-35岁,学历_本科,所在行业_仪器仪表/工业自动化,餐饮消费水平_201-300元,居住社区房价（分段）_40000-59999,到访偏好_医疗保健',
      qrcode: (
        <QrcodeOutlined
          onClick={() => {
            setIsShow(true);
            setSelectedNo('1129004');
          }}
        />
      ),
    },
  ];
  const [listData, setListData] = useState<any>([]);
  const [params, setParams] = useState<any>({});
  const [isShow, setIsShow] = useState<boolean>(false);
  const onSearch = (values: any) => {
    setParams(values);
  };
  const url = `${process.env.INSIGHT_URL}/conversion?id=${selectedNo}`;

  const loadData = async (params) => {
    let searchData = data;
    if (params?.no) {
      searchData = data.filter((item) => {
        return item.no.includes(params.no);
      });
    }

    if (params?.timeMin && params.timeMin.length) {
      searchData = searchData.filter((item) => {
        return (
          dayjs(item.time, 'YYYY/M/D').isAfter(dayjs(params.timeMin[0])) &&
          dayjs(item.time, 'YYYY/M/D').isBefore(dayjs(params.timeMin[1]))
        );
      });
    }

    setListData(searchData);
  };

  useEffect(() => {
    loadData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20')}
      style={{ height: 'calc(100vh - 88px)' }}
      extraContent={{
        top: (
          <>
            <Filter onSearch={onSearch} />
            <TitleTips name='洞察结果列表' showTips={false} className={styles.tipsInfo} />
          </>
        ),
      }}
    >
      <ConversionList loadData={loadData} data={listData} />
      <Modal
        open={isShow}
        onCancel={() => setIsShow(false)}
        closable={false}
        footer={null}
        bodyStyle={{ height: '176px' }}
        width='176px'
      >
        <QRCodeSVG value={url} />
      </Modal>
    </V2Container>
  );
};

export default StoreData;
