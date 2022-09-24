// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   NativeEventEmitter,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView
// } from 'react-native';
// import Kontakt, { KontaktModule } from 'react-native-kontaktio';

// const {
//   init,
//   configure,
//   // authorization
//   getAuthorizationStatus,
//   requestWhenInUseAuthorization,
//   requestAlwaysAuthorization,
//   // discovery
//   startDiscovery,
//   stopDiscovery,
//   restartDiscovery,
//   // ranging
//   startRangingBeaconsInRegion,
//   stopRangingBeaconsInRegion,
//   stopRangingBeaconsInAllRegions,
//   getRangedRegions,
//   // monitoring
//   startMonitoringForRegion,
//   stopMonitoringForRegion,
//   stopMonitoringForAllRegions,
//   getMonitoredRegions,
// } = Kontakt;

// const kontaktEmitter = new NativeEventEmitter(KontaktModule);

// const region1 = {
//   identifier: 'RDL51822',
//   uuid: 'fda50693-a4e2-4fb1-afcf-c6eb07647825',
//   major: 1,
//   minor: 2,
// };

// export default class IBeaconExample extends Component {
//   state = {
//     scanning: false,
//     ranging: false,
//     monitoring: false,
//     discoveredBeacons: [],
//     rangedBeacons: [],
//     rangedRegions: [],
//     monitoredRegions: [],
//     monitoredRegionsCloseBy: [],
//     authorizationStatus: '',
//   };

//   startMonitoringSubscription = null;
//   monitoringFailSubscription= null;
//   regionEnterSubscription= null;
//   regionExitSubscription= null;
//   regionRangeSubscription= null;
//   regionRangeFailSubscription= null;
//   authorizationSubscription= null;
//   discoverSubscription= null;
//   discoverFailSubscription= null;

//   componentDidMount() {
//     // Initialization, configuration and adding of beacon regions
//     init()
//       .then(() =>
//         configure({
//           dropEmptyRanges: true, // don't trigger beacon events in case beacon array is empty
//           invalidationAge: 5000, // time to forget lost beacon
//           // connectNearbyBeacons: false,   // true not working yet
//         })
//       )
//       .then(() => this._requestAlwaysAuthorization())
//       // .then(() => requestWhenInUseAuthorization())
//       .then(() =>
//         console.log(
//           'Successfully initialized beacon ranging, monitoring and scanning'
//         )
//       )
//       .catch((error) => console.log('error', error));

//     // Monitoring events
//     this.startMonitoringSubscription = kontaktEmitter.addListener(
//       'didStartMonitoringForRegion',
//       ({ region }) => {
//         console.log('didStartMonitoringForRegion', region);
//       }
//     );
//     this.monitoringFailSubscription = kontaktEmitter.addListener(
//       'monitoringDidFailForRegion',
//       ({ region, error }) =>
//         console.log('monitoringDidFailForRegion', region, error)
//     );
//     this.regionEnterSubscription = kontaktEmitter.addListener(
//       'didEnterRegion',
//       ({ region }) => {
//         console.log('didEnterRegion', region);

//         this.setState({
//           monitoredRegionsCloseBy:
//             this.state.monitoredRegionsCloseBy.concat(region),
//         });
//       }
//     );
//     this.regionExitSubscription = kontaktEmitter.addListener(
//       'didExitRegion',
//       ({ region: exitRegion }) => {
//         console.log('didExitRegion', exitRegion);

//         const { monitoredRegionsCloseBy } = this.state;
//         const index = monitoredRegionsCloseBy.findIndex((region) =>
//           this._isIdenticalRegion(exitRegion, region)
//         );
//         this.setState({
//           monitoredRegionsCloseBy: monitoredRegionsCloseBy.reduce((result, val, ind) => {
//             // don't add disappeared region to array
//             if (ind === index) return result;
//             // add all other regions to array
//             else {
//               result.push(val);
//               return result;
//             }
//           }, []),
//         });
//       }
//     );

