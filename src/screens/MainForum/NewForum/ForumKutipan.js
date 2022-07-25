import React, { useEffect, useState, useRef } from 'react';
import { View, Image, TextInput, FlatList, useWindowDimensions, Animated, Keyboard } from 'react-native';
import Styled from 'styled-components';
import { Col, Row, Scaffold, Text, Header } from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import { queryContentProduct } from '@src/lib/query';
import { useColor } from '@src/components/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import CardForumPopular from '../CardForumPopular';
import { Container, Divider, MainView } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import ImagesPath from 'src/components/ImagesPath';
import Config from 'react-native-config';
import client from 'src/lib/apollo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import ListForumVertical from '../ListForumVertical';
import { ModalListText } from 'src/components';
import { initialItemState } from 'src/utils/constants';
import {

  iconsmile,
  icongif,
  icongalery,
  icontext,
  iconcameravidio,
  iconListNumbers,
  iconTextAlignCenter,
  iconTextAlignJustify,
  iconTextBolder,
  iconTextItalic,
  iconTextStrikethrough,
  iconTextUnderline,

} from '@assets/images/home';
const DATA = [
  {
    id: 1,
    title: 'Gaming',
  },
  {
    id: 2,
    title: 'Coding',
  },

];

const DATA_POPULER = [
  {
    id: 1,
    title: 'Sabyan',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 2,
    title: 'Tribesocial',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
];

const ForumKutipan = ({ navigation, route }) => {
  const { Color } = useColor();
  const { height } = useWindowDimensions();
  const [textComment, setTextComment] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [itemData, setItemData] = useState(initialItemState);
  const [showfeature, setShowFeature] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const modalListTextckRef = useRef();

  useEffect(() => {
    const timeout = textSearch !== '' ?
      setTimeout(() => {
        fetchContentProduct();
      }, 500) : null;

    return () => clearTimeout(timeout);
  }, [textSearch]);

  const fetchContentProduct = () => {
    const variables = {
      productType: Config.PRODUCT_TYPE,
      productCategory: 'FORUM',
      productName: textSearch,
      page: 0,
      itemPerPage: 6,
    };

    client.query({
      query: queryContentProduct,
      variables,
    })
      .then((res) => {
        console.log('res search', res);

        let newList = [];

        if (res.data.contentProduct) {
          newList = res.data.contentProduct;
        }

        setItemData({
          ...itemData,
          data: newList,
          loading: false,
        });
      })
      .catch((err) => {
        console.log('err search', err);

        setItemData({
          ...itemData,
          // data: [],
          loading: false,
        });
      });
  }
  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          { position: 'absolute', bottom: 350, height: 36, width: '100%', justifyContent: 'space-evenly', paddingHorizontal: 16 },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


          <TouchableOpacity>
            <Image
              style={{ height: 30, width: 30, marginTop: 9 }}
              source={icongalery} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              style={{ height: 45, width: 35 }}
              source={iconcameravidio} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={{ height: 45, width: 25 }}
              source={iconsmile} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {

          }} >
            <Image
              style={{ height: 45, width: 25 }}
              source={icongif} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {

            Keyboard.dismiss();
            modalListTextckRef.current.open();

          }} >
            <Image
              style={{ height: 45, width: 25 }}
              source={icontext} />
          </TouchableOpacity>

        </View>
      </Animated.View>
    )
  }

  return (
    <Scaffold
      header={
        <Header
          title='Buat Kutipan'
          centerTitle={false}
          actions={
            <TouchableOpacity
              style={{ backgroundColor: '#F3771D', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 10, marginTop: 10 }}
              onPress={() => {

              }}
            >
              <Text style={{ color: Color.textInput, }}>Posting</Text>
            </TouchableOpacity>
          }
        />
      }
    >
      <Divider />

      <View style={{ width: '100%', borderRadius: 4, borderColor: Color.border, borderWidth: 0, justifyContent: 'center' }}>
        <TextInput
          placeholder='Tulis pendapatmu...'
          placeholderTextColor={Color.border}
          autoFocus={true}
          style={{ fontWeight: '500', fontSize: 12, fontFamily: 'Inter-Regular', color: Color.text, marginTop: 8, marginBottom: 50, paddingLeft: 16, paddingRight: 40 }}
          value={textComment}
          multiline
          onChangeText={(e) => setTextComment(e)}
        />
      </View>


      <View style={{ borderRadius: 10, borderColor: Color.black, borderWidth: 1, justifyContent: 'center', marginHorizontal: 20, }}>
        <View style={
          { width: '100%', flexDirection: 'row', marginBottom: 2, paddingVertical: 0, paddingRight: 16 }}>
          <View style={{ width: '23%', alignItems: 'center', paddingTop: 4, paddingRight: 8, paddingLeft: 16 }}>
            <Image source={{ uri: '' }} style={{ width: '100%', aspectRatio: 1, borderRadius: 50, backgroundColor: Color.primary }} />
          </View>
          <View style={{ width: '84%' }}>
            <View style={{ flexDirection: 'row', padding: 8, borderRadius: 8 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={ImagesPath.ranking}
                    style={{
                      width: 14,
                      height: 14,

                    }}
                  />
                  <Text size={12} align='left' style={{ opacity: 0.75, marginRight: 5, fontWeight: 'bold' }}>Abdul Jaelani</Text>

                  <Text size={12} align='left' style={{ opacity: 0.75, fontWeight: 'bold' }}> Kamis, 14:10 wib</Text>
                </View>

                <Divider height={8} />
                <Text size={12} align='left' type='medium'>hallo </Text>
              </View>

            </View>


          </View>
        </View>

      </View>

      {/* {showfeature ? (
        renderPopUpNavigation()
      ) : (
        <Text></Text>
      )} */}

      <ModalListText
        onClose={() => setShowSection(!showSection)}
        ref={modalListTextckRef}
        data={[
          // hide options chat
          {
            id: 0,
            name: 'Hurub Tebal',
            color: Color.text,
            image: iconTextBolder,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },
          {
            id: 1,
            name: 'Italic',
            image: iconTextItalic,
            color: Color.text,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },
          {
            id: 2,
            name: 'Underline',
            color: Color.text,
            image: iconTextUnderline,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },
          {
            id: 3,
            name: 'Strikethrough',
            color: Color.text,
            image: iconTextStrikethrough,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },
          {
            id: 4,
            name: 'Justify',
            color: Color.text,
            image: iconTextAlignJustify,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },
          {
            id: 5,
            name: 'Center',
            color: Color.text,
            image: iconTextAlignCenter,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },
          {
            id: 6,
            name: 'List',
            color: Color.text,
            image: iconListNumbers,
            onPress: () => {
              navigation.navigate('ForumGroupScreen')
              showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              setShowSection(!showSection);

            },
          },

        ]}
      />
    </Scaffold>
  );
};

export default ForumKutipan;
