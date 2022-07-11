import React, {useRef,useState, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Col, Row, Text, useColor} from '@src/components';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';

const defaultProps = {
  data: [],
  adjust: true,
  selected: null,
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalPassanger = forwardRef((props, ref) => {
  const {data, selected, adjust, onPress, onClose, onSave, children, style} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [title, setTitle] = useState('MR');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');

  const {Color} = useColor();
  const {width, height} = useWindowDimensions();

  const onSubmit = () => {
    const data = {
      title,
      name,
      phone,
      email,
      idCardNumber
    }

    onSave([data])
  }

  return (
    <Modalize
      ref={combinedRef}
      withHandle
      adjustToContentHeight={adjust}
      handlePosition="inside"
      handleStyle={{
        width: width / 6,
        height: 4,
        backgroundColor: Color.primary,
        marginTop: 8,
      }}
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        paddingBottom: statusBarHeight,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }} >
      <View style={{height, width, padding: 16}}>
        <ScrollView>
          <Text type='bold' align='left' style={{ marginTop: 15, marginBottom: 10 }}>Tambah Pengunjung</Text>
          <View style={{ borderColor: '#CDD1D2', alignItems: 'flex-start', borderWidth: 1, borderRadius: 8, padding: 10 }}>
            <Text size={12} style={{ marginBottom: 16 }} type='bold'>Tiket 1</Text>
            <Text size={10}>Sapaan</Text>
            <Row style={{ marginTop: 4, marginBottom: 16 }}>
              <TouchableOpacity onPress={() => setTitle('MR')} style={{ paddingVertical: 8, marginRight: 8, backgroundColor: title == 'MR' ? Color.primary : '#CDD1D2', paddingHorizontal: 14, borderRadius: 40 }}>
                <Text size={12} color={title == 'MR' ? Color.semiwhite : Color.text} type='medium'>Tuan</Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => setTitle('MRS')} style={{ paddingVertical: 8, marginRight: 8, backgroundColor: title == 'MRS' ? Color.primary : '#CDD1D2', paddingHorizontal: 14, borderRadius: 40 }}>
                <Text size={12} color={title == 'MRS' ? Color.semiwhite : Color.text} type='medium'>Nyonya</Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => setTitle('MS')} style={{ paddingVertical: 8, marginRight: 8, backgroundColor: title == 'MS' ? Color.primary : '#CDD1D2', paddingHorizontal: 14, borderRadius: 40 }}>
                <Text size={12} color={title == 'MS' ? Color.semiwhite : Color.text} type='medium'>Nona</Text>
              </TouchableOpacity>
            </Row>
            <View style={{alignItems: 'flex-start',width: '100%',  marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput
                        placeholder='Adang Susanyo'
                        style={{
                            borderWidth: 1, borderColor: Color.border, color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                        onChangeText={(value) => setName(value)}
                        value={name}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Nama Lengkap</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start',width: '100%',  marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput
                        placeholder='81212345678'
                        keyboardType='numeric'
                        style={{
                            borderWidth: 1, borderColor: Color.border, color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                        onChangeText={(value) => setPhone(value)}
                        value={phone}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No. Telepon</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start',width: '100%',  marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput
                        placeholder='contoh@email.com'
                        style={{
                            borderWidth: 1, borderColor: Color.border, color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                        onChangeText={(value) => setEmail(value)}
                        value={email}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Email</Text>
                </View>
            </View>
            <View style={{alignItems: 'flex-start',width: '100%',  marginVertical: 5}}>
                <View style={{width: '100%'}}>
                    <TextInput
                        placeholder='36711XXXXXXXXXXX'
                        style={{
                            borderWidth: 1, borderColor: Color.border, color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                        onChangeText={(value) => setIdCardNumber(value)}
                        value={idCardNumber}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No. KTP</Text>
                </View>
            </View>
          </View>
          <View style={{ marginTop: 20,  height: 70, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => onSubmit()} style={{backgroundColor: Color.primary, width: width-40, height: 45, borderRadius: 20, justifyContent: 'center'}}>
                  <Text style={{color: Color.textInput}}>Simpan</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modalize>
  );
});

ModalPassanger.defaultProps = defaultProps;
export default ModalPassanger;
