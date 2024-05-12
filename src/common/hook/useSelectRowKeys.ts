import { useEffect, useState } from 'react';

function useSelctRowKeys(): { selectedRowKeys: any[],
  onChange: (selectedRowKeys: any, selectedRows?: any) =>void, selectedRows: any, prevSelectedRows: any } {
  const [selectedRowKeys, setSelectRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [prevSelectedRows, setPrevSelectedRows] = useState<any[]>([]);

  const onChange = (selectedRowKeys: any[], selectedRows: any[]) => {
    setSelectRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows || []);
  };

  useEffect(() => {
    return () => {
      setPrevSelectedRows(selectedRows || []);
    };
  }, [selectedRows]);

  return {
    selectedRowKeys,
    onChange,
    selectedRows,
    prevSelectedRows
  };
}

export default useSelctRowKeys;
