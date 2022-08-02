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
import Loading, { useLoading } from '@src/components/Modal/Loading';

import Client from '@src/lib/apollo';
import { queryAddComment, queryProductReport, queryReportAbuse, queryReportComment } from '@src/lib/query';
import { shadowStyle } from '@src/styles';
import { isIphoneNotch } from 'src/utils/constants';
import ImagesPath from 'src/components/ImagesPath';
import Modal from 'react-native-modal';
import { Container, Divider, Row } from 'src/styled';
import { useSelector } from 'react-redux';
import { imageContentItem } from 'assets/images/content-item';
import { useNavigation } from '@react-navigation/native';
import CardKutipan from 'src/screens/MainForum/NewForum/CardKutipan';

const defaultProps = {
  canReply: false,
  showOptions: false,
  onPressDots: () => { },
  onPressReply: () => { },
  onRefresh: () => { },
  onPressLike: () => {},
};

const CardComment = ({ item, productOwnerId, canReply, showOptions, onPressDots, onPressReply, onRefresh, onPressLike }) => {
  const { Color } = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSuccess, setModalSuccess] = useState(false);
  // const canManagementProduct = user && !user.guest && user.userId === productOwnerId;
  const isCommentFromOwnerProduct = item.userId === productOwnerId;
  const isAdmin = item.isDirector;
  const isPinned = item.isPinned;

  const [itemOwnerReply, setItemOwnerReply] = useState();

  const onPressReport = () => {
    const variables = {
      referenceId: item.id,
      referenceType: 'PRODUCT_COMMENT',
      referenceName: item.comment,
      refStatus: '1',
      reportMessage: 'Not Set',
    };

    console.log('variables', variables);

    Client.mutate({
      mutation: queryReportAbuse, 
      variables,
    })
      .then(res => {
        console.log('res', res);
        if (res.data.reportAbuseManage) {
          setModalSuccess(true);
          setTimeout(() => {
            setModalSuccess(false);
          }, 3000);
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

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
    <View style={{ width: '100%', paddingVertical: 8, paddingHorizontal: 16 }}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: '10%', aspectRatio: 1 }}>
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 50, backgroundColor: Color.border }} />
        </View>

        <View style={{ width: '85%', paddingHorizontal: 8, justifyContent: 'center' }}>
          {isPinned && <Container marginBottom={6}>
            <Row>
              <MaterialCommunityIcons name='pin' color={Color.gray} size={12} />
              <Text align='left' size={10} color={Color.gray}>Komentar disematkan</Text>
            </Row>
          </Container>}

          <View style={{ marginBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                isCommentFromOwnerProduct && { backgroundColor: Color.border, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8 },
                { flexDirection: 'row' }
              ]}
            >
              <Text
                size={12}
                align='left'
                color={Color.text}
                numberOfLines={1}
              >
                {typeof item.fullname === 'string' ? item.fullname.slice(0, 20).trim() : ''}{' '}
              </Text>
              {isAdmin && <MaterialIcons name='verified' color={Color.info} size={14} />}
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
        </View>

        <View style={{ width: '5%', aspectRatio: 1, justifyContent: 'center' }}>
          {showOptions && <TouchableOpacity
            onPress={() => onPressDots()}
            style={{ width: '100%', height: '100%', alignItems: 'flex-end' }}
          >
            <Entypo name='dots-three-vertical' color={Color.text} size={16} />
          </TouchableOpacity>}
        </View>
      </View>

      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: '10%' }}>

        </View>

        <View style={{ width: '90%', paddingLeft: 8 }}>
          {item.imageVideo &&
            <View style={{ width: width / 3, aspectRatio: 1 }}>
              <Image
                source={{ uri: item.imageVideo }}
                style={{ width: '100%', height: '100%', backgroundColor: Color.border }}
              />
            </View>
          }

          <View
            style={{
              backgroundColor: item.commentQuote ? Color.border : Color.theme,
              padding: item.commentQuote ? 8 : 0,
              borderRadius: 8,
            }}
          >
            {item.commentQuote &&
              <CardKutipan
                tagged
                item={item.commentQuote}
              />
            }

            {item.comment !== '' &&
              <Container paddingTop={4}>
                <Text size={12} align='left'>{item.comment}</Text>
              </Container>
            }
          </View>

          {canReply ?
            <Container paddingTop={8}>
              <Row>
                <TouchableOpacity
                  onPress={() => {
                    onPressLike();
                  }}
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <Text size={12} align="left">
                    {item.likeCount}{' '}
                  </Text>

                  <Image
                    source={item.im_like ? imageContentItem.heart_active : imageContentItem.heart_nonactive}
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ForumKutipan', {
                      item,
                      onRefresh: () => onRefresh(),
                    });
                  }}
                >
                  <Image
                    source={imageContentItem.quotes}
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity
                  onPress={() => {
                    onPressReply();
                  }}
                >
                  <Text size={12} align='left'>Balas</Text>
                </TouchableOpacity>

                <Divider />
                {item.userId !== user.userId &&
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(!isModalVisible);
                      }}
                    >
                      <Text size={12} align='left'>Laporkan</Text>
                    </TouchableOpacity>

                    <Divider />
                  </>
                }

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
            </Container>
          : item.userId !== user.userId ?
            <Container paddingTop={8}>
              <Row>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!isModalVisible);
                  }}
                >
                  <Text size={12} align='left'>Laporkan</Text>
                </TouchableOpacity>
              </Row>
            </Container>
          :
            <View />
          }
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: Color.textInput,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons name='alert-circle-outline' color={Color.danger} size={54} />
          <Divider height={12} />
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
            Laporkan comment?
          </Text>
          <Divider height={8} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '80%' }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible);
              }}
              style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: Color.disabled, borderRadius: 120 }}>
              <Text>
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible);
                onPressReport();
              }}
              style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: Color.primary, borderRadius: 120 }}>
              <Text>
                Laporkan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isModalSuccess}>
        <View
          style={{
            backgroundColor: Color.textInput,
            borderRadius: 20,
            paddingTop: 33,
            paddingHorizontal: 24,
            paddingBottom: 24,
            alignItems: 'center',
          }}>
          <Image source={ImagesPath.checkCircle} size={54} />
          <Divider height={25} />
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
            Comment berhasil dilaporkan
          </Text>
        </View>
      </Modal>
    </View>
  )
}

CardComment.defaultProps = defaultProps;
export default CardComment;