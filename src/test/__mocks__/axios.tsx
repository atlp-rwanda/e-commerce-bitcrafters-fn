// __mocks__/axios.ts
const mockAxios = {
    post: jest.fn(),
    create: jest.fn(function() {
      return this;
    }),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
  };
  
  export default mockAxios;
  