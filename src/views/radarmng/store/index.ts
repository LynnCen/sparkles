import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitStata {
  number: number;
}

const initialState: InitStata = {
  number: 0,
};

const customerSlice = createSlice({
  name: 'radar',
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
