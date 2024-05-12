import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import AMain from './components/AMain';
const QwManage: FC<any> = () => {
  const [filters, setFilters] = useState<{ [x: string]: string }>({});
  return (
    <div className={styles.container}>
      <V2Container
        className={styles.demoA}
        style={{ height: 'calc(100vh - 88px)' }}
        extraContent={{
          top: <div>
            <SearchForm onSearch={(values) => setFilters(values)}>
              <V2FormInput label='关键词' name='keyword' />
            </SearchForm>
          </div>,
        }}>
        <AMain filters={filters} setFilters={setFilters} />
      </V2Container>
    </div>
  );
};

export default QwManage;
