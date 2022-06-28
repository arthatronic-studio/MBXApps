import React, {useRef, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Col, Row, Text, useColor} from '@src/components';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';
import ImagesPath from 'src/components/ImagesPath';
import { FormatMoney } from 'src/utils';

const defaultProps = {
  data: [],
  adjust: true,
  selected: null,
  name: '',
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalChangeTicket = forwardRef((props, ref) => {
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
      }}
      >
      <View style={{height, width, padding: 16}}>
        <ScrollView>
          <Text type='bold' align='left' style={{ marginTop: 15 }}>Ganti Tiket</Text>
          {[1,2,3].map((val, id) => (
            <View style={{ borderColor: '#CDD1D2', marginVertical: 10, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row style={{ marginBottom: 5 }}>
                    <Text color='#111' type='bold' size={11}>PRESALE - Regular (A)</Text>
                    <Col>
                        <Text size={11} color={Color.text} type='medium' align='right'>08 Feb 2022</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 12, }}>
                    <Row style={{ marginRight: 10,  alignItems: 'center' }}>
                        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                            <Image source={ImagesPath.refund} style={{ width: 15, height: 15, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>Bisa Refund</Text>
                    </Row>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                            <Image source={ImagesPath.calendar} style={{  width: 16, height: 16, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>Tidak Perlu Reservasi</Text>
                    </Row>
                </Row>
                <View style={{ height: 1,  marginVertical: 12 }} />
                <Row style={{  alignItems: 'center' }}>
                    <Col size={8} style={{   alignItems: 'flex-start', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                        <Text color={Color.text} size={9}>Harga</Text>
                        <Text color={Color.text} size={14} type='semibold'>{FormatMoney.getFormattedMoney(100000)}/pax</Text>
                    </Col>
                    <Col style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => onClose()} style={{ backgroundColor: Color.primary, borderRadius: 30, paddingVertical: 8, paddingHorizontal: 10 }}>
                            <Text color={'#fff'} type='medium' size={11}>Pilih tiket</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modalize>
  );
});

ModalChangeTicket.defaultProps = defaultProps;
export default ModalChangeTicket;