//     // Ranging event
//     this.regionRangeSubscription = kontaktEmitter.addListener(
//       'didRangeBeacons',
//       ({ beacons: rangedBeacons, region }) => {
//         console.log('didRangeBeacons', rangedBeacons, region);
//         this.setState({ rangedBeacons });
//       }
//     );
//     this.regionRangeFailSubscription = kontaktEmitter.addListener(
//       'rangingDidFailForRegion',
//       ({ region, error }) =>
//         console.log('rangingDidFailForRegion', region, error)
//     );

//     // Authorization event
//     this.authorizationSubscription = kontaktEmitter.addListener(
//       'authorizationStatusDidChange',
//       ({ status }) => {
//         console.log('authorizationStatusDidChange', status);
//         this.setState({ authorizationStatus: status });
//       }
//     );

//     // Discovery event
//     this.discoverSubscription = kontaktEmitter.addListener(
//       'didDiscoverDevices',
//       ({ beacons: discoveredBeacons }) => {
//         console.log('didDiscoverDevices', discoveredBeacons);
//         this.setState({ discoveredBeacons });
//       }
//     );
//     this.discoverFailSubscription = kontaktEmitter.addListener(
//       'discoveryDidFail',
//       ({ error }) => console.log('discoveryDidFail', error)
//     );
//   }

//   componentWillUnmount() {
//     this.startMonitoringSubscription?.remove();
//     this.monitoringFailSubscription?.remove();
//     this.regionEnterSubscription?.remove();
//     this.regionExitSubscription?.remove();
//     this.regionRangeSubscription?.remove();
//     this.regionRangeFailSubscription?.remove();
//     this.authorizationSubscription?.remove();
//     this.discoverSubscription?.remove();
//     this.discoverFailSubscription?.remove();
//   }

//   /* --- Discovering beacons --- */

//   _startDiscovery = () => {
//     startDiscovery({ interval: 1000 })
//       .then((the) => {
//         console.log('the', the);
//         this.setState({ scanning: true, discoveredBeacons: []}
//       )})
//       .then((tes) => console.log('started discovery', tes))
//       .catch((error) => console.log('[startDiscovery]', error));
//   };
//   _stopDiscovery = () => {
//     stopDiscovery()
//       .then(() => this.setState({ scanning: false, discoveredBeacons: [] }))
//       .then(() => console.log('stopped discovery'))
//       .catch((error) => console.log('[stopDiscovery]', error));
//   };
//   _restartDiscovery = () => {
//     restartDiscovery()
//       .then(() => this.setState({ scanning: true, discoveredBeacons: [] }))
//       .then(() => console.log('restarted discovery'))
//       .catch((error) => console.log('[restartDiscovery]', error));
//   };

//   /* --- Ranging beacons --- */

//   _startRanging = () => {
//     startRangingBeaconsInRegion(region1)
//       .then(() => this.setState({ ranging: true, rangedBeacons: [] }))
//       .then(() => console.log('started ranging'))
//       .catch((error) => console.log('[startRanging]', error));
//   };
//   _stopRanging = () => {
//     stopRangingBeaconsInRegion(region1)
//       .then(() => this.setState({ ranging: false, rangedBeacons: [] }))
//       .then(() => console.log('stopped ranging'))
//       .catch((error) => console.log('[stopRanging]', error));
//   };
//   _stopAllRanging = () => {
//     stopRangingBeaconsInAllRegions()
//       .then(() => this.setState({ ranging: false, rangedBeacons: [] }))
//       .then(() => console.log('stopped ranging in all regions'))
//       .catch((error) => console.log('[stopAllRanging]', error));
//   };

//   /* --- Monitoring beacons --- */

