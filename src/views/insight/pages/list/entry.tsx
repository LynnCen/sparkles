/**
 * 待移除，已统一迁移至brain目录下
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useState } from 'react';
import { QrcodeOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
// https://www.npmjs.com/package/qrcode.react?activeTab=readme
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';

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
      qrcode: <QrcodeOutlined onClick={() => {
        setIsShow(true);
        setSelectedNo('1129002');
      }} />,
    },
    {
      id: 3,
      no: '1129003',
      storeNum: 33,
      storeName: '某糖水铺品牌(梁弄店),某糖水铺品牌(柯桥滨海店),某糖水铺(星光大道店)...',
      time: '2022/9/20',
      status: '洞察完成',
      qrcode: <QrcodeOutlined onClick={() => {
        setIsShow(true);
        setSelectedNo('1129003');
      }} />,
    },
    {
      id: 4,
      no: '1129004',
      storeNum: 45,
      storeName: '某餐饮品牌(杭州紫橙国际店),某餐饮品牌(杭州中盛府保利中心店),某餐饮品牌(杭州泽怀广场店)...',
      time: '2022/9/26',
      status: '洞察完成',
      qrcode: <QrcodeOutlined onClick={() => {
        setIsShow(true);
        setSelectedNo('1129004');
      }} />,
    },
  ];
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

    return {
      dataSource: searchData,
      count: searchData.length,
    };
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <Filter onSearch={onSearch} />
      <List params={params} loadData={loadData} onSearch={onSearch} />
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
    </div>
  );
};

export default StoreData;
