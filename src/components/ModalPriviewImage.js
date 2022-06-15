import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';

import ImagesPath from 'src/components/ImagesPath';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Button,
} from '@src/components';
import { Container } from 'src/styled';
import FormInput from './FormInput';

const defaultProps = {
  visible: false,
  onSubmit: () => {},
  onClose: () => {},
  style: {},
  errorMessage: '',
  thumbImage: '',
  mimeImage: '',
};

const ModalPriviewImage = ({
  visible,
  onSubmit,
  onClose,
  style,
  errorMessage,
  thumbImage,
  mimeImage,
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
            justifyContent: 'space-around',
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
              marginBottom:10,
              padding: 2,
            }}>
            <Image
              source={ImagesPath.icClose}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>

       
            <Image
              style={{
                height: '70%',
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                
                
                          
              }}
              source={{uri: `data:${mimeImage};base64,${thumbImage}`}}
            />
      

                  <Button
                      style={{ marginTop:5 }}
            onPress={() => {
              if (mimeImage === '') {
                setErrorText('Gambar tidak boleh kosong');
                return;
              }
              setErrorText('');
              onSubmit();
            }}>
            Kirim
          </Button>
        </View>
      </Scaffold>
    </Modal>
  );
};

ModalPriviewImage.defaultProps = defaultProps;
export default ModalPriviewImage;