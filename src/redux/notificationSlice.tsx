import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


interface AllReadState {
  allRead: boolean;
}

const initialNotificationState: AllReadState = {
  allRead: false,
};

const allReadSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {
    setAllRead: (state, action: PayloadAction<boolean>) => {
      state.allRead = action.payload;
    },
  },
});

export const { setAllRead } = allReadSlice.actions;
export const AllReads = (state: RootState) => state.notification?.allRead ?? false;
export default allReadSlice.reducer;
