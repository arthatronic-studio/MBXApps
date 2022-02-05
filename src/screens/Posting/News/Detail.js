import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, ImageBackground} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {useLoading, usePopup, useColor} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';

import {Divider} from '@src/styled';
import {shadowStyle} from '@src/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {iconWarning, iconHeart, iconShare, iconBookmarks} from '@assets/images/home';
import { useSelector } from 'react-redux';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import moment from 'moment';

const Example = Styled(View)`
`;

export default ({navigation, route}) => {
  const {item} = route.params;

  const user = useSelector(state => state['user.auth'].login.user);

  const [state, changeState] = useState({
    im_like: item.im_like,
  });

  const setState = (obj) => changeState({ ...state, ...obj });

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const {Color} = useColor();

  // useEffect(() => {
    //     const timeout = trigger ? setTimeout(() => {
    //         fetchAddLike();
    //     }, 500) : null;

    //     return () => {
    //         clearTimeout(timeout);
    //     }
    // }, [trigger]);

    const fetchAddLike = () => {
      showLoading();

      Client.query({
        query: queryAddLike,
        variables: {
          productId: item.id
        }
      })
      .then((res) => {
        console.log(res, 'res add like');
        if (res.data.contentAddLike.id) {
          if (res.data.contentAddLike.status === 1) {
              showLoading('success', 'Berhasil disukai');
              setState({ im_like: true });
          } else {
              showLoading('info', 'Batal disukai');
              setState({ im_like: false });
          }
        }
      })
      .catch((err) => {
          console.log(err, 'err add like');
          hideLoading();
      })
  }

  console.log('user', item);

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      // iconRightButton={
      //     <Image source={iconBookmarks} height={70} width={70}/>
      // }
      loadingProps={loadingProps}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={{padding: 16}}>
                    <Text size={24} type='bold' align='left' lineHeight={32}>
                        {item.productName}
                    </Text>
                </View> */}
        {/* <View style={{paddingHorizontal: 16}}>
                    <View style={{paddingVertical: 4, width: 100, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                        <Text size={10} color={Color.primary}>
                            {item.productCategory}
                        </Text>
                    </View>
                </View> */}

        {/* <Divider /> */}

        <View
          style={{
            width: '100%',
            aspectRatio: 16/9,
          }}
        >
          <Image
            source={{uri: item.image}}
            style={{
              width: '100%',
              height: '100%',
              // position: 'absolute',
            }} />
            
          {/* <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: Color.reverseOverflow,
              position: 'absolute',
            }} /> */}

          {/* <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}>
              <Text
                style={{fontWeight: 'bold', color: Color.text}}
                align="left"
                size={19}>
                {item.productName}
              </Text>
              <Text style={{color: Color.text}} align="left" size={11}>
                Ditulis oleh {item.fullname}
              </Text>
            </View>
          </View> */}

          <View style={{padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.theme}}>
            {user && user.userId === item.ownerId && <View
              style={{height: 48, width: 48, borderRadius: 24, position: 'absolute', top: -24, right: 16, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center'}}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditThreadScreen', {
                    ...item,
                    title: 'Edit',
                  });
                }}
              >
                <Ionicons
                  name='pencil'
                  size={20}
                  color={Color.textInput}
                />
              </TouchableOpacity>
            </View>}
          </View>
        </View>

        <View
            style={{
              width: '100%',
              // height: '100%',
              marginTop: 16,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}>
              <Text
                type='bold'
                align="left"
                size={19}>
                {item.productName}
              </Text>
              <Divider height={4} />
              <Text align="left" size={11}>
                {moment(parseInt(item.created_date)).format('DD MMM YYYY')}
              </Text>
              <Text align="left" size={11}>
                Ditulis oleh {item.fullname}
              </Text>
            </View>
          </View>

        <View style={{padding: 16}}>
          <Text lineHeight={24} align="left">
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.productDescription}
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
                onPress={() => {
                    fetchAddLike();
                }}
                style={{height: 70, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
            >
                <Ionicons name='heart-outline' color={state.im_like ? Color.primary : Color.text} size={30} />
                {item.like > 0 && <Text color={state.im_like ? Color.primary : Color.text}>{item.like} </Text>}
            </TouchableOpacity>
            <Text
                size={12}
                color={state.im_like ? Color.primary : Color.text}
            >
                {state.im_like ? 'Disukai' : 'Suka'}
            </Text>
        </View>

        <View style={{alignItems: 'center'}}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('CommentListScreen', { item });
                }}
                style={{height: 70, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
            >
                <Ionicons name='chatbubble-ellipses-outline' color={Color.text} size={30} />
                {item.comment > 0 && <Text>{item.comment} </Text>}
            </TouchableOpacity>
            <Text size={12}>Komentar</Text>
        </View>

          {/* <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: 70,
                width: 70,
                borderRadius: 35,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={iconShare} />
            </TouchableOpacity>
            <Text size={12}>Share</Text>
          </View> */}

          {/* <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                height: 70,
                width: 70,
                borderRadius: 35,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={iconWarning} />
            </TouchableOpacity>
            <Text size={12}>Lapor</Text>
          </View> */}
        </View>
        <Divider />
      </ScrollView>
    </Scaffold>
  );
};
