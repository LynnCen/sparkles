import { GetList, Pagination, useTable } from '@lhb/hook';
import { useEffect, useState } from 'react';

interface TableProps {
  loading: boolean;
  pagination: Pagination;
  dataSource: any[];
}

interface SearchFormProps<T> {
  onSearch: (values: T) => void;
  onReset: () => void;
  onRefresh: () => void
  searchParams: any;
  onChange?: (values: T) => void;
}

type Result<T> = [TableProps, SearchFormProps<T>, Record<string, any>];

function useSearchForm<T> (getList: GetList, transformSearchParams?: (values: T) => any): Result<T> {
  const [searchParams, setSearchParams] = useState<T |((values: T) => T)>({} as any);
  const [values, setValues] = useState<any>({});
  const [{ loading, pagination }, result] = useTable(getList, values);
  const { objectList = [], meta } = result || {};

  const onSearch = (values: T) => {
    setSearchParams(values as any);
    pagination.onChange(1);
  };

  const onReset = () => {
    setSearchParams({} as any);
    pagination.onChange(1);
  };

  const onRefresh = () => {
    setSearchParams({ ...searchParams } as any);
  };

  const onChange = (values: T) => {
    setSearchParams(values);
  };

  useEffect(() => {
    setValues(transformSearchParams ? transformSearchParams(searchParams as any) : searchParams);
  }, [searchParams]);

  const tableProps = {
    dataSource: objectList,
    loading,
    pagination
  };

  const searchFormProps = {
    onSearch,
    onReset,
    onRefresh,
    searchParams,
    onChange
  };

  return [tableProps, searchFormProps, meta];
}

export default useSearchForm;

