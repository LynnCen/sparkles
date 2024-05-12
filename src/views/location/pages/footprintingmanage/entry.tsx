import Filter from './components/Filter';
import ReportList from './components/ReportList';
import cs from 'classnames';
import styles from './entry.module.less';
import { useState } from 'react';
// import { refactorPermissions } from '@/common/utils/ways';
// import Operate from '@/common/components/Operate';
import ExportReview from './components/Modal/ExportReview';
// import { post } from '@/common/request';
import dayjs from 'dayjs';
// import { useMethods } from '@lhb/hook';

const Review = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [targetInfo, setTargetInfo] = useState<any>({
    id: '',
    projectCode: ''
  });
  const [filter, setFilter] = useState<any>({});
  // const [permissions, setPermissions] = useState<any[]>([]);

  // const operateList: any = useMemo(() => {
  //   return refactorPermissions(permissions).map((item) => {
  //     const res: any = {
  //       name: item.text,
  //       event: item.event,
  //       func: item.func,
  //       type: item.isBatch ? 'default' : 'primary',
  //     };

  //     return res;
  //   });
  // }, [permissions]);

  // useEffect(() => {
  //   (async () => {
  //     // https://yapi.lanhanba.com/project/329/interface/api/34254
  //     const result: any = await post('/checkSpot/project/reviewPermission');
  //     setPermissions(result);
  //   })();
  // }, []);

  // const { ...methods } = useMethods({
  //   handleReviewImport() {
  //     setVisible(true);
  //   },
  // });
  const onSearch = (values) => {
    setFilter({ ...values, checkDate: values?.checkDate && dayjs(values?.checkDate).format('YYYY-MM-DD') });
  };

  const onOk = () => {
    onSearch(filter);
  };

  const onCloseModal = () => {
    setVisible(false);
  };

  return (
    <div className={cs(styles.container)}>
      <Filter onSearch={onSearch} />
      {/* <Operate operateList={operateList} onClick={(btn: any) => methods[btn.func]()} /> */}
      <ReportList
        filters={filter}
        setVisible={setVisible}
        setTargetInfo={setTargetInfo}/>
      <ExportReview visible={visible} onCloseModal={onCloseModal} targetInfo={targetInfo} onOkExport={onOk} />
    </div>
  );
};

export default Review;
