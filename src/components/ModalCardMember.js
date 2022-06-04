import React, {useState, useEffect} from 'react';
import {View, Image, ImageBackground, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {shadowStyle} from '@src/styles';
import ImagesPath from 'src/components/ImagesPath';
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
  errorMessage: '',
};

const ModalCardMember = ({visible, onSubmit, onClose, style, errorMessage}) => {
  const {Color} = useColor();

  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setErrorText(errorMessage);
  }, [errorMessage]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => {
        onClose();
      }}
      animationIn="slideInDown"
      animationOut="slideOutDown">
      <Scaffold
        showHeader={false}
        style={{flex: 0, backgroundColor: 'transparent'}}>
        <View
          style={{
            width: '100%',
            padding: 16,
            backgroundColor: Color.theme,
            borderRadius: 8,
            ...style,
          }}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={{
              alignSelf: 'flex-end',
              backgroundColor: Color.error,
              borderRadius: 12,
              padding: 2,
            }}>
            <Image
              source={ImagesPath.icClose}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>

          <Container paddingHorizontal={16} marginTop={16}>
            <View
              style={{
                width: '100%',
                aspectRatio: 16 / 9,
                justifyContent: 'space-between',
                backgroundColor: Color.textInput,
                borderRadius: 4,
              }}>
              <ImageBackground
                source={ImagesPath.rrid1}
                style={{width: 280, height: 180, marginLeft: 9}}
              />
            </View>
          </Container>
          <Container marginVertical={15}>
            <Text size={16} type="medium">
              Depan
            </Text>
          </Container>
          <Container paddingHorizontal={16} marginTop={16}>
            <View
              style={{
                width: '100%',
                aspectRatio: 16 / 9,
                justifyContent: 'space-between',
                backgroundColor: Color.textInput,
                borderRadius: 4,
              }}>
              <ImageBackground
                source={ImagesPath.rrid2}
                style={{width: 280, height: 180, marginLeft: 9}}
              />
            </View>
          </Container>
          <Container marginVertical={15}>
            <Text size={16} type="medium">
              Belakang
            </Text>
          </Container>
        </View>
      </Scaffold>
    </Modal>
  );
};

ModalCardMember.defaultProps = defaultProps;
export default ModalCardMember;
