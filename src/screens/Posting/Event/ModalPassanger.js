import React, {useRef, forwardRef} from 'react';
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
  name: '',
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalPassanger = forwardRef((props, ref) => {
  const {data, selected, adjust, onPress, onClose, children, style, name} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width, height} = useWindowDimensions();

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
              <View style={{ paddingVertical: 8, marginRight: 8, backgroundColor: '#CDD1D2', paddingHorizontal: 14, borderRadius: 40 }}>
                <Text size={12} type='medium'>Tuan</Text>
              </View>
              <View style={{ paddingVertical: 8, marginRight: 8, backgroundColor: '#CDD1D2', paddingHorizontal: 14, borderRadius: 40 }}>
                <Text size={12} type='medium'>Nyonya</Text>
              </View>
              <View style={{ paddingVertical: 8, marginRight: 8, backgroundColor: '#CDD1D2', paddingHorizontal: 14, borderRadius: 40 }}>
                <Text size={12} type='medium'>Nona</Text>
              </View>
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
                        style={{
                            borderWidth: 1, borderColor: Color.border, color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                        onChangeText={(value) => setName(value)}
                        value={name}
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
                        onChangeText={(value) => setName(value)}
                        value={name}
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
                        onChangeText={(value) => setName(value)}
                        value={name}
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>No. KTP</Text>
                </View>
            </View>
          </View>
          {/* <View style={{ marginTop: 20,  height: 70, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => submit()} style={{backgroundColor: Color.primary, width: width-40, height: 45, borderRadius: 20, justifyContent: 'center'}}>
                  <Text style={{color: Color.textInput}}>Simpant</Text>
              </TouchableOpacity>
          </View> */}
        </ScrollView>
      </View>
    </Modalize>
  );
});

ModalPassanger.defaultProps = defaultProps;
export default ModalPassanger;
