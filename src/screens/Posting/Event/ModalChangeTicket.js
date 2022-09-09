import React, { useState, useEffect, useRef, forwardRef } from 'react';
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
import { getAPI } from 'src/api-rest/httpService';

const defaultProps = {
  adjust: true,
  selected: null,
  onSelected: () => { },
  onClose: () => { },
  style: {},
};

const ModalChangeTicket = forwardRef((props, ref) => {
  const { reffId, selected, adjust, onSelected, onClose, style } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();

  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    const result = await getAPI(`event/ticket/${reffId}`);
    console.log('result', result);
    if (result.status) {
      setItemData(result.data);
    }
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
      }}
    >
      <Container padding={16} paddingTop={32}>
        <Text type='medium' size={16} align='left'>Ganti Tiket</Text>
      </Container>
      <View style={{width, maxHeight: height / 2}}>
        <ScrollView>
          {itemData.map((item, idx) => (
            <CardEventTicket
              key={idx}
              item={item}
              onSelect={() => {
                onClose();
                onSelected(item);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </Modalize>
  );
});

ModalChangeTicket.defaultProps = defaultProps;
export default ModalChangeTicket;
