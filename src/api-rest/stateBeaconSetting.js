import { store } from '../state/redux';
import { getAPI } from './httpService';

export const stateBeaconSetting = async () => {
    const endpoint = 'beacon';
    const result = await getAPI(endpoint);

    console.log(`result ${endpoint} `, result);

    if (result.status && Array.isArray(result.data)) {
        let newListCheckinUID = [];
        let newListCheckinRange = [];
        let newListMerchUID = [];
        let newListMerchRange = [];
        let newListArtUID = [];
        let newListArtRange = [];
        let newListOtherUID = [];
        let newListOtherRange = [];
        let newListOtherType = [];

        result.data.map((e) => {
            // if (e.beacon_type && e.beacon_type.name === 'checkin') {
            if (e.beacon_type && e.beacon_type.id === 2) {
                newListCheckinUID.push(e.beacon_uid);
                newListCheckinRange.push(parseInt(e.range));
            }
            // else if (e.beacon_type && e.beacon_type.name === 'merch') {
            else if (e.beacon_type && e.beacon_type.id === 5) {
                newListMerchUID.push(e.beacon_uid);
                newListMerchRange.push(parseInt(e.range));
            }
            // else if (e.beacon_type && e.beacon_type.name === 'art') {
            else if (e.beacon_type && e.beacon_type.id === 1) {
                newListArtUID.push(e.beacon_uid);
                newListArtRange.push(parseInt(e.range));
            }
            // else if (e.beacon_type && e.beacon_type.name !== 'checkout') {
            else if (e.beacon_type && e.beacon_type.id !== 3) {
                newListOtherUID.push(e.beacon_uid);
                newListOtherRange.push(parseInt(e.range));
                newListOtherType.push(e.beacon_type.name);
            }
        });

        await store.dispatch({ type: 'BEACONS.SET_LIST_CHECKIN', data: { listUID: newListCheckinUID, listRange: newListCheckinRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_MERCH', data: { listUID: newListMerchUID, listRange: newListMerchRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_ART', data: { listUID: newListArtUID, listRange: newListArtRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_OTHER', data: { listUID: newListOtherUID, listRange: newListOtherRange, listType: newListOtherType } });

        return true;
    }

    return false;
}