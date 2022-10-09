import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity, Button } from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { getHistory } from 'src/lib/query/event';
import { FormatMoney } from 'src/utils';
import { postAPI } from 'src/api-rest/httpService';

const TenantHistoryDetail = ({ navigation, route }) => {
  const { item } = route.params;
  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const auth = useSelector(state => state['auth']);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  return (
    <Scaffold
      style={{ backgroundColor: '#F4F4F4' }}
      fallback={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
    >
      <ScrollView>
        <Container
          flex={1}
          flexDirection="row"
          paddingHorizontal={16}
          justify="space-between"
        >
          <Container
            flex={1}
            flexDirection="column"
          >
            <Text align="left" color={Color.primary} size={24} type="bold">
              Your Order
            </Text>
            <Text size={12} type="medium" lineHeight={14.4} color="#797979" align="left">
              PREPAIRING
            </Text>
          </Container>

        </Container>

      </ScrollView>
    </Scaffold>
  )
}

export default TenantHistoryDetail;