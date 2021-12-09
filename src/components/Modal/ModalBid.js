import React, { useRef, forwardRef, useState } from 'react';
import { Dimensions, TouchableOpacity, useWindowDimensions, View, TextInput, FlatList } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Popup, usePopup,
  Loading, useLoading,
  Text, 
  useColor
} from '@src/components';
import { useCombinedRefs } from 'src/hooks';
import { FormatMoney } from 'src/utils';
import { TextInputMask } from 'react-native-masked-text';
import {useSelector} from 'react-redux';

const { width } = Dimensions.get('window');

const defaultProps = {
  onPress: () => {},
};

const CustomTextInput = Styled(TextInput)`
  width: 95%;
  height: 100%;
  fontFamily: OpenSans-Regular;
  backgroundColor: transparent;
  fontSize: 18px;
`;

const InputNumberView = Styled(TextInputMask)`
  width: 95%;
  height: 100%;
  fontFamily: OpenSans-Regular;
  alignContent: flex-start;
  fontSize: 18px;
`;

const EmailRoundedView = Styled(View)`
  width: ${width - 32};
  height: 50px;
  alignItems: center;
  justifyContent: center;
  flexDirection: column;
  borderRadius: 4px;
  marginBottom: 10;
`;

const SubmitButton = Styled(TouchableOpacity)`
  width: 100%;
  height: 45px;
  marginTop: 26px;
  borderRadius: 6px;
  justifyContent: center;
`;

const amountData = [
  { id: 1, bid: 5000},
  { id: 2, bid: 10000},
  { id: 3, bid: 25000},
  { id: 4, bid: 50000},
  { id: 5, bid: 100000},
  { id: 6, bid: 200000},
]

const ModalBid = forwardRef((props, ref) => {
  const { onPress, data } = props;
  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [handle, setHandle] = useState(false);
  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();
  const { width } = useWindowDimensions();
  const handlePosition = position => {
    setHandle(position === 'top');
  };
  const amountBid = useRef();

  // selector
  const user = useSelector((state) => state['user.auth'].login.user);

  // state
  const [text, setText] = useState('');
  const [selectedAmount, setSelectedAmount] = useState();

  const submit = () => {
    if (text !== '') {
      if(amountBid.current.getRawValue() < 5000) {
        showPopup('Minimal bid adalah Rp 5.000', 'warning');
      }else{
        data.push({ name: user.firstName, bid:amountBid.current.getRawValue() });
        combinedRef.current.close();
      } 
    } else {
      showPopup('Silakan masukan nominal bid terlebih dulu', 'warning');
    }
    setText('');
    setSelectedAmount();
  }

  const renderContent = () => {
    return (
        <FlatList
          key='listBidValue'
          keyExtractor={(item, index) => item.toString() + index}
          data={amountData}
          numColumns={3}
          keyboardShouldPersistTaps='handled'
          columnWrapperStyle={{justifyContent: 'space-between'}}
          ItemSeparatorComponent={
            () => <View style={{ height: 10, backgroundColor: Color.theme }}/>
          }
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{justifyContent: 'space-between', borderWidth: 1}}
          renderItem={({ item, index }) => {
            const isSelected = selectedAmount && selectedAmount.id === item.id;
            return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setText(item.bid.toString());
                    setSelectedAmount(item);
                  }}
                  style={[
                    { 
                      borderRadius: 8,
                      paddingVertical: 12, 
                      flexDirection: 'row',
                      justifyContent: 'center', 
                      borderWidth: 1, 
                      width: '32%',
                      height: 46,
                      borderColor: Color.primary,
                    },
                    isSelected && {borderWidth: 2}
                  ]}
                >
                  <Text size={18} lineHeight={20} color={isSelected ? Color.primary : Color.text}>{FormatMoney.getFormattedMoney(item.bid)}</Text>
                </TouchableOpacity>
            )
          }}
        />
    )
  }

  return (
    <Modalize
      ref={combinedRef}
      withHandle={false}
      handlePosition="inside"
      adjustToContentHeight
      handleStyle={{width: width / 4, height: handle ? 4 : 4, backgroundColor: Color.primary, marginTop: 8}}
      onPositionChange={handlePosition}
      childrenStyle={{ 
        width: width,
        alignItems: 'center',
        marginTop: 10,
        padding: 8,
        paddingBottom: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
      modalStyle={{ 
        backgroundColor: Color.theme,
        width: width,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems:'center'}}>
        <Text size={15} lineHeight={17} color={Color.text} style={{ fontWeight: 'bold' }}>Pasang Tawaran</Text>
        <TouchableOpacity style={{ marginRight: 7 }} onPress={() => {combinedRef.current.close();}}>
          <Ionicons name='chevron-down-outline' color={Color.text} size={24}/>
        </TouchableOpacity>
      </View>
      <EmailRoundedView style={{ borderWidth: 1, borderColor: Color.primary, alignSelf: 'center'}}>
        <InputNumberView
          ref={amountBid}
          name="text"
          returnKeyType="done"
          returnKeyLabel="Done"
          type='money'
          blurOnSubmit={false}
          error={null}
          placeholderTextColor={Color.text}
          placeholder='Masukan tawaran'
          onChangeText={(val) => {
            setText(val);
            setSelectedAmount();
          }}
          value={text}
          options={{ 
            precision: 0,
            separator: ',',
            delimeter: '.',
            unit: '',
            suffixUnit: ''
           }}
           onSubmitEditing={() => submit()}
           style={{color: Color.text}}
        />
      </EmailRoundedView>
      {renderContent()}
      <SubmitButton 
        onPress={() => submit()}
        style={{ backgroundColor: Color.primary }}
      >
        <Text color={Color.textInput} size={18} lineHeight={20}>Pasang Tawaran</Text>
      </SubmitButton>

      <Loading {...loadingProps} />

      <Popup {...popupProps} />
    </Modalize>
  );
});

ModalBid.defaultProps = defaultProps;

export default ModalBid;