import cartReducer, {
    incrementCart,
    decrementCart,
    setCart,
    clearCart,
    // CartState
  } from '../../redux/cart';
  
  describe('cart reducer', () => {
    const  initialState = {
      count: 0,
      cartItems:[],
      totalPrice:0,
      totalProducts:0,
      cartId:null
    };
  
    it('should handle initial state', () => {
      expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('should handle incrementCart', () => {
      const actual = cartReducer(initialState, incrementCart());
      expect(actual.count).toEqual(1);
    });
  
    it('should handle decrementCart', () => {
      const actual = cartReducer({ ...initialState, count: 1 }, decrementCart());
      expect(actual.count).toEqual(0);
    });
  
    it('should handle setCart', () => {
      const actual = cartReducer(initialState, setCart(5));
      expect(actual.count).toEqual(5);
    });
  
    it('should handle clearCart', () => {
      const actual = cartReducer({ ...initialState, count: 5 }, clearCart());
      expect(actual.count).toEqual(0);
    });
  
    it('should handle multiple actions', () => {
      let state = cartReducer(initialState, incrementCart());
      state = cartReducer(state, incrementCart());
      state = cartReducer(state, setCart(10));
      state = cartReducer(state, decrementCart());
      expect(state.count).toEqual(9);
    });


  });
