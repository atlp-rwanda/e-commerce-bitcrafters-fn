import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  unreadMessagesCount: number;
}

const initialState: ChatState = {
  unreadMessagesCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadMessagesCount: (state, action: PayloadAction<number>) => {
      state.unreadMessagesCount = action.payload;
    },
  },
});

export const { setUnreadMessagesCount } = chatSlice.actions;

export default chatSlice.reducer;
