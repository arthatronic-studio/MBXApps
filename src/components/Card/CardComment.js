import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';

import Text from '@src/components/Text';
import { useColor } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Loading, { useLoading } from  '@src/components/Modal/Loading';

import Client from '@src/lib/apollo';
import { queryAddComment } from '@src/lib/query';
import { shadowStyle } from '@src/styles';
import { isIphoneNotch } from 'src/utils/constants';
import { Container, Divider, Row } from 'src/styled';
import { useSelector } from 'react-redux';

const defaultProps = {
  canReply: false,
  showOptions: false,
  onPressDots: () => {},
  onPressReply: () => {},
};

const CardComment = ({ item, productOwnerId, canReply, showOptions, onPressDots, onPressReply, }) => {
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);

  // const canManagementProduct = user && !user.guest && user.userId === productOwnerId;
  const isCommentFromOwnerProduct = item.userId === productOwnerId;
  const isAdmin = item.isDirector;
  const isPinned = item.isPinned;

  const [itemOwnerReply, setItemOwnerReply] = useState();

  useEffect(() => {
    if (Array.isArray(item.replies) && item.replies.length > 0) {
      for (let index = 0; index < item.replies.length; index++) {
        const e = item.replies[index];
        if (e.userId === productOwnerId) {
          setItemOwnerReply(e);
          break;
        }
      }
    } else {
      setItemOwnerReply();
    }
  }, [item]);

  return (
    <View style={{width: '100%', flexDirection: 'row', marginBottom: 8, paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 0.5, borderColor: Color.border}}>
      <View style={{width: '10%', aspectRatio: 1}}>
        <Image source={{ uri: item.image }} style={{width: '100%', height: '100%', borderRadius: 50, backgroundColor: Color.border}} />
      </View>

      <View style={{width: '85%', paddingHorizontal: 8}}>
        {isPinned && <Container marginBottom={6}>
          <Row>
            <MaterialCommunityIcons name='pin' color={Color.gray} size={12} />
            <Text align='left' size={10} color={Color.gray}>Komentar disematkan</Text>
          </Row>
        </Container>}

        <View style={{marginBottom: 4, flexDirection: 'row', alignItems: 'center'}}>
          <View style={isCommentFromOwnerProduct && { backgroundColor: Color.border, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8 }}>
            <Text
              size={12}
              align='left'
              color={Color.placeholder}
              numberOfLines={1}
            >
              {typeof item.fullname === 'string' ? item.fullname.slice(0, 20).trim() : ''}
              {isAdmin && <MaterialIcons name='verified' color={Color.info} size={14} />}
            </Text>
          </View>

          <Text
            size={12}
            align='left'
            color={Color.placeholder}
            numberOfLines={1}
          >
            {` • `}{Moment(parseInt(item.commentDate)).fromNow()}
          </Text>
        </View>
        
        <Text size={12} align='left'>{item.comment}</Text>

        {canReply && <Container paddingTop={8}>
          <Row>
            <TouchableOpacity
              onPress={() => {
                onPressReply();
              }}
            >
              <Text size={12} align='left'>Balas</Text>
            </TouchableOpacity>

            <Divider />

            {Array.isArray(item.replies) && item.replies.length > 0 && <TouchableOpacity
              onPress={() => {
                onPressReply();
              }}
            >
              <Text size={12} align='left' color={Color.info} type='medium'>{item.replies.length} Balasan</Text>
            </TouchableOpacity>}

            <Divider width={8} />

            {itemOwnerReply && <Image source={{ uri: itemOwnerReply.image }} style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: Color.primary }} />}
          </Row>
        </Container>}
      </View>
      
      <View style={{width: '5%', aspectRatio: 1}}>
        {showOptions && <TouchableOpacity
          onPress={() => onPressDots()}
          style={{width: '100%', height: '100%', alignItems: 'flex-end'}}
        >
            <Entypo name='dots-three-vertical' color={Color.text} size={16} />
        </TouchableOpacity>}
      </View>
    </View>
  )
}

CardComment.defaultProps = defaultProps;
export default CardComment;