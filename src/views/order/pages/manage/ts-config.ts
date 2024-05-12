import { FetchData } from '@/common/components/FilterTable/ts-config';
export interface SearchParams {
  storeIds?: Array<number>;
  start?: string | null;
  end?: string | null;
}

export interface ManageListTableProps {
  loadData: (params?: Record<string, any>) => Promise<FetchData>;
  searchParams?: SearchParams;
}

export interface ModalImportProps {
  visible: boolean,
  modalHandle: Function;
  loadData: () => void;
}
