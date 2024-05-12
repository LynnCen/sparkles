import { debounce } from '@lhb/func';
import { useEffect, useState } from 'react';
import { getResList } from '@/common/api/place';

function usePalce (id: string): { onSearch: (value: string) => void, options: ({ label: string, value: any })[] } {
  const [options, setOptions] = useState<any[]>([]);

  const searchLabel = async (placeName: string) => {
    const { objectList } = await getResList(1, 100, { placeName });
    if (objectList) {
      const options = objectList.map((item) => {
        return { label: item.placeName, value: item.tenantPlaceId };
      });
      setOptions(options);
    }
  };

  const onSearch = (value) => {
    const newFn = debounce(searchLabel, 2000);
    newFn(value);
  };

  useEffect(() => {
    searchLabel('');
  }, [id]);

  return {
    onSearch,
    options
  };
};

export default usePalce;
