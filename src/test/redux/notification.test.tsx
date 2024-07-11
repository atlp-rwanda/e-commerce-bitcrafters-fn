import { RootState } from '../../redux/store';
import allReadReducer, { setAllRead, AllReads } from '../../redux/notificationSlice';

describe('notification reducer', () => {
  const initialState = {
    allRead: false,
  };

  it('should handle initial state', () => {
    expect(allReadReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setAllRead to true', () => {
    const actual = allReadReducer(initialState, setAllRead(true));
    expect(actual.allRead).toEqual(true);
  });

  it('should handle setAllRead to false', () => {
    const actual = allReadReducer({ ...initialState, allRead: true }, setAllRead(false));
    expect(actual.allRead).toEqual(false);
  });

  it('should handle multiple setAllRead actions', () => {
    let state = allReadReducer(initialState, setAllRead(true));
    state = allReadReducer(state, setAllRead(false));
    state = allReadReducer(state, setAllRead(true));
    expect(state.allRead).toEqual(true);
  });

  it('should not change state for unknown actions', () => {
    const state = { allRead: true };
    const actual = allReadReducer(state, { type: 'UNKNOWN_ACTION' });
    expect(actual).toEqual(state);
  });

  it('should select allRead state correctly', () => {
    const state = { notification: { allRead: true } };
    expect(AllReads(state as RootState)).toEqual(true);
  });
});