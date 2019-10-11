const initialState = {
    products: [],
    totalData: 0,
  }
  
  const products = (state = initialState, action) => {
    switch(action.type) {
      case 'GET_PRODUCT_PENDING':
        return {
          ...state,

        }
      case 'GET_PRODUCT_REJECTED':
        return {
          ...state,
        }
      case 'GET_PRODUCT_FULFILLED':
          console.log(action.payload)
        return {
          ...state,
          products: action.payload.result,
          totalData: action.payload.totalData
        }
      default:
        return state
    }
  }
  
  export default products