//   _startMonitoring = () => {
//     startMonitoringForRegion(region1)
//       .then(() => this.setState({ monitoring: true }))
//       .then(() => console.log('started monitoring'))
//       .catch((error) => console.log('[startMonitoring]', error));
//   };
//   _stopMonitoring = () => {
//     stopMonitoringForRegion(region1)
//       .then(() => this.setState({ monitoring: false }))
//       .then(() => console.log('stopped monitoring'))
//       .catch((error) => console.log('[stopRanging]', error));
//   };
//   _stopAllMonitoring = () => {
//     stopMonitoringForAllRegions()
//       .then(() => this.setState({ monitoring: false }))
//       .then(() => console.log('stopped monitoring in all regions'))
//       .catch((error) => console.log('[stopAllMonitoring]', error));
//   };

//   /* --- Authorization --- */

//   _getAuthorizationStatus = () => {
//     getAuthorizationStatus()
//       .then((authorizationStatus) => {
//         Alert.alert(`Authorization status: ${authorizationStatus}`);
//         console.log(`Authorization status: ${authorizationStatus}`);
//       })
//       .catch((error) => console.log('[getAuthorizationStatus]', error));
//   };

//   _requestAlwaysAuthorization = () => {
//     requestAlwaysAuthorization()
//       .then(() => console.log('requested always authorization'))
//       .catch((error) => console.log('[requestAlwaysAuthorization]', error));
//   };

//   _requestWhenInUseAuthorization = () => {
//     requestWhenInUseAuthorization()
//       .then(() => console.log('requested when in use authorization'))
//       .catch((error) => console.log('[requestWhenInUseAuthorization]', error));
//   };

//   /* --- Regions --- */

//   _getRangedRegions = () => {
//     getRangedRegions()
//       .then((regions) => this.setState({ rangedRegions: regions }))
//       .then(() => console.log('got ranged regions'))
//       .catch((error) => console.log('[getRangedRegions]', error));
//   };

//   _getMonitoredRegions = () => {
//     getMonitoredRegions()
//       .then((regions) => this.setState({ monitoredRegions: regions }))
//       .then(() => console.log('got monitored regions'))
//       .catch((error) => console.log('[getMonitoredRegions]', error));
//   };

//   /**
//    * Helper function used to identify equal regions
//    */
//   _isIdenticalRegion = (r1, r2) =>
//     r1.identifier === r2.identifier;

//   /* --- Render methods --- */

//   _renderDiscoveredBeacons = () => {
//     const colors = ['#F7C376', '#EFF7B7', '#F4CDED', '#A2C8F9', '#AAF7AF'];

//     return this.state.discoveredBeacons
//       .sort(
//         (
//           a,
//           b
//         ) => a.rssi - b.rssi
//       )
//       .map(
//         (beacon, index) => (
//           <View
//             key={index}
//             style={[
//               styles.beacon,
//               { backgroundColor: colors[beacon.minor ? beacon.minor - 1 : 0] },
//             ]}
//           >
//             <Text style={{ fontWeight: 'bold' }}>{beacon.uniqueId}</Text>
//             <Text>
//               Battery Power: {beacon.batteryLevel}, TxPower:{' '}
//               {beacon.transmissionPower}
//             </Text>
//             <Text>
//               Model: {beacon.model}, RSSI: {beacon.rssi}
//             </Text>
//             <Text>
//               FirmwareVersion: {beacon.firmwareVersion}, Name: {beacon.name}
//             </Text>
//             <Text>
//               Locked: {beacon.locked ? 'Yes' : 'No'}, Shuffled:{' '}
//               {beacon.shuffled ? 'Yes' : 'No'}
//             </Text>
//             <Text>updatedAt: {beacon.updatedAt}</Text>
//           </View>
//         ),
//         this
//       );
//   };

//   _renderRangedBeacons = () => {
//     const colors = ['#F7C376', '#EFF7B7', '#F4CDED', '#A2C8F9', '#AAF7AF'];

