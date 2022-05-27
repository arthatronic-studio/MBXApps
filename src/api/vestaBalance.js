import Client from '@src/lib/apollo';
import { queryVestaBalance } from '@src/lib/query/payment';

export const getVestaBalance = async () => {
    let response = {
        data: {
            amount: 0,
        },
        status: false,
        message: 'Terjadi kesalahan'
    }

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
            response.message = 'Gagal, silakan coba kembali';
        }
    
        return response;
    } catch (error) {
        return response;
    }
};