import Config from 'react-native-config';
import Client from '@src/lib/apollo';
import { queryReportAlasan } from 'src/lib/query';

export const fetchReportAlasan = async() => {
    let response = {
        data: [],
        status: false,
        message: 'Terjadi kesalahan',
    };
    
    try {
        const result = await Client.query({
            query: queryReportAlasan,
        });

        if (
            result &&
            result.data &&
            result.data.reportAbuseAlasan &&
            result.data.reportAbuseAlasan.data &&
            Array.isArray(result.data.reportAbuseAlasan.data)
        ) {
            const data = result.data.reportAbuseAlasan.data;
            const arrData = [];
            for (let i = 0; i < data.length; i++) {
                const obj = {};
                obj['name'] = data[i];
                obj['value'] = data[i];
                arrData.push(obj);
            }
            response.data = arrData;
            response.status = true;
            response.message = result.data.message || 'OK';
        } else {
            console.log('err content product', result);
            response.message = 'Gagal, silakan coba kembali';
            response.error = result;
        }

        return response;
    } catch (error) {
        console.log('catch content product2', error);
        response.error = error;
        return response;
    }
}