//     return this.state.rangedBeacons
//       .sort(
//         (a, b) =>
//           parseInt(a.accuracy) - parseInt(b.accuracy)
//       )
//       .map(
//         (beacon, index) => (
//           <View
//             key={index}
//             style={[
//               styles.beacon,
//               { backgroundColor: colors[beacon.minor - 1] },
//             ]}
//           >
//             <Text style={{ fontWeight: 'bold' }}>{beacon.uuid}</Text>
//             <Text>
//               Major: {beacon.major}, Minor: {beacon.minor}
//             </Text>
//             <Text>
//               RSSI: {beacon.rssi}, Proximity: {beacon.proximity}
//             </Text>
//             <Text>Distance: {beacon.accuracy}</Text>
//           </View>
//         ),
//         this
//       );
//   };

//   _renderMonitoredRegions = () => {
//     const colors = ['#F7C376', '#EFF7B7', '#F4CDED', '#A2C8F9', '#AAF7AF'];

//     return this.state.monitoredRegionsCloseBy.map(
//       (region, index) => (
//         <View
//           key={index}
//           style={[
//             styles.beacon,
//             { backgroundColor: colors[region.major ? region.major - 1 : 0] },
//           ]}
//         >
//           <Text style={{ fontWeight: 'bold' }}>{region.identifier}</Text>
//           <Text>UUID: {region.uuid}</Text>
//           <Text>
//             Major: {region.major}, Minor: {region.minor}
//           </Text>
//         </View>
//       ),
//       this
//     );
//   };

//   _renderRegions = () => {
//     const { rangedRegions, monitoredRegions } = this.state;
//     return (
//       <View>
//         <Text style={{ color: '#ABE88D' }}>
//           {rangedRegions !== []
//             ? rangedRegions.reduce(
//                 (result, region) =>
//                   result + region.identifier + ', ',
//                 ''
//               )
//             : 'No ranged regions'}
//         </Text>
//         <Text style={{ color: '#F48661' }}>
//           {monitoredRegions !== []
//             ? monitoredRegions.reduce(
//                 (result, region) =>
//                   result + region.identifier + ', ',
//                 ''
//               )
//             : 'No monitored regions'}
//         </Text>
//       </View>
//     );
//   };

//   _renderEmpty = () => {
//     const {
//       scanning,
//       ranging,
//       monitoring,
//       discoveredBeacons,
//       rangedBeacons,
//       monitoredRegionsCloseBy,
//     } = this.state;
//     let text = '';
//     if (!scanning && !ranging && !monitoring)
//       text = 'Start scanning to listen for beacon signals!';
//     if (scanning && !discoveredBeacons.length)
//       text = 'No beacons discovered yet...';
//     if (ranging && !rangedBeacons.length) text = 'No beacons ranged yet...';
//     if (monitoring && !monitoredRegionsCloseBy.length)
//       text = 'No monitored regions in your proximity...';
//     return text ? (
//       <View style={styles.textContainer}>
//         <Text style={styles.text}>{text}</Text>
//       </View>
//     ) : null;
//   };

//   _renderAuthorizationStatusText = () => {
//     const { authorizationStatus } = this.state;
//     return authorizationStatus ? (
//       <View style={styles.textContainer}>
//         <Text style={[styles.text, { color: 'red' }]}>
//           {authorizationStatus}
//         </Text>
//       </View>
//     ) : null;
//   };

//   _renderButton = (
//     text,
//     onPress,
//     backgroundColor
//   ) => (
//     <TouchableOpacity
//       style={[styles.button, { backgroundColor }]}
//       onPress={onPress}
//     >
//       <Text>{text}</Text>
//     </TouchableOpacity>
//   );

//   render() {
//     const {
//       scanning,
//       ranging,
//       monitoring,
//       discoveredBeacons,
//       rangedBeacons,
//       monitoredRegionsCloseBy,
//     } = this.state;

