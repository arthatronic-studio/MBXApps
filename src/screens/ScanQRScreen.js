
import React, { Component } from 'react';
import { View, Modal, SafeAreaView, Dimensions, Linking, Platform } from 'react-native';
import Styled from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera } from 'react-native-vision-camera';
// import ScanQR from 'react-native-qrcode-scanner';

import { store } from '@src/state/redux';

import {
  Text,
  Header,
  TouchableOpacity,
  Loading, useLoading,
} from '@src/components';
import Color, { useColor } from '@src/components/Color';
import { postAPI } from 'src/api-rest/httpService';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';

// import Client from '../lib/apollo';
// import { queryVestaAttendance } from '../lib/query';

const { height } = Dimensions.get('window');

const FlashIcon = Styled(MaterialIcons)`
  fontSize: 20;
  color: ${Color.text};
`;

const ContainerModal = Styled(SafeAreaView)`
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
`;

const ButtonSubmit = Styled(TouchableOpacity)`
  borderRadius: 8px;
  width: 100%;
  height: 45px;
  backgroundColor: ${Color.theme};
  justifyContent: center;
  elevation: 2;
  marginTop: 16px;
`;

const ButtonText = Styled(Text)`
  fontSize: 14px
  color: #FFFFFF
  lineHeight: 34px
`;

const CardModal = Styled(View)`
  width: 90%;
  alignItems: center;
  padding: 16px;
  backgroundColor: #FFFFFF;
  borderRadius: 8px;
`;

