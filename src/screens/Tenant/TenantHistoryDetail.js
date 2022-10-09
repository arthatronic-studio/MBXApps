import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  FlatList,
  ScrollView,
  Platform,
  Linking,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import {useSelector} from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity, Button} from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import {Container, Divider, Line, Padding} from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {getHistory} from 'src/lib/query/event';
import {FormatMoney} from 'src/utils';
import {postAPI} from 'src/api-rest/httpService';
import imageAssets from 'assets/images';

const TenantHistoryDetail = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const auth = useSelector(state => state['auth']);
  const {width} = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  console.log(item, "iteeem");

  return (
    <Scaffold
      style={{backgroundColor: '#F4F4F4'}}
      fallback={false}
      popupProps={popupProps}
      loadingProps={loadingProps}>
      <ScrollView>
        <Divider height={16} />
        <Container
          flex={1}
          flexDirection="row"
          paddingHorizontal={16}
          justify="space-between"
          align="center">
          <Container flex={1} flexDirection="column">
            <Text align="left" color={Color.primary} size={24} type="bold">
              Your Order
            </Text>
            <Text
              size={12}
              type="medium"
              lineHeight={14.4}
              color="#797979"
              align="left">
              {item.status_label}
            </Text>
          </Container>
          <Container flex={1}>
            <Text
              align="right"
              size={17}
              type="medium"
              lineHeight={24.4}
              color="#242424">
              {item.invoice_number}
            </Text>
          </Container>
        </Container>
        <Divider height={28} />
        <Line width={width - 32} height={1} color={Color.black} />
        <Divider height={16} />
        <Container
          paddingHorizontal={16}
          flex={1}
          flexDirection="row"
          justify="space-between"
          align="center">
          <Container flexDirection="row" align="center">
            <View style={{width: width * 0.12, height: width * 0.12}}>
              <Image
                source={{ uri: item?.cart?.location?.images[0] }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            </View>
            <Divider width={10} />
            <Text size={14} lineHeight={16.8} color={Color.black} type="medium">
              {item?.cart?.location?.name}
            </Text>
          </Container>
          {/* <Text size={10} type="medium" lineHeight={12} color="#ACAAA5">
            2d lalu
          </Text> */}
        </Container>
        <Divider height={16} />
        <Line width={width - 32} height={1} color={Color.black} />
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text
            align="left"
            size={9}
            lineHeight={10.8}
            type="bold"
            color={Color.primary}>
            ● Your Order
          </Text>
          <Divider height={16} />
          {item?.cart?.cart_detail && item.cart.cart_detail.map((data, index) => {
            return (
              <Container
                key={index}
                flex={1}
                flexDirection="row"
                justify="space-between"
                align="center">
                <Container flex={1} flexDirection="column">
                  <Text
                    align="left"
                    color={Color.primary}
                    size={18}
                    type="medium"
                    lineHeight={21.6}>
                    {data.product_name}
                  </Text>
                  <Text
                    size={14}
                    type="medium"
                    lineHeight={16.4}
                    color={Color.primary}
                    align="left">
                    {FormatMoney.getFormattedMoney(data.amount)}
                  </Text>
                </Container>
                <Container flex={1}>
                  <Text
                    align="right"
                    size={14}
                    type="medium"
                    lineHeight={16.8}
                    color="#242424">
                    x{data.quanit}
                  </Text>
                </Container>
              </Container>
            )
          })}
        </Container>
        <Divider height={16} />
        <Line width={width - 32} height={1} color={Color.black} />
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text
            align="left"
            size={9}
            lineHeight={10.8}
            type="bold"
            color={Color.primary}>
            ● Orderer Name
          </Text>
          <Divider height={16} />
          <Container flex={1} flexDirection="row" justify="space-between">
            <Container flex={1}>
              <Text
                align="left"
                size={18}
                type="medium"
                lineHeight={21.6}
                color="#242424">
                {item?.cart?.nama_pelanggan ? item?.cart?.nama_pelanggan : 'User'}
              </Text>
            </Container>
            <Container flex={1}>
              <Text
                align="right"
                size={14}
                type="medium"
                lineHeight={16.8}
                color="#242424">
                {item?.cart?.order_type_label}
              </Text>
            </Container>
          </Container>
        </Container>
        <Divider height={16} />
        <Line width={width - 32} height={1} color={Color.black} />
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text
            align="left"
            size={9}
            lineHeight={10.8}
            type="bold"
            color={Color.primary}>
            ● Pricing Detail
          </Text>
          <Divider height={16} />
          <Container flex={1} flexDirection="row" justify="space-between">
            <Container flex={1}>
              <Text
                align="left"
                size={14}
                type="medium"
                lineHeight={16.8}
                color="#3D3D3D">
                Total
              </Text>
            </Container>
            <Container flex={1}>
              <Text
                align="right"
                size={14}
                type="medium"
                lineHeight={16.8}
                color="#242424">
                {FormatMoney.getFormattedMoney(item.total_price)}
              </Text>
            </Container>
          </Container>
          {/* <Divider height={16} />
          <Container padding={10} backgroundColor="#E5E5E5">
            <Container flex={1} flexDirection="row" justify="space-between">
              <Container flex={1}>
                <Text
                  align="left"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#797979">
                  Subtotal
                </Text>
              </Container>
              <Container flex={1}>
                <Text
                  align="right"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#3D3D3D">
                  {FormatMoney.getFormattedMoney(item.total_price)}
                </Text>
              </Container>
            </Container>
            <Divider height={10}/>
            <Container flex={1} flexDirection="row" justify="space-between">
              <Container flex={1}>
                <Text
                  align="left"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#797979">
                  Tax 11%
                </Text>
              </Container>
              <Container flex={1}>
                <Text
                  align="right"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#3D3D3D">
                  {FormatMoney.getFormattedMoney(item.total_price)}
                </Text>
              </Container>
            </Container>
            <Divider height={10}/>
            <Container flex={1} flexDirection="row" justify="space-between">
              <Container flex={1}>
                <Text
                  align="left"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#797979">
                  Service Fee
                </Text>
              </Container>
              <Container flex={1}>
                <Text
                  align="right"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#3D3D3D">
                  {FormatMoney.getFormattedMoney(item.total_price)}
                </Text>
              </Container>
            </Container>
            <Divider height={10}/>
            <Container flex={1} flexDirection="row" justify="space-between">
              <Container flex={1}>
                <Text
                  align="left"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#242424">
                  Total
                </Text>
              </Container>
              <Container flex={1}>
                <Text
                  align="right"
                  size={12}
                  type="medium"
                  lineHeight={14.4}
                  color="#3D3D3D">
                  {FormatMoney.getFormattedMoney(item.total_price)}
                </Text>
              </Container>
            </Container>
          </Container> */}
        </Container>
      </ScrollView>
    </Scaffold>
  );
};

export default TenantHistoryDetail;
