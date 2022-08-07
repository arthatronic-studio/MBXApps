import React, { useRef, forwardRef } from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Col, Row, Text, useColor } from '@src/components';

import { useCombinedRefs } from '@src/hooks';
import { statusBarHeight } from 'src/utils/constants';
import ImagesPath from 'src/components/ImagesPath';
import { FormatMoney } from 'src/utils';
import CardEventTicket from './CardEventTicket';
import { Container } from 'src/styled';

const defaultProps = {
  data: [],
  adjust: true,
  selected: null,
  name: '',
  onPress: () => { },
  onClose: () => { },
  style: {},
};

const ModalChangeTicket = forwardRef((props, ref) => {
  const { data, selected, adjust, onPress, onClose, children, style, name } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();

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
      <Container padding={16} paddingTop={32}>
        <Text type='bold' align='left'>Ganti Tiket</Text>
      </Container>
      <View style={{width, maxHeight: height / 2}}>
        <ScrollView>
          {[1, 2, 3].map((val, id) => (
            <CardEventTicket onSelect={() => onClose()} />
          ))}
        </ScrollView>
      </View>
    </Modalize>
  );
});

ModalChangeTicket.defaultProps = defaultProps;
export default ModalChangeTicket;
