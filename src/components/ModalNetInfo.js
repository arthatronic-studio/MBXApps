import React from 'react';
import {
    Platform,
    View,
    Image,
    TouchableOpacity,
    Linking,
} from 'react-native';
import Modal from 'react-native-modal';

import {
    Text,
    Submit,
    useColor,
} from '@src/components';
import ImagesPath from './ImagesPath';

const ModalNetInfo = ({ visible, onRefresh }) => {
    const {Color} = useColor();

    return (
        <Modal
          isVisible={visible}
          onBackdropPress={() => {}}
          animationIn="slideInDown"
          animationOut="slideOutDown"
          backdropColor={Color.semiwhite}>
          <View
            style={{
              width: '95%',
              aspectRatio: 1 / 1,
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                backgroundColor: Color.textInput,
                borderRadius: 15,
                height: '100%',
                padding: 30,
              }}>
              <Image source={ImagesPath.lostConnection}></Image>
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  Oops, Internetmu Terputus
                </Text>
                <Text style={{color: Color.gray, fontSize: 12}}>
                  Kayaknya koneksi internetmu terputus. Coba muat ulang
                  aplikasi.
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: Color.primary,
                  borderRadius: 32,
                  paddingVertical: 16,
                }}
                onPress={() => {
                    // Platform.OS === 'ios' ? Linking.openURL('app-settings:') : {};
                    onRefresh();
                }}>
                <Text color={Color.textInput}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    )
}

export default ModalNetInfo;