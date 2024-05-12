import { post } from '@/common/request';
import { debounce } from '@lhb/func';
import { useEffect, useState } from 'react';

function useBrand (brandId: number): { onSearch: (value: string) => void, options: ({ label: string, value: any })[] } {
  const [options, setOptions] = useState<any[]>([]);

  const searchBrand = async (name: string, brandId: number) => {
    const result = await post('/resource/brand/list', { type: 1, name, brandId }, true); ;
    if (result) {
      const options = result.map((item) => {
        return { label: item.name, value: item.id };
      });
      setOptions(options);
    }
  };

  const onSearch = (value) => {
    const newFn = debounce(searchBrand, 1000);
    newFn(value);
  };

  useEffect(() => {
    searchBrand('', brandId);
  }, [brandId]);

  return {
    onSearch,
    options
  };
};

export default useBrand;
