import React, { useEffect, useState, useRef } from 'react';
import { View, Image, TextInput, useWindowDimensions, Animated, Keyboard } from 'react-native';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Col, Row, Scaffold, Text, Header, usePopup } from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import { queryAddComment, queryContentProduct } from '@src/lib/query';
import { useColor } from '@src/components/Color';
import { Container, Divider, MainView } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import ImagesPath from 'src/components/ImagesPath';
import Config from 'react-native-config';
import client from 'src/lib/apollo';

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
import CardKutipan from './CardKutipan';

const ForumKutipan = ({ navigation, route }) => {
  const { params } = route;

  const { Color } = useColor();
  const { height } = useWindowDimensions();
  const [popupProps, showPopup] = usePopup();

  const [textComment, setTextComment] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [itemData, setItemData] = useState(initialItemState);
  const [showfeature, setShowFeature] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const modalListTextckRef = useRef();

  const onSubmitComment = () => {
    if (textComment === '') {
      showPopup('Isi komentar tidak boleh kosong', 'warning');
      return;
    }

    const variables = {
      productId: params.item.productId,
      comment: textComment,
      // image: thumbImage,
      commentQuoteId: params.item.id,
    };

    console.log(variables, 'variables');

    client.query({
      query: queryAddComment,
      variables,
    })
      .then((res) => {
        console.log(res, 'res add comm');

        if (res.data.contentAddComment.id) {
          if (typeof params.onRefresh === 'function') {
            params.onRefresh();
          }
          navigation.pop();
        } else {
          showLoading('error', 'Gagal mengirimkan komentar');
        }
      })
      .catch((err) => {
        console.log(err, 'err add comm');
        showLoading('error', 'Gagal mengirimkan komentar');
      })
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
          <TouchableOpacity onPress={() => {}}>
            <Image
              style={{ height: 45, width: 25 }}
              source={icongif} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            Keyboard.dismiss();
            modalListTextckRef.current.open();
          }}>
            <Image
              style={{ height: 45, width: 25 }}
              source={icontext} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  console.log(params, 'paramms');

  return (
    <Scaffold
      popupProps={popupProps}
      header={
        <Header
          title='Buat Kutipan'
          centerTitle={false}
          actions={
            <TouchableOpacity
              style={{ backgroundColor: Color.primary, borderRadius: 20, padding: 12 }}
              onPress={() => {
                onSubmitComment();
              }}
            >
              <Text size={12} color={Color.textButtonInline}>Posting</Text>
            </TouchableOpacity>
          }
        />
      }
    >
      <View style={{ width: '100%', padding: 16 }}>
        <TextInput
          placeholder='Tulis pendapatmu'
          placeholderTextColor={Color.placeholder}
          autoFocus={true}
          style={{
            fontWeight: '500',
            fontSize: 12,
            fontFamily: 'Inter-Regular',
            color: Color.text,
            backgroundColor: Color.theme,
          }}
          value={textComment}
          multiline
          onChangeText={(e) => setTextComment(e)}
        />
      </View>

      <CardKutipan
        tagged={false}
        item={params.item}
      />

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