export default class ScanQRScreen extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props)
    this.state = {
      flashMode: false,
      modalVerify: false,
      scanning: true,
      cameraType: true,
      messageResponse: '',
      statusResponse: '',
      typeResponse: '',
      coords: null,
      loadingCoords: true,
      reqCoordsId: 0,
      loadingProps: {
        visible: false,
        loadingType: '',
        message: '',
      }
    };
  }

  componentDidMount() {
    this.getCoords();
  }

  validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  getCoords() {
    this.setState({ loadingCoords: true, reqCoordsId: this.state.reqCoordsId + 1 }, () => {
      // Geolocation.getCurrentPosition(
      //   res => {
      //     console.log(res, 'res get coords');
      //     if (res.coords) {
      //       this.setState({ coords: res.coords });
      //     }

      //     setTimeout(() => {
      //       this.setState({ loadingCoords: false });
      //       if (this.state.reqCoordsId > 1) this.timeoutModal('Lokasi berhasil ditemukan, silakan scan QR', 'Fokuskan Lokasi', 'success');
      //     }, 1500);
      //   },
      //   err => {
      //     console.log(err, 'err get coords');

      //     setTimeout(() => {
      //       this.setState({ loadingCoords: false });
      //       this.timeoutModal('Lokasi tidak ditemukan, silakan periksa izin lokasi', 'Fokuskan Lokasi', 'error');
      //     }, 1500);
      //   },
      //   {
      //     enableHighAccuracy: false,
      //     timeout: 20000,
      //     maximumAge: 0,
      //   }
      // );
    });
  }

  getVestaAttendance(token, longitude, latitude) {
    // Client.query({
    //   query: queryVestaAttendance,
    //   variables: { token, longitude, latitude },
    // })
    // .then(res => {
    //   console.log(res, 'res');
    //   const data = res.data.vestaAttendance;

    //   if (data && data.success) {
    //     this.timeoutModal(data.message, 'Absen Berhasil', 'success');
    //   } else {
    //     this.timeoutModal('Data tidak ditemukan', 'Absen Gagal', 'error');
    //   }
    // })
    // .catch(err => {
    //   console.log(err, 'errr');
    //   this.timeoutModal('Data tidak ditemukan', 'Absen Gagal', 'error');
    // })
  }

  timeoutModal(message, status, type, func) {
    this.setState({ modalVerify: true, messageResponse: message, statusResponse: status, typeResponse: type }, () => {
      // setTimeout(() => {
        // this.setState({ modalVerify: false, messageResponse: '', statusResponse: '', typeResponse: '' }, () => {
        //   this.scanner.reactivate();
        // });
      // }, 7500);

      if (typeof func !== 'undefined') {
        setTimeout(() => {
          func();
        }, 1500);
      }
    })
  }

  isJsonString(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
}

  async onCheckin(beacon_uid, beacon_type) {
    const body = {
      beacon_uid,
      beacon_type,
    };

    console.log('body', body);

    const result = await postAPI('user-activity', body);
    console.log('result', result);

    if (result.status) {
      store.dispatch({ type: 'AUTH.SET_CHECKIN', data: result.data });

      setTimeout(() => {
        this.props.navigation.goBack();
      }, 3000);

      const prof = await stateUpdateProfile();
      console.log('prof', prof);
    }
    
    this.setState({
      loadingProps: {
        ...this.state.loadingProps,
        visible: true,
        loadingType: result.status ? 'success' : 'error',
        message: result.message,
      }
    });

    setTimeout(() => {
      this.setState({
        loadingProps: {
          ...this.state.loadingProps,
          visible: false,
        }
      });

      if (!result.status) this.scanner.reactivate();
    }, 3000);
  }

  barcodeReceived(e) {
    console.log(e);
    const parseData = this.isJsonString(e.data);
    console.log(parseData);

    if (parseData && parseData.beacon_uid && parseData.beacon_type) {
      this.onCheckin(parseData.beacon_uid, parseData.beacon_type);
    }
    else {
      this.setState({
        loadingProps: {
          ...this.state.loadingProps,
          visible: true,
          loadingType: 'error',
          message: 'QR Code tidak dikenal',
        }
      });
  
      setTimeout(() => {
        this.setState({
          loadingProps: {
            ...this.state.loadingProps,
            visible: false,
          }
        });

        this.scanner.reactivate();
      }, 3000);
    }
  }

  onPressRightButton() {
    this.setState({ flashMode: !this.state.flashMode });
  }

  scanner;
  // camera;

  render() {
    const { cameraType, messageResponse, statusResponse, typeResponse, flashMode, modalVerify, loadingCoords } = this.state;

    // console.log(this.state, 'qrscanner');

    let colorIconResponse = Color.theme;
    let colorTextResponse = Color.success;
    let iconNameResponse = 'checkmark';

    if (typeResponse === 'error') {
      colorIconResponse = Color.error;
      colorTextResponse = Color.text;
      iconNameResponse = 'alert';
    }
    
    return (
        <View style={{flex: 1}}>
            <Header
                title='Scan QR'
                showLeftButton
                iconRightButton={<FlashIcon name={flashMode ? 'flash-on' : 'flash-off'}></FlashIcon>}
                onPressRightButton={() => this.onPressRightButton()}
            />

            {/* <ScanQR
                ref={(scan) => this.scanner = scan}
                onRead={(e) => this.barcodeReceived(e)}
                showMarker
                cameraStyle={{height: height}}
                containerStyle={{}}
                cameraType={cameraType ? 'back' : 'front'}
                markerStyle={{borderColor: Color.theme, borderWidth: modalVerify ? 0 : 1}}
                flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
                topViewStyle={{flex: 0}}
                bottomViewStyle={{flex: 0}}
                cameraProps={{
                  autoFocus: Camera.Constants.AutoFocus.on,
                }}
            /> */}

            {/* <Camera
              ref={ref => this.camera = ref}
              style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
              type={Camera.Constants.Type.back}
              flashMode={Camera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              // onGoogleVisionBarcodesDetected={({ barcodes }) => {
              //   console.log(barcodes);
              // }}
            /> */}

            {/* <TouchableOpacity
              style={{height: 60, backgroundColor: Color.white, justifyContent: 'center', alignItems: 'center'}}
              onPress={() => this.getCoords()}
            >
              <MaterialIcons name='my-location' size={30} />
              <Text>Fokuskan Lokasi</Text>
            </TouchableOpacity> */}

            <Modal
              visible={modalVerify}
              onRequestClose={() => {
                this.setState({ modalVerify: false }, () => {
                  this.scanner.reactivate();
                });
              }}
              transparent
            >
              <ContainerModal>
                <CardModal>
                  <View style={{width: 74, height: 74, borderRadius: 37, borderWidth: 3, borderColor: colorIconResponse, alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
                    <Ionicons name={iconNameResponse} size={32} color={colorIconResponse} />
                  </View>
                  
                  <Text type='semibold' size={18}>{statusResponse}</Text>
                  <Text type='bold' color={colorTextResponse}>{messageResponse}</Text>

                  <ButtonSubmit
                    onPress={() => {
                      this.setState({ modalVerify: false }, () => {
                        this.scanner.reactivate();
                      });
                    }}
                  >
                    <ButtonText>Oke</ButtonText>
                  </ButtonSubmit>
                </CardModal>
              </ContainerModal>
            </Modal>

            <Loading {...this.state.loadingProps} />
      </View>
    )
  }
}