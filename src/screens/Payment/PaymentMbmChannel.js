import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  Modal as ReactModal,
  SectionList,
  Alert as ReactAlert,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity, Button} from '@src/components/Button';
import {Container, Divider, Line, Padding} from 'src/styled';
import WebViewScreen from 'src/components/WebViewScreen';
import {fetchMbmChannel} from 'src/api-rest/fetchMbmChannel';
import {fetchMbmOrder} from 'src/api-rest/fetchMbmOrder';
import Clipboard from '@react-native-community/clipboard';

const PaymentMbmChannel = ({navigation, route}) => {
  const {params} = route;

  const {Color} = useColor();
  const auth = useSelector(state => state['auth']);
  const [loading, setLoading] = useState(true);
  const [listChannel, setListChannel] = useState([]);
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [sourceURL, setSourceURL] = useState('');
  const isFocused = useIsFocused();

  const onCloseWebview = status => {
    setSourceURL('');
    if (status === 'paymentPaid') navigation.navigate('PaymentSucceed');
    else navigation.navigate('EatScreen');
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const onSubmit = async item => {
    setLoading(true);
    const body = {
      cart_id: params.cartId,
      channel_code: item.channel_code,
      channel_category: item.channel_category,
    };
    console.log(body, 'body');
    const res = await fetchMbmOrder(body);
    setLoading(false);
    if (res.status) {
      console.log(res);
      if (res.data && res.data.account_number) {
        // Alert(
        //   `virtual account number: ${res.data.account_number}`,
        //   'Copy Code',
        //   () => {
        //     Clipboard.setString(item);
        //     showPopup('virtual account number copied', 'info');
        //     navigation.navigate('PaymentSucceed');
        //   })

        ReactAlert.alert(`virtual account number`, res.data.account_number, [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Copy Code',
            style: 'ok',
            onPress: () => {
              Clipboard.setString(res.data.account_number);
              showPopup('virtual account number copied', 'info');
              navigation.navigate('PaymentSucceed');
            },
          },
        ]);
      } else {
        navigation.navigate('PaymentSucceed');
      }
    } else {
      showLoading('error', result.message);
    }
  };

  console.log(sourceURL, 'haha');

  const fetchData = async () => {
    const result = await fetchMbmChannel();
    if (result.status) {
      const newData = Object.entries(result.data).map(e => ({
        name: e[0],
        data: e[1],
      }));
      setListChannel(newData);
    }
    setLoading(false);
  };

  return (
    <Scaffold
      fallback={loading}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={<Header title="Payment Channel" centerTitle={false} />}>
      <SectionList
        sections={listChannel}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({section: {name, imageIcon}}) => {
          console.log(name, imageIcon, 'hahahaha section');
          return (
            <Container paddingHorizontal={16} marginVertical={8}>
              <Text size={16} type="bold" align="left">
                {name}
              </Text>
            </Container>
          );
        }}
        ItemSeparatorComponent={() => <Divider height={8} />}
        renderItem={({item, index, section}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSubmit(item);
              }}
              style={{
                paddingHorizontal: 16,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Image source={item.image} />
              <Text type="semibold">{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <ReactModal
        transparent
        animationType="fade"
        onRequestClose={onCloseWebview}
        visible={sourceURL !== ''}>
        <WebViewScreen url={sourceURL} onClose={onCloseWebview} />
      </ReactModal>
    </Scaffold>
  );
};

export default PaymentMbmChannel;