//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.buttonContainer}>
//           {this._renderButton(
//             'Start discovery',
//             this._startDiscovery,
//             '#84e2f9'
//           )}
//           {this._renderButton('Stop', this._stopDiscovery, '#84e2f9')}
//           {this._renderButton('Restart', this._restartDiscovery, '#84e2f9')}
//         </View>
//         <View style={styles.buttonContainer}>
//           {this._renderButton('Start ranging', this._startRanging, '#ABE88D')}
//           {this._renderButton('Stop', this._stopRanging, '#ABE88D')}
//           {this._renderButton('Stop all', this._stopAllRanging, '#ABE88D')}
//         </View>
//         <View style={styles.buttonContainer}>
//           {this._renderButton(
//             'Start monitoring',
//             this._startMonitoring,
//             '#F48661'
//           )}
//           {this._renderButton('Stop', this._stopMonitoring, '#F48661')}
//           {this._renderButton('Stop all', this._stopAllMonitoring, '#F48661')}
//         </View>
//         <View style={styles.buttonContainer}>
//           {this._renderButton(
//             'Get Status',
//             this._getAuthorizationStatus,
//             '#F4ED5A'
//           )}
//           {this._renderAuthorizationStatusText()}
//         </View>
//         <View style={styles.buttonContainer}>
//           {this._renderButton(
//             'Ranged regions',
//             this._getRangedRegions,
//             '#ABE88D'
//           )}
//           {this._renderButton(
//             'Monitored regions',
//             this._getMonitoredRegions,
//             '#F48661'
//           )}
//         </View>
//         {this._renderRegions()}
//         <ScrollView>
//           {this._renderEmpty()}
//           {scanning &&
//             !!discoveredBeacons.length &&
//             this._renderDiscoveredBeacons()}
//           {ranging && !!rangedBeacons.length && this._renderRangedBeacons()}
//           {monitoring &&
//             !!monitoredRegionsCloseBy.length &&
//             this._renderMonitoredRegions()}
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 20, // statusbarHeight
//   },
//   beacon: {
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     padding: 10,
//   },
//   textContainer: {
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
//   button: {
//     padding: 10,
//     borderRadius: 10,
//   },
// });

