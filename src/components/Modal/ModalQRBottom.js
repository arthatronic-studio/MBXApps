import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Linking,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import messaging from '@react-native-firebase/messaging';
import Modal from 'react-native-modal';

import {
  Alert,
  Text,
  Row,
  Col,
  HeaderBig,
  useColor,
  Scaffold,
  useLoading,
  Button,
  Header,
} from '@src/components';
import { redirectTo } from '@src/utils';
import { shadowStyle } from '@src/styles';
import imageAssets, { iconSplash, imageCardOrnament } from '@assets/images';
import { Box, Circle, Container, Divider, Line } from 'src/styled';
import Clipboard from '@react-native-community/clipboard';
import ModalinputCode from 'src/components/ModalInputCode';
import ModalCardMember from 'src/components/ModalCardMember';
import Client from '@src/lib/apollo';
import { queryOrganizationMemberManage } from '@src/lib/query/organization';
import { accessClient } from 'src/utils/access_client';
import { fetchCommunityMemberCheck } from 'src/api/community';
import ModalActions from 'src/components/Modal/ModalActions';
import Axios from 'axios';
import { initSocket } from 'src/api-socket/currentSocket';
import { assetImageProfile } from 'assets/images/profile';
import { statusBarHeight } from 'src/utils/constants';

const ModalQRBottom = ({ visible, value, labelTitle, labelCaption, labelDetail, onClose, }) => {
  const [modalVirtual, setModalVirtual] = useState(true);
  const [modalInputCode, setModalInputCode] = useState(false);
  const [modalCardMember, setModalCardMember] = useState(false);
  const [modalJoinCommunity, setModalJoinCommunity] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [responseMemberManage, setResponseMemberManage] = useState({
    data: null,
    success: false,
    message: '',
  });
  const [memberCheck, setMemberCheck] = useState({
    status: true,
    message: '',
  })
  const [myRoomIds, setMyRoomIds] = useState([]);

  const dispatch = useDispatch();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const auth = useSelector(state => state['auth']);
  const localStoragSetting = useSelector(state => state['setting']);

  const showDebug = localStoragSetting && localStoragSetting.showDebug ? true : false;

  const { Color } = useColor();
  const { width } = useWindowDimensions();

  useEffect(() => {

  }, []);

  console.log('auth', auth);

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      swipeDirection={['down']}
      onBackdropPress={() => { onClose(); }}
      onSwipeComplete={() => { onClose(); }}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      style={{
        justifyContent: 'flex-end', // the keys of bottom half
        margin: 0,
      }}
    >
      <View
        style={{
          backgroundColor: Color.theme,
          paddingHorizontal: 16,
          paddingBottom: statusBarHeight,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {/* handle */}
        {/* <View>
          <Line color={Color.primary} height={4} width={width / 6} radius={2} />
        </View> */}

        <View>
          <Container paddingTop={16} paddingBottom={24}>
            <Text align='left' size={24}>{labelTitle}</Text>
          </Container>

          <View
            style={{
              width: (width / 1.6) + 32,
              aspectRatio: 1,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              borderWidth: 2,
            }}
          >
            <QRCode
              value={value}
              size={width / 1.6}
            />
          </View>

          <Container paddingVertical={24}>
            <Text letterSpacing={0.15} size={16} type='medium'>{labelCaption}</Text>
            <Divider height={4} />
            <Text letterSpacing={0.25} color={Color.textSoft}>{labelDetail}</Text>
          </Container>

          <Button
            outline
            color={Color.text}
            onPress={() => {
              onClose();
            }}
          >
            Tutup
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ModalQRBottom;