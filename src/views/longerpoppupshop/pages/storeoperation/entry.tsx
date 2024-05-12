import { FC, useState, useEffect } from 'react';
import { isArray } from '@lhb/func';
import { message as msg } from 'antd';
import { carHomeSelections } from '@/common/api/carhome';
import { Form } from 'antd';
import { useTenantType } from '@/common/hook/business/useTenantType';
import styles from './entry.module.less';
import dayjs from 'dayjs';
import FilterFields from './components/FilterFields';
import DataPanel from './components/DataPanel';
import Analyse from './components/Analyse';
import HeadAlert from '@/common/components/business/HeadAlert';
import ModalHint from '@/common/components/business/ModalHint';

const Home: FC<any> = () => {
  const [form] = Form.useForm();
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const [searchParams, setSearchParams] = useState<any>({
    battles: [],
    start: '',
    end: '',
  });
  const [battleOptions, setBattleOptions] = useState<Array<any>>([]);
  const [funnelTitle, setFunnelTitle] = useState<string>('全国');
  const [visible, setVisible] = useState<boolean>(false); // 试用版弹窗
  const [content, setContent] = useState<string>(''); // 弹窗内容

  useEffect(() => {
    getSelections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelections = async () => {
    const { battle } = await carHomeSelections();
    if (isArray(battle)) {
      setBattleOptions(battle);
      // 默认取第一项
      const targetItem = battle[0];
      if (!targetItem) return;
      const { name, count } = targetItem;
      form.setFieldValue('battles', [name]);
      setFunnelTitle(`全国${count}家`);
      // 初始化时默认调用一次接口
      onSearch({
        battles: [name],
      });
    }
  };

  // 查询
  const onSearch = async (form: any) => {
    const { battles, openingDate } = form;
    if (!(isArray(battles) && battles.length)) {
      msg.warning(`请选择拓店任务！`);
      return;
    }
    const params: any = {
      battles,
    };
    if (isArray(openingDate) && openingDate.length) {
      params.start = dayjs(openingDate[0]).format('YYYY-MM-DD');
      params.end = dayjs(openingDate[1]).format('YYYY-MM-DD');
    }

    const tagetBattles = battleOptions.filter((battleItem) => battles.includes(battleItem.name));
    if (tagetBattles.length) {
      const totalCount = tagetBattles.reduce((prev, next) => prev + next.count, 0);
      setFunnelTitle(`全国${totalCount}家`);
    }
    setSearchParams(params);
  };

  return (
    <>
      {/* 追觅不是试用企业，手动加这个tooltips提示 */}
      {/* {tenantStatus === 0 && <HeadAlert />} */}
      <HeadAlert message={'你好! 当前为演示数据模式！'} />
      <div className={styles.container}>
        {/* 筛选项 */}
        <FilterFields form={form} battleOptions={battleOptions} onSearch={onSearch} setFunnelTitle={setFunnelTitle} />
        <>
          {/* 漏斗图+地图展示 */}
          <DataPanel battleOptions={battleOptions} funnelTitle={funnelTitle} setFunnelTitle={setFunnelTitle} searchParams={searchParams} />
          {/* 转化及成本分析 */}
          <Analyse searchParams={searchParams} setVisible={setVisible} setContent={setContent} tenantStatus={tenantStatus} />
          <ModalHint visible={visible} setVisible={setVisible} content={content} />
        </>
      </div>
    </>
  );
};

export default Home;
