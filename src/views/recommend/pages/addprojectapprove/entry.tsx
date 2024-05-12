import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
import { getApprovalDetail } from '@/common/api/expandStore/approveworkbench';
import Top from './components/Top';
import MapContainer from './components/MapContainer';

const AddProjectApprove: FC<any> = () => {
  const { id } = urlParams(location.search);
  const [detail, setDetail] = useState<any>(null);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const getApprovalDetails = async() => {
    const data = await getApprovalDetail({ id });
    setDetail(data);
    setCompanyDetails(data?.formData?.planClusterAddPlannedFormData);
  };

  useEffect(() => {
    getApprovalDetails();
  }, []);

  return (
    <div className={styles.container}>
      <Top
        detail={detail}
      />
      {
        companyDetails === null
          ? <></>
          : <MapContainer
            approvalDetail={detail}
            companyDetails={companyDetails}
            getApprovalDetails={getApprovalDetails}
          />
      }
    </div>
  );
};

export default AddProjectApprove;
