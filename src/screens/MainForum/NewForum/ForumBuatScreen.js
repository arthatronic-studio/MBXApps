import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, FlatList, Row, TextInput, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { ModalUnlock } from 'src/components';
import { useLoading, usePopup, useColor, Header, Submit } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider } from '@src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iconWarning, iconHeart, iconShare, iconBookmarks } from '@assets/images/home';
import { useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import FormInput from 'src/components/FormInput';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';

const ForumBuatScreen = ({ navigation, route }) => {
  const modalOptionsRef = useRef();
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);

  const [showSection, setShowSection] = useState(true);
  const [textJudul, setTextJudul] = useState('');
  const [textDesc, setTextDesc] = useState('');
  const [disabled, setDisabled] = useState(true);


  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const { Color } = useColor();

  return (
    <Scaffold
      header={
        <Header
          title='Buat Posting'
          centerTitle={false}
        />
      }
    >
      <ScrollView>
        <Container paddingHorizontal={16}>
          <FormInput
            label="Judul Posting"
            placeholder="Masukan Judul Posting"
            value={textJudul}
            onChangeText={(e) => {
              setTextJudul(e);
              if (e === '') setDisabled(true);
              else setDisabled(false);
            }}
            multiline={false}
          />

          <FormInput
            label="Deskripsi Singkat"
            placeholder="Masukan Deskripsi Singkat"
            value={textDesc}
            onChangeText={(e) => {
              setTextDesc(e);
            }}
            multiline
          />
        </Container>
      </ScrollView>

      <Submit
        buttonLabel='Lanjut'
        buttonColor={disabled ? Color.grayLight : Color.primary}
        disabled={disabled}
        type='bottomSingleButton'
        buttonBorderTopWidth={0.5}
        onPress={() => {
          navigation.navigate('ForumBuatDetailScreen', {
            title: textJudul,
            description: textDesc,
          });
        }}
      />
    </Scaffold>
  );
};

export default ForumBuatScreen;