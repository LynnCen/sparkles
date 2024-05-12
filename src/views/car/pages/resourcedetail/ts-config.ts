export interface Group {
  groupId?: string;
  groupName?:	string;
  propertyList?: Property[];
  propertyGroupConfig?: PropertyValue
}

export interface Property {
  controlType?:	number;
  propertyName?:	string;
  value?: string;
  propertyId?: number;
  propertyValueOptionList?: any[];
  textValue?: any;
  columns?: { title: string, dataIndex: string }[]
}

export interface PropertyValueEdit {
  propertyId: number;
  textValue?: any;
}

export interface PropertyValue extends PropertyValueEdit {
 categoryPropertyGroupId?: number;
 categoryPropertyGroupConfigId?: number;
 categoryPropertyGroupConfigIdentification?: string;
 controlType?: number;
 propertyValueOptionList?: any[];
}


export interface PlaceInfo {
  tenantPlaceId?: number,
  placeName?: string,
  address?: any,
  categoryId?: number,
  categoryName?: string,
  area?: number;
  constructionTime?: number,
  spotCounr?: number,
  supplierCount?: number;
  buildingLevel?: string
  builtArea?: number,
  businessCircle?: string
  workdayDayAvg?: number;
  placeDescription?: string;
  placeLabelList?: Label[];
  panorama?: File[];
  placePicture?: File[];
  placeVideo?: File[];
  floorPlan?: File[];
  topPropertyList?: any[];
}

export interface Label {
  tenantPlaceId?: number,
  tenantLabelId?: number,
  labelName?: string,
  reviewStatus: 1|2|3
}

export enum TABS {
  Place = 'Place', // 场地信息
  AnalysisCompetitive='AnalysisCompetitive', // 竞争力分析
  CityMarketAssessment='CityMarketAssessment', // 城市市场评估
  AnalysisBusinessClimate='AnalysisBusinessClimate', // 商业氛围评估
  PlaceAnalysisCustomer='PlaceAnalysisCustomer', // 客群客流评估
  PlaceAnalysisTraffic='PlaceAnalysisTraffic', // 交通便利评估
  EnterBrand = 'EnterBrand', // 入驻品牌
}
