import React, {useRef, forwardRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Text, useColor} from '@src/components';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';

import {Divider} from '@src/styled';
import {TextInputMask} from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';

const defaultProps = {
  data: [],
  onSubmit: () => {},
  onClose: () => {},
  style: {},
};

const ModalNominalPicker = forwardRef((props, ref) => {
  const {data, onSubmit, onClose, style} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const [price, setPrice] = useState(null);
  const [listPrice, setListPrice] = useState(data);

  useEffect(() => {
    setListPrice(data);
  }, [data]);
  const amountPrice = useRef();

  const onDelete = (item) => {
    const temp = listPrice.filter(data => data !== item);
    setListPrice(temp);
  }

  const onAdd = () => {
    if(price){
      setListPrice([...listPrice, parseInt(amountPrice.current.getRawValue())]);
      setPrice(0);
    }
  }

  return (
    <Modalize
      scrollViewProps={{ 
        keyboardShouldPersistTaps: 'handled'
       }}
      ref={combinedRef}
      withHandle={false}
      adjustToContentHeight
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        paddingBottom: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingTop: 24,
        width: width,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}>
        <Text size={11} color={Color.text} type="bold" align="left">
          Tambah Nominal Kelipatan
        </Text>

        <Divider height={4} />

        <Text size={8} color={Color.secondary} align="left">
          Nominal kelipatan nantinya akan muncul sebagai ‘Akses Cepat’ untuk
          menaruh harga lelang
        </Text>

        <Divider height={8} />

        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: Color.border,
            borderRadius: 5,
            flexDirection: 'column',
            width: width - 32,
          }}>
          <Text size={8} align="left">
            Harga awal
          </Text>
          <Divider height={4} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInputMask
              ref={amountPrice}
              type={'money'}
              options={{
                precision: 0,
                separator: ',',
                delimiter: '.',
                unit: '',
                suffixUnit: '',
              }}
              value={price}
              onChangeText={value => setPrice(value)}
              placeholder={'0'}
              style={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                fontSize: 14,
                maxWidth: '90%',
              }}
            />
            <TouchableOpacity onPress={() => onAdd()}>
              <Text size={14} color={Color.primary}>
                Tambah
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {listPrice && (
          <View>
            <Divider height={24} />
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
              }}>
              {listPrice.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 120,
                    backgroundColor: '#3C58C1',
                    marginBottom: 10,
                    marginRight: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <Text size={14} color={Color.textInput}>
                    {item.toLocaleString().replace(/,/g, '.')} Poin
                  </Text>
                  <Divider width={10}/>
                  <TouchableOpacity onPress={() => onDelete(item)}>
                    <Ionicons name='close-outline' size={18} color={Color.textInput} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <Divider height={16} />

        <View style={{backgroundColor: Color.theme}}>
          <TouchableOpacity
            onPress={() => {onSubmit(listPrice)}}
            style={{
              backgroundColor: Color.primary,
              borderRadius: 30,
              paddingVertical: 12,
            }}>
            <Text type="semibold" color={Color.textInput}>
              Lanjut
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modalize>
  );
});

ModalNominalPicker.defaultProps = defaultProps;
export default ModalNominalPicker;
