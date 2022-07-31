import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, ScrollView, useWindowDimensions, Animated, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { Button, Loading } from 'src/components';
import { useLoading, usePopup, useColor, Header, Submit } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider, Row } from '@src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
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
import Config from 'react-native-config';
import { queryProductManage } from 'src/lib/query';
import { uploadChunkActionsNoStateSave } from 'src/state/actions/upload';
import { statusBarHeight } from 'src/utils/constants';

const ForumThreadManageDetailScreen = ({ navigation, route }) => {
  const { params } = route;
  const isUpdatePage = typeof params.id !== 'undefined';
  
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const { Color } = useColor();
  const { width, height } = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const uploadChunkState = useSelector(state => state.uploadChunkState);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    code: isUpdatePage ? params.code : '',
    name: params.textTitle,
    price: isUpdatePage ? params.price : 0,
    status: isUpdatePage ? params.status : 'PUBLISH',
    method: isUpdatePage ? 'UPDATE' : 'INSERT',
    type: Config.PRODUCT_TYPE,
    category: 'FORUM',
    description: params.textDescription,
    latitude: isUpdatePage ? params.latitude : '',
    longitude: isUpdatePage ? params.longitude : '',
    eventDate: isUpdatePage && Moment(params.eventDate).isValid() ? new Date(params.eventDate) : new Date(),
    fullDescription: isUpdatePage ? params.fullDescription : '',
    groupId: params.groupId,
  });
  const [selectedImages, setSelectedImages] = useState(isUpdatePage && params.image ? [{ fromServer: true, uri: params.image }] : []);
  const [selectedVideos, setSelectedVideos] = useState(isUpdatePage && params.videoFilename ? [{ fromServer: true, uri: params.videoFilename }] : []);
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [modalVideoPicker, setModalVideoPicker] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);

  const mainScrollViewRef = useRef();
  const richTextRef = useRef();

  console.log(selectedVideos);

  useEffect(() => {
    resetManage();
  }, []);

  useEffect(() => {
    if (uploadChunkState.endUpload === true) {
      showLoading();

      let variables = {
        products: [{
          name: userData.name,
          price: userData.price,
          status: userData.status,
          method: isUpdatePage ? 'COMPLETE_UPDATE' : 'COMPLETE_UPLOAD',
          type: userData.type,
          description: userData.description,
          category: userData.category,
          categorySub: 'ALL',
          fullDescription: userData.fullDescription,
          groupId: userData.groupId,
        }],
      };
      
      if (isUpdatePage) {
        variables.products[0]['code'] = params.code;
      }

      if (selectedImages.length > 0 && selectedImages[0].base64) {
        variables.products[0]['image'] = selectedImages[0].base64;
      }

      if (params.parentProductId) {
        variables.products[0]['parentProductId'] = params.parentProductId;
      }

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

          showLoading(
            'success',
            'Berhasil Mengupload',
            () => navigation.navigate('ForumGroupScreen', { ...params, refresh: true }),
          );
        })
        .catch((err) => {
          console.log(err, 'errrrr');
          showLoading('error', 'Gagal Upload, Harap ulangi kembali');
        })
    } else if (uploadChunkState.errorUpload) {
      showLoading('error', 'Gagal Upload, Harap ulangi kembali');
      dispatch({ type: 'UPLOAD_CHUNK_STATE.SET_ERROR_UPLOAD', data: false });
    }
  }, [uploadChunkState]);

  const resetManage = () => {
    // dispatch(removeFilePath(outputVideoCache));
    // dispatch(removeFilePath(outputImageCache));
    dispatch({ type: 'UPLOAD_CHUNK_STATE.RESET' });
  }

  const onSubmit = () => {
    if (userData.fullDescription === '') {
      showPopup('Silakan masukan deskripsi terlebih dulu', 'danger');
      return;
    }

    Keyboard.dismiss();
    showLoading();

    if (selectedVideos.length === 0 || (selectedVideos.length > 0 && selectedVideos[0].fromServer)) {
      onSubmitWithoutVideo();
      return;
    }

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
        fullDescription: userData.fullDescription,
        groupId: userData.groupId,
      }],
    };

    if (isUpdatePage) {
      variables.products[0]['code'] = params.code;
    }

    if (params.parentProductId) {
      variables.products[0]['parentProductId'] = params.parentProductId;
    }

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
            fullDescription: userData.fullDescription,
            groupId: userData.groupId,
          }],
        };

        if (isUpdatePage) {
          dataVariables.products[0]['code'] = params.code;
        }

        if (params.parentProductId) {
          dataVariables.products[0]['parentProductId'] = params.parentProductId;
        }

        dispatch(uploadChunkActionsNoStateSave(selectedVideos[0].uri, dataVariables));
      })
      .catch((err) => {
        console.log(err, 'errrrr');
        showLoading('error', 'Gagal Upload, Harap ulangi kembali');
      });
  }

  const onSubmitWithoutVideo = () => {
    let variables = {
      products: [{
        ...userData,
      }],
    };

    if (selectedImages.length > 0 && selectedImages[0].base64) {
      variables.products[0]['image'] = selectedImages[0].base64;
    }

    if (params.parentProductId) {
      variables.products[0]['parentProductId'] = params.parentProductId;
    }

    console.log(variables, 'variables');

    Client.query({
      query: queryProductManage,
      variables,
    })
      .then((res) => {
        console.log(res, '=== Berhsail ===');

        const data = res.data.contentProductManage;

        if (Array.isArray(data) && data.length > 0 && data[0]['id']) {
          showLoading('success', 'Thread berhasil dibuat!');

          setTimeout(() => {
            navigation.navigate('ForumGroupScreen', { ...params, refresh: true });
          }, 2500);
        } else {
          showLoading('error', 'Thread gagal dibuat!');
        }
      })
      .catch((err) => {
        console.log(err, 'errrrr');
        showLoading('error', 'Gagal membuat thread, Harap ulangi kembali');
      });
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
        hideOnError
        autoplay={false}
      />
    )
  }

  // console.log('richTextRef', richTextRef.current);
  // console.log('selectedVideos', selectedVideos);
  console.log(selectedImages);

  return (
    <Scaffold
      loadingProps={loadingProps}
      popupProps={popupProps}
      header={
        <Header
          title={`${isUpdatePage ? 'Edit' : 'Buat'} Posting`}
          centerTitle={false}
          actions={
            <Button
              onPress={() => {
                onSubmit();
              }}
              fontSize={12}
            >
              Posting
            </Button>
          }
        />
      }
    >
      <Divider />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={mainScrollViewRef}
          keyboardShouldPersistTaps='handled'
        >
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
              useContainer
              onCursorPosition={(scrollY) => {
                mainScrollViewRef.current.scrollTo({y: scrollY - 30, animated: true});
              }}
              initialContentHTML={isUpdatePage ? params.fullDescription : ''}
              placeholder="Apa yang sedang kamu pikirkan..."
              onChange={(val) => {
                setUserData({
                  ...userData,
                  fullDescription: val
                });
              }}
            />
          </Container>
        </ScrollView>

        <Container
          paddingVertical={Platform.OS === 'ios' ? 2 : 6}
          color={Color.border}
          marginBottom={Platform.OS === 'ios' ? 0 : statusBarHeight}
        >
          <RichToolbar
            editor={richTextRef}
            onPressAddImage={() => setModalImagePicker(true)}
            insertVideo={() => setModalVideoPicker(true)}
            insertEmoji={onPressAddEmoji}
            selectedIconTint={Color.border}
            selectedButtonStyle={{
              backgroundColor: Color.primary,
            }}
            style={{
              backgroundColor: Color.border,
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
        </Container>

        {emojiVisible && <EmojiView onSelect={handleInsertEmoji} />}
      </KeyboardAvoidingView>

      <ModalImagePicker
        visible={modalImagePicker}
        onClose={() => setModalImagePicker(false)}
        onSelected={(callback) => {
          setModalImagePicker(false);
          // hide select multi
          // let currSelectedImages = [...selectedImages, callback];
          let currSelectedImages = [callback];
          setSelectedImages(currSelectedImages);
        }}
      />

      <ModalVideoPicker
        visible={modalVideoPicker}
        onClose={() => setModalVideoPicker(false)}
        onSelected={(callback) => {
          console.log(callback);
          setModalVideoPicker(false);
          setSelectedVideos([]);
          setTimeout(() => {
            // hide sselect multi
            // let currSelectedVideos = [...selectedVideos, callback];
            let currSelectedVideos = [callback];
            setSelectedVideos(currSelectedVideos);
          }, 1500);
        }}
      />

      <Loading
        visible={uploadChunkState.onUpload}
        message={uploadChunkState.isProses ?
          `Memproses Video ${uploadChunkState.countProses}/${uploadChunkState.totalProses}` :
          `Mengupload Video ${uploadChunkState.progress}/${uploadChunkState.total}`}
        usingPercentage
        percentage={uploadChunkState.progress * 100 / uploadChunkState.total}
      />
    </Scaffold>
  );
};

export default ForumThreadManageDetailScreen;