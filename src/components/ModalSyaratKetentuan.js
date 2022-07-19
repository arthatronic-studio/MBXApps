import React, {useState, useEffect} from 'react';
import {View, Image, ImageBackground, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {shadowStyle} from '@src/styles';
import ImagesPath from 'src/components/ImagesPath';
import {WebView} from 'react-native-webview';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Button,
} from '@src/components';
import {Container} from 'src/styled';
import FormInput from './FormInput';

const defaultProps = {
  visible: false,
  onSubmit: () => {},
  onClose: () => {},
  style: {},
  content: '',
  errorMessage: '',
};

const ModalSyaratKetentuan = ({
  visible,
  onSubmit,
  onClose,
  style,
  errorMessage,
  content,
}) => {
  const {Color} = useColor();

  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setErrorText(errorMessage);
  }, [errorMessage]);

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInDown"
      animationOut="slideOutDown"
      style={{margin: 0}}>
      <Scaffold showHeader={true} onPressLeftButton={() => onClose()}>
        <View
          style={{
            width: '100%',
            borderRadius: 8,
          }}>
          {/* <TouchableOpacity
              onPress={() => {
               navigation.navigate('MainProfile');
              }}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: Color.error,
                borderRadius: 12,
                
              }}>
              <Image
                source={ImagesPath.icClose}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity> */}

          <View
            style={{
              width: '100%',
              aspectRatio: 2 / 4,
              borderRadius: 4,
              paddingBottom: 90,
            
            }}>
            <WebView
              source={{html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>${content}</p></body></html>`}}
              originWhitelist={['*']}
            />
          </View>
        </View>
      </Scaffold>
    </Modal>
  );
};

ModalSyaratKetentuan.defaultProps = defaultProps;
export default ModalSyaratKetentuan;
