import { postAPI } from './httpService';

export const fetchEatCartOrder = async({ cartId }) => {
    const endpoint = 'eats/order';
    const body = { id: cartId };
    const result = await postAPI(endpoint);
    console.log(`result ${endpoint}`, body, result);
    return result;
}