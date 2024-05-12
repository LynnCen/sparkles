export interface FilterProps{
  onSearch: Function;
};

export interface SearchParams{

}

export interface TenantListProps extends FilterProps{
  params: SearchParams
}

