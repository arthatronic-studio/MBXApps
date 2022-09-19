import { Platform } from 'react-native';
import { store } from '../state/redux';
import { getAPI } from './httpService';

const isAndroid = Platform.OS === 'android';

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
        let newListEventUID = [];
        let newListEventRange = [];
        let newListOtherUID = [];
        let newListOtherRange = [];
        let newListOtherType = [];

        result.data.map((e) => {
            // checkin
            if (e.beacon_type && e.beacon_type.id === 2) {
                if (isAndroid) {
                    if (e.beacon_uid) {
                        newListCheckinUID.push(e.beacon_uid);
                        newListCheckinRange.push(parseInt(e.range));
                    }
                } else {
                    if (e.beacon_ios_uid) {
                        newListCheckinUID.push(e.beacon_ios_uid);
                        newListCheckinRange.push(parseInt(e.range));
                    }
                }
            }
            // merch
            else if (e.beacon_type && e.beacon_type.id === 5) {
                if (isAndroid) {
                    if (e.beacon_uid) {
                        newListMerchUID.push(e.beacon_uid);
                        newListMerchRange.push(parseInt(e.range));
                    }
                } else {
                    if (e.beacon_ios_uid) {
                        newListMerchUID.push(e.beacon_ios_uid);
                        newListMerchRange.push(parseInt(e.range));
                    }
                }
            }
            // art
            else if (e.beacon_type && e.beacon_type.id === 1) {
                if (isAndroid) {
                    if (e.beacon_uid) {
                        newListArtUID.push(e.beacon_uid);
                        newListArtRange.push(parseInt(e.range));
                    }
                } else {
                    if (e.beacon_ios_uid) {
                        newListArtUID.push(e.beacon_ios_uid);
                        newListArtRange.push(parseInt(e.range));
                    }
                }
            }
            // event
            else if (e.beacon_type && e.beacon_type.id === 6) {
                if (isAndroid) {
                    if (e.beacon_uid) {
                        newListEventUID.push(e.beacon_uid);
                        newListEventRange.push(parseInt(e.range));
                    }
                } else {
                    if (e.beacon_ios_uid) {
                        newListEventUID.push(e.beacon_ios_uid);
                        newListEventRange.push(parseInt(e.range));
                    }
                }
            }
            // checkout
            else if (e.beacon_type && e.beacon_type.id !== 3) {
                if (isAndroid) {
                    if (e.beacon_uid) {
                        newListOtherUID.push(e.beacon_uid);
                        newListOtherRange.push(parseInt(e.range));
                        newListOtherType.push(e.beacon_type.name);
                    }
                } else {
                    if (e.beacon_ios_uid) {
                        newListOtherUID.push(e.beacon_ios_uid);
                        newListOtherRange.push(parseInt(e.range));
                        newListOtherType.push(e.beacon_type.name);
                    }
                }
            }
        });

        await store.dispatch({ type: 'BEACONS.SET_LIST_CHECKIN', data: { listUID: newListCheckinUID, listRange: newListCheckinRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_MERCH', data: { listUID: newListMerchUID, listRange: newListMerchRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_ART', data: { listUID: newListArtUID, listRange: newListArtRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_EVENT', data: { listUID: newListEventUID, listRange: newListEventRange } });
        await store.dispatch({ type: 'BEACONS.SET_LIST_OTHER', data: { listUID: newListOtherUID, listRange: newListOtherRange, listType: newListOtherType } });

        return true;
    }

    return false;
}