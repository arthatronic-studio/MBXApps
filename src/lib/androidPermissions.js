import { Platform, PermissionsAndroid } from 'react-native';

export const androidBluetoothPermission = async () => {
    let permissionAndroidStatus = false;

    if (Platform.OS === 'android' && Platform.Version >= 31) {
        const status = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ]);

        if (
            status[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' &&
            ['granted', 'unavailable'].includes(
                status[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT],
            ) &&
            ['granted', 'unavailable'].includes(
                status[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN],
            ) &&
            ['granted', 'unavailable'].includes(
                status[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE],
            )
        ) {
            permissionAndroidStatus = true;
        }
    } else {
        permissionAndroidStatus = true;
    }

    return permissionAndroidStatus;
}