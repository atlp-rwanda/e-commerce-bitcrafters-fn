import chatReducer, { setUnreadMessagesCount } from "../redux/chatSlice";

describe("chatSlice reducers", () => {
  const initialState = { unreadMessagesCount: 0 };

  it("should handle setting unread messages count", () => {
    const action = setUnreadMessagesCount(5);
    const newState = chatReducer(initialState, action);
    expect(newState.unreadMessagesCount).toEqual(5);
  });
});
