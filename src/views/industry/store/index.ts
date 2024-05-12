/*
 * @Author: chenyu chenyu@linhuiba.com
 * @Date: 2024-03-01 10:31:19
 * @LastEditors: chenyu chenyu@linhuiba.com
 * @LastEditTime: 2024-03-29 11:50:40
 * @FilePath: /console-pc/src/views/industry/store/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitStata {
  number: number;
}

const initialState: InitStata = {
  number: 0,
};

const customerSlice = createSlice({
  name: 'newHome',
  initialState,
  reducers: {
    changeCount: (state = initialState, action: PayloadAction<number>) => {
      state.number = action.payload;
    },
  },
});

// 导出action
export const { changeCount } = customerSlice.actions;

export default customerSlice.reducer;