import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
import { postAPI } from 'src/api-rest/httpService';
import { androidBluetoothPermission } from 'src/lib/androidPermissions';
import { Header } from 'src/components';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3000, true).then((results) => {
        console.log('Scanning...');
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }
  }

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  }

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  }

  const handleDiscoverPeripheral = (peripheral) => {
    // console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }

  const testPeripheral = (peripheral) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id).then(() => {
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            setList(Array.from(peripherals.values()));
          }
          console.log('Connected to ' + peripheral.id);

          setTimeout(() => {
            /* Test read current RSSI value */
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);

              BleManager.readRSSI(peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
                let p = peripherals.get(peripheral.id);
                if (p) {
                  p.rssi = rssi;
                  peripherals.set(peripheral.id, p);
                  setList(Array.from(peripherals.values()));
                }
              });
            });

            // Test using bleno's pizza example
            // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
            /*
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = '13333333-3333-3333-3333-333333333337';
              var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
              var crustCharacteristic = '13333333-3333-3333-3333-333333330001';
              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                      console.log('Writed NORMAL crust');
                      BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                        console.log('Writed 351 temperature, the pizza should be BAKED');
                        
                        //var PizzaBakeResult = {
                        //  HALF_BAKED: 0,
                        //  BAKED:      1,
                        //  CRISPY:     2,
                        //  BURNT:      3,
                        //  ON_FIRE:    4
                        //};
                      });
                    });
                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 200);
            });*/
          }, 900);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }

  useEffect(() => {
    const timeout = list.length > 0 ?
      setTimeout(() => {
        findX();
      }, 1000) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [list]);

  const findX = async() => {
    list.map(async(item) => {
      let serviceDataString = '';
      if (item.advertising && item.advertising.serviceData && typeof item.advertising.serviceData['1803'] !== 'undefined') {
        serviceDataString = item.advertising.serviceData['1803'].data;
        // console.log('serviceDataString', serviceDataString);

        let body = {
          beacon_manu: serviceDataString
        };
        if (Platform.OS === 'ios') {
          body['beacon_uuid_ios'] = item.id;
        } else {
          body['beacon_uuid'] = item.id
        }
        console.log('body', body);
        const aww =await postAPI('beacon/find-x', body);
        console.log('aww', aww);
      }
    });
  }

  useEffect(() => {
    const init = async() => {
      const status = await androidBluetoothPermission();
      console.log('status', status);
      if (status) {
        await BleManager.start({ showAlert: false, restoreIdentifierKey: 'fda50693-a4e2-4fb1-afcf-c6eb07647825' });
      }
    }

    init();

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    return (() => {
      console.log('unmount');
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
      bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
    })
  }, []);

  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    let serviceDataString = '';
    let manuData = '';

    if (item.advertising && item.advertising.serviceData && typeof item.advertising.serviceData['1803'] !== 'undefined') {
      serviceDataString = item.advertising.serviceData['1803'].data;
    }

    if (item.advertising && item.advertising.manufacturerData && item.advertising.manufacturerData.data) {
      manuData = item.advertising.manufacturerData.data;
    }

    // console.log('serviceDataString', serviceDataString !== '');

    // 'E8:D8:B3:14:DB:EC' : '6NizFNvsAAEAAgcD6GQ=' : 'AgEGGv9MAAIV/aUGk6TiT7Gvz8brB2R4JQABAALYCQlSREw1MTgyMhEWAxjo2LMU2+wAAQACBwPoZAAAAAA='
    // 'FD:7E:9C:3B:27:04' : '/X6cOycEAAEAAgcD6FU=' : 'AgEGGv9MAAIV/aUGk6TiT7Gvz8brB2R4JQABAALYCQlSREw1MTgyMhEWAxj9fpw7JwQAAQACBwPoVQAAAAA='
    // 'F0:DE:A3:CE:DD:C2' : '8N6jzt3CAAEAAgcD6FI=' : 'AgEGGv9MAAIV/aUGk6TiT7Gvz8brB2R4JQABAALYCQlSREw1MTgyMhEWAxjw3qPO3cIAAQACBwPoUgAAAAA='
    // 'F4:B0:59:5F:AD:74' : '9LBZX610AAEAAgcD6GI=' : 'AgEGGv9MAAIV/aUGk6TiT7Gvz8brB2R4JQABAALYCQlSREw1MTgyMhEWAxj0sFlfrXQAAQACBwPoYgAAAAA='
    // 'F4:42:F1:58:48:62' : '9ELxWEhiAAEAAgcD6FE=' : 'AgEGGv9MAAIV/aUGk6TiT7Gvz8brB2R4JQABAALYCQlSREw1MTgyMhEWAxj0QvFYSGIAAQACBwPoUQAAAAA='
    
    return (
      <View>
        {serviceDataString !== '' ?
          <View style={[styles.row, { backgroundColor: color, padding: 8, marginBottom: 4, paddingHorizontal: 16 }]}>
            <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', fontWeight: '600' }}>{item.name}</Text>
            <TouchableHighlight
              onPress={() => {
                Clipboard.setString(item.id);
                alert('copied');
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}>
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#333333', padding: 4 }}>{item.id}</Text>
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#333333', fontWeight: '600', marginLeft: 8 }}>copy</Text>
              </View>
            </TouchableHighlight>
            <Text style={{ fontSize: 14, textAlign: 'center', color: 'blue' }}>{serviceDataString}</Text>
            <Text style={{ fontSize: 14, textAlign: 'center', color: 'green' }}>{manuData}</Text>
          </View>
        :
          <View />
        }
      </View>
    );
  }

  console.log('list', list);

  return (
    <>
      <SafeAreaView>
        <Header />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>

            <View style={{ margin: 10 }}>
              <Button
                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan()}
              />
            </View>

            {/* <View style={{margin: 10}}>
              <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected() } />
            </View> */}

            {(list.length == 0) &&
              <View style={{ flex: 1, margin: 20 }}>
                <Text style={{ textAlign: 'center' }}>No peripherals</Text>
              </View>
            }
          </View>
        </ScrollView>
        <FlatList
          data={list}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;