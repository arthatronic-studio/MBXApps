import Client from '@src/lib/apollo';
import { queryVestaBalance } from '@src/lib/query/payment';

export const fetchVestaBalance = async() => {
    let response = {
        data: {
            amount: 0,
            wallet: 'CLOSE',
        },
        status: false,
        message: 'Terjadi kesalahan',
        error: null,
    };

    try {
        const result = await Client.query({
            query: queryVestaBalance,
        });
    
        if (
            result &&
            result.data &&
            result.data.vestaBalance
        ) {
            response.data = result.data.vestaBalance;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err vesta balance', result);
            response.message = 'Gagal, silakan coba kembali';
            error = result;
        }
    
        return response;
    } catch (error) {
        console.log('catch vesta balance', error);
        response.error = error;
        return response;
    }
};