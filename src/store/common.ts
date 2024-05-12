import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitState {
  provinceCityDistrict: any[]; // 省市区
  provincesCities: any[]; // 省市
  // 专供高德地图的城市数据，数据格式
  // [{name: 城市名称, id: 城市id, provinceName: 所属省份名称, provinceId: 所属省份id, district: [] 区数据}]
  cityForAMap: any[];
}

const initialState: InitState = {
  provinceCityDistrict: [], // 省市区
  provincesCities: [], // 省市
  cityForAMap: [], // 专供高德地图的城市数据，数据格式
};

const customerSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeProvinceCityDistrict: (state = initialState, action: PayloadAction<any[]>) => {
      const _cityForAMap: any[] = [];
      // 禁选特殊的行政区
      state.provinceCityDistrict = action.payload.map((item: any) => {
        if (['台湾', '香港', '澳门'].some(region => item.name.indexOf(region) !== -1)) {
          item.children?.forEach(city => {
            city.disabled = true;
            city.children?.forEach(district => {
              district.disabled = true;
            });
            // cityForAMap数据组装
            _cityForAMap.push({
              name: city.name,
              id: city.id,
              code: city.code,
              provinceName: item.name,
              provinceId: item.id,
              provinceCode: item.code,
              district: city.children,
              disabled: true
            });
          });
          return {
            ...item,
            disabled: true
          };
        }
        // cityForAMap数据组装
        item.children?.forEach(city => {
          _cityForAMap.push({
            name: city.name,
            id: city.id,
            code: city.code, // 对应高德数据中城市的adcode
            provinceName: item.name,
            provinceId: item.id,
            provinceCode: item.code, // 对应高德数据中省份的adcode
            district: city.children
          });
        });
        return item;
      });
      state.cityForAMap = _cityForAMap;
    },
    changeProvincesCities: (state = initialState, action: PayloadAction<any[]>) => {
      state.provincesCities = action.payload.map((item: any) => {
        if (['台湾', '香港', '澳门'].some(region => item.name.indexOf(region) !== -1)) {
          item.children?.forEach(city => {
            city.disabled = true;
          });
          return {
            ...item,
            disabled: true
          };
        }
        return item;
      });
    },
  },
});

// 导出action
export const { changeProvinceCityDistrict, changeProvincesCities } = customerSlice.actions;

export default customerSlice.reducer;
