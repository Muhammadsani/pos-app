import axios from '../../../Utils/axios'

export const getproducts = async (search, sort, sorttype, limit, page) => {
    const result = await axios.get(`/product?search=${search}&sort=${sort}&sorttype=${sorttype}&limit=${limit}&page=${page}`)
  return {
    type: 'GET_PRODUCT_FULFILLED',
    payload: result.data
}
}