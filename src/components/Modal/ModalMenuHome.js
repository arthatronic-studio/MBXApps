import React, {useRef, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Text, useColor} from '@src/components';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';
import WidgetMenuHome from 'src/screens/MainHome/WidgetMenuHome';
import { Row } from '../Grid';

const defaultProps = {
  data: [],
  adjust: true,
  selected: null,
  name: '',
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalMenuHome = forwardRef((props, ref) => {
  const {data, selected, adjust, onPress, onClose, children, style, name} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width} = useWindowDimensions();

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
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}>
      <View style={{flex: 1, paddingTop: 50}}>
        
        <ScrollView>
            <View style={{ alignItems: 'flex-start', paddingLeft: 16 }}>
                <Text size={14} type='bold'>Fitur Ungulan</Text>
            </View>
            <WidgetMenuHome bgColor={'#F4F4F4'} />
            
            <View style={{ alignItems: 'flex-start', paddingLeft: 16 }}>
                <Text size={14} type='bold'>Semua Fitur</Text>
            </View>
            <View style={{  paddingLeft: 16, paddingTop: 22 }}>
                <Text size={14} align='left' type='bold' style={{ marginBottom: 12 }}>Belanja</Text>
                <Row style={{ flexWrap: 'wrap' }}>
                    <TouchableOpacity style={{ alignItems: 'center', width: '25%', marginBottom: 10 }}>
                        <View style={{ height: 40, width: 40, borderRadius: 8, backgroundColor: '#558617' }} />
                        <Text type='medium' size={12} color='#111'>Market</Text>
                    </TouchableOpacity>
                </Row>
            </View>
        </ScrollView>
      </View>
    </Modalize>
  );
});

ModalMenuHome.defaultProps = defaultProps;
export default ModalMenuHome;
