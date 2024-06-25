import authSlice from "../redux/authSlice";
import { setAuthToken, setAuthProfile, setIsLoggedIn } from "../redux/authSlice";

describe('auth slice', () => {
    const initialState = {
        isLoggedIn: false,
        authProfile: null,
        authToken: null,
      }
    test('has the expected initial state', () => {
      
  
      expect(initialState).toEqual({
        isLoggedIn: false,
        authProfile: null,
        authToken: null,
      });
    });

    
  it('should set authProfile', () => {
    const profileData = {
        name: 'John Doe',
        email: 'john.doe@example.com',  
      };
    const result = authSlice(initialState, setAuthProfile(profileData));
    expect(result.authProfile).toEqual(profileData);
    
  });
  
  it('should set authToken', () => {
    const token = 'abc123.def456';
    const result = authSlice(initialState, setAuthToken(token));
    expect(result.authToken).toEqual(token);
    
  });
  it('should set isLoggedIn', () => {
    const state = true;
    const result = authSlice(initialState, setIsLoggedIn(state));
    expect(result.isLoggedIn).toEqual(state);
    
  });

  });