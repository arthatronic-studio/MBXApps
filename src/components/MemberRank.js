import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ImagesPath from './ImagesPath';
import { Text, TouchableOpacity, useColor } from '@src/components';
import { Container, Divider, Row } from 'src/styled';
import { queryMemberRank } from 'src/lib/query/queryMemberRank';
import Client from 'src/lib/apollo';
import { initSocket } from 'src/api-socket/currentSocket';

const defaultProps = {
};

const MemberRank = ({ }) => {
  const user = useSelector(state => state['user.auth'].login.user);
  const { Color } = useColor();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [myRoomIds, setMyRoomIds] = useState([]);
  const [loadingMyRooms, setLoadingMyRooms] = useState(true);
  const [pemula, setPemula] = useState({});
  const [veteran, setVeteran] = useState({});

  const currentSocket = initSocket();

  useEffect(() => {
    fetchMemberRank();

    currentSocket.emit('list_my_room_ids');
    currentSocket.on('list_my_room_ids', (res) => {
      setMyRoomIds(res);
      setLoadingMyRooms(false);
    });
  }, []);

  const fetchMemberRank = () => {
    Client
      .query({
        query: queryMemberRank
      })
      .then(res => {
        if (res && res.data && res.data.getUserRangkingHome) {
          setPemula(res.data.getUserRangkingHome.pemula);
          setVeteran(res.data.getUserRangkingHome.veteran);
        }
      })
      .catch(err => {
        console.log('err member rank', err);
      });
  };

  const onPressMember = (item) => {
    const args = {
      my_room_ids: myRoomIds,
      user_id_target: item.userId
    };              
    currentSocket.emit('room_id_target', args);
    currentSocket.on('room_id_target', (res) => {
      console.log('res roomId', res);
      navigation.navigate('ChatDetailScreen', {
        roomId: res,
        roomName: item.fullname,
        isDirector: false, // TODO api (isDirector, firstName)
        selected: [{
          userId: item.userId,
          firstName: item.fullname,
          isDirector: 0,
        }],
        targetIds: [item.userId]
      });
    });
  };

  return (
    <Container
      paddingHorizontal={10}
      marginHorizontal={16}
      color={Color.theme}
      style={{ flex: 1 }}
    >
      <Row style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingRight: 4 }}>
          <Text size={10} align='left'>
            Sambut Member Baru
          </Text>
          <Divider height={4} />
          <TouchableOpacity
            onPress={() => onPressMember(pemula)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Image
              source={{ uri: pemula.photoProfile }}
              style={{ width: 32, aspectRatio: 1, resizeMode: 'cover', borderRadius: 16 }}
            />
            <Image
              source={ImagesPath.ranking}
              style={{
                width: 14,
                aspectRatio: 1,
                resizeMode: 'contain',
                position: 'absolute',
                top: 12,
                left: 20,
              }}
            />
            <Divider width={10} />
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <Text size={14} type="bold" numberOfLines={1}>
                {pemula.fullname}
              </Text>
              <Text size={10} color={Color.primarySoft}>
                {pemula.rank}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, paddingLeft: 4 }}>
          <Text size={10} align='left'>
            Member Terbaik Bulan Ini
          </Text>
          <Divider height={4} />
          <TouchableOpacity
            onPress={() => onPressMember(veteran)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Image
              source={{ uri: veteran.photoProfile }}
              style={{ width: 32, aspectRatio: 1, resizeMode: 'cover', borderRadius: 16 }}
            />
            <Image
              source={ImagesPath.ranking}
              style={{
                width: 14,
                aspectRatio: 1,
                resizeMode: 'contain',
                position: 'absolute',
                top: 12,
                left: 20,
              }}
            />
            <Divider width={10} />
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <Text size={14} type="bold" numberOfLines={1}>
                {veteran.fullname}
              </Text>
              <Text size={10} color={Color.primaryDark}>
                {veteran.rank}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Row>
    </Container>
  );
};

MemberRank.defaultProps = defaultProps;
export default MemberRank;
