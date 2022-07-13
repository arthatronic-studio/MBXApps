import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, ScrollView, useWindowDimensions, Animated, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { Button, ModalUnlock } from 'src/components';
import { useLoading, usePopup, useColor, Header, Submit } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider, Row } from '@src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { ModalListText } from 'src/components';
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
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { EmojiView } from './EmojiView';
import ModalVideoPicker from 'src/components/Modal/ModalVideoPicker';
import VideoPlayerIos from 'src/components/VideoPlayerIos';
import { VideoPlayerAndroid } from 'src/components/VideoPlayerAndroid';
import { accessClient } from 'src/utils/access_client';
import Config from 'react-native-config';
import { queryProductManage } from 'src/lib/query';
import { uploadChunkActionsNoStateSave } from 'src/state/actions/upload';

const ForumBuatDetailScreen = ({ navigation, route }) => {
  const { params } = route;
  const { item } = params;
  const modalOptionsRef = useRef();
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const uploadChunkState = useSelector(state => state.uploadChunkState);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    code: '',
    name: params.title,
    price: 0,
    image: '',
    status: 'PUBLISH',
    method: 'INSERT',
    type: Config.PRODUCT_TYPE,
    category: 'FORUM' || params.productSubCategory,
    description: params.description,
    latitude: '',
    longitude: '',
    eventDate: new Date(),
  });
  const [showSection, setShowSection] = useState(true);
  const [textIsi, setTextisi] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [showfeature, setShowFeature] = useState(true);
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [modalVideoPicker, setModalVideoPicker] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);

  const modalListTextckRef = useRef();
  const richTextRef = useRef();

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    resetManage();
  }, []);

  useEffect(() => {
    if (selectedImages.length > 0 && uploadChunkState.endUpload === true) {
      // showLoading();

      let variables = {
        products: [{
          name: userData.name,
          price: userData.price,
          status: userData.status,
          method: 'COMPLETE_UPLOAD',
          type: userData.type,
          description: userData.description,
          category: userData.category,
          categorySub: 'ALL',
          image: selectedImages[0].base64,
        }],
      };

      console.log('COMPLETE_UPLOAD', variables);

      // if (route.params && route.params.item) {
      //   variables.products[0].parentProductId = route.params.item.id;
      // }

      Client.query({
        query: queryProductManage,
        variables,
      })
        .then((res) => {
          console.log('res upload video', res);
          resetManage();

          // showLoading(
          //   'success',
          //   'Berhasil Mengupload',
          //   () => navigation.navigate('ShowAllScreen', {
          //     title: 'Terbaru',
          //     subTitle: 'Semua Video',
          //     componentType: 'SHOW_ALL_VIDEO', //tergantung file
          //     productType: 'CASTING',
          //     popToTop: true
          //   }
          //   )
          // );
        })
        .catch((err) => {
          console.log(err, 'errrrr');
          // showLoading('error', 'Gagal Upload, Harap ulangi kembali');
        })
    } else if (uploadChunkState.errorUpload) {
      // showLoading('error', 'Gagal Upload, Harap ulangi kembali');
      dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ERROR_UPLOAD', data: false });
    }
  }, [uploadChunkState]);

  const resetManage = () => {
    // dispatch(removeFilePath(outputVideoCache));
    // dispatch(removeFilePath(outputImageCache));
    dispatch({ type: 'UPLOAD_CHUNK_STATE.RESET' });
  }

  const onSubmit = () => {
    Keyboard.dismiss();

    let variables = {
      products: [{
        name: userData.name,
        price: userData.price,
        status: userData.status,
        method: 'START_UPLOAD',
        type: userData.type,
        description: userData.description,
        category: userData.category,
        categorySub: 'ALL',
      }],
    };

    console.log('variables', variables);

    Client.query({
      query: queryProductManage,
      variables,
    })
      .then((res) => {
        console.log(res, '=== START_UPLOAD ===');

        let dataVariables = {
          products: [{
            name: userData.name,
            price: userData.price,
            status: userData.status,
            method: userData.method,
            type: userData.type,
            description: userData.description,
            category: userData.category,
            categorySub: 'ALL',
          }],
        };

        dispatch(uploadChunkActionsNoStateSave(selectedVideos[0].uri, dataVariables));
      })
      .catch((err) => {
        console.log(err, 'errrrr');
        // showLoading('error', 'Gagal Upload, Harap ulangi kembali');
      });

    // showLoading('success', 'Thread berhasil dibuat!');

    // setTimeout(() => {
    //   navigation.navigate('ForumGroupScreen', {});
    // }, 2500);
  }

  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          { position: 'absolute', bottom: 300, height: 36, width: '100%', justifyContent: 'space-evenly', paddingHorizontal: 16 },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          <TouchableOpacity>
            <Image
              style={{ height: 45, width: 25 }}
              source={iconsmile} />
          </TouchableOpacity>
          <TouchableOpacity>
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

  let onPressAddImage = (callback) => {
    // insert URL
    // richTextRef.current?.insertImage(
    //     callback.uri,
    //     'background: gray;',
    // );

    // insert base64
    // richTextRef.current?.insertImage(
    //   `data:${callback.type};base64,${callback.base64}`,
    //   `
    //     width:${width - 16};
    //     height:${getSizeByRatio({ width, ratio: 3 / 4 }).height}
    //   `
    // );
  };

  let onPressAddEmoji = useCallback(() => {
    Keyboard.dismiss();
    richTextRef.current?.blurContentEditor();
    setEmojiVisible(!emojiVisible)
  }, [emojiVisible]);

  let handleInsertEmoji = useCallback((emoji) => {
    richTextRef.current?.insertText(emoji);
    richTextRef.current?.blurContentEditor();
  }, []);

  const renderRemoveAttach = (idx, type) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          padding: 4,
          borderRadius: 50,
          backgroundColor: Color.error
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (type === 'image') {
              let currSelectedImages = [...selectedImages];
              currSelectedImages.splice(idx, 1);
              setSelectedImages(currSelectedImages);
            }
            else if (type === 'video') {
              let currSelectedVideos = [...selectedVideos];
              currSelectedVideos.splice(idx, 1);
              setSelectedVideos(currSelectedVideos);
            }
          }}
        >
          <Ionicons name='close' size={16} color={Color.textButtonInline} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderVideoPreview = (item, index) => {
    if (Platform.OS === 'ios') {
      return (
        <VideoPlayerIos
          item={{
            videoFilename: item.uri,
          }}
        />
      )
    }

    return (
      <VideoPlayerAndroid
        item={{
          videoFilename: item.uri,
        }}
        autoplay={false}
      />
    )
  }

  // console.log('richTextRef', richTextRef.current);
  console.log('selectedVideos', selectedVideos);

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          title='Buat Posting'
          centerTitle={false}
          actions={
            <Button
              onPress={() => {
                onSubmit();
              }}
            >
              Posting
            </Button>
          }
        />
      }
    >
      <Divider />

      <ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
            }}
          >
            <Row>
              {selectedImages.map((item, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      width: width / 1.6,
                      aspectRatio: 4 / 3,
                      padding: 8,
                    }}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={{
                        height: '100%',
                        width: '100%'
                      }}
                    />

                    {renderRemoveAttach(idx, 'image')}
                  </View>
                )
              })}
            </Row>
          </ScrollView>

          {selectedVideos.length > 0 &&
            <Container
              paddingHorizontal={16}
              paddingVertical={8}
            >
              {renderVideoPreview(selectedVideos[0], 0)}
              {renderRemoveAttach(0, 'video')}
            </Container>
          }

          <Container paddingHorizontal={8}>
            <RichEditor
              ref={richTextRef}
              placeholder="Apa yang sedang kamu pikirkan..."
              onChange={descriptionText => {
                console.log("descriptionText:", descriptionText);
              }}
            />
          </Container>

          <RichToolbar
            editor={richTextRef}
            onPressAddImage={() => setModalImagePicker(true)}
            insertVideo={() => setModalVideoPicker(true)}
            insertEmoji={onPressAddEmoji}
            selectedButtonStyle={{
              backgroundColor: Color.primary,
            }}
            actions={[
              actions.insertImage,
              actions.insertVideo,
              'insertEmoji',
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
            ]}
            iconMap={{
              [actions.insertImage]: ({ }) => (
                <Image
                  style={{ height: 22, width: 22 }}
                  source={icongalery} />
              ),
              [actions.insertVideo]: ({ }) => (
                <Image
                  style={{ height: 34, width: 34 }}
                  source={iconcameravidio} />
              ),
              insertEmoji: ({ }) => (
                <Image
                  style={{ height: 34, width: 34 }}
                  source={iconsmile} />
              ),
              [actions.heading1]: (props) => {
                return (
                  <Text size={props.iconGap} color={props.tintColor}>H1</Text>
                )
              },
            }}
          />

          {emojiVisible && <EmojiView onSelect={handleInsertEmoji} />}
        </KeyboardAvoidingView>
      </ScrollView>

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

      <ModalImagePicker
        visible={modalImagePicker}
        onClose={() => setModalImagePicker(false)}
        onSelected={(callback) => {
          setModalImagePicker(false);
          let currSelectedImages = [...selectedImages, callback];
          setSelectedImages(currSelectedImages);
        }}
      />

      <ModalVideoPicker
        visible={modalVideoPicker}
        onClose={() => setModalVideoPicker(false)}
        onSelected={(callback) => {
          console.log(callback);
          setModalVideoPicker(false);
          // let currSelectedVideos = [...selectedVideos, callback];
          setSelectedVideos([]);
          setTimeout(() => {
            let currSelectedVideos = [callback];
            setSelectedVideos(currSelectedVideos);
          }, 1500);
        }}
      />
    </Scaffold>
  );
};

export default ForumBuatDetailScreen;