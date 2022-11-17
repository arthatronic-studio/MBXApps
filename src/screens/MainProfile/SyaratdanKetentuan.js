import React, {useState,useRef, useEffect} from 'react';
import {View,FlatList, Image, ImageBackground, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {querySyaratKetentuan} from '@src/lib/query';
import Client from '@src/lib/apollo';
import { WebView } from 'react-native-webview';
import ImagesPath from 'src/components/ImagesPath';
import {Container} from 'src/styled';
import ModalSyaratKetentuan from 'src/components/ModalSyaratKetentuan';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {shadowStyle} from '@src/styles';
import { fetchGetTerm } from 'src/api-rest/fetchGetTerm';
import {
    Grid, Row, Col,
    Text,
    Header,
    TouchableOpacity,
    useColor,
    Scaffold,
} from '@src/components';
const defaultProps = {
  visible: false,
  onSubmit: () => {},
  onClose: () => {},
  style: {},
  errorMessage: '',
};
const SyaratdanKetentuan = ({
  navigation,
  route,
  visible,
  onSubmit,
  onClose,
  style,
  errorMessage,
}) => {
  const [modalWebView, setmodalWebView] = useState(false);
  const [content, setcontent] = useState('');
   const [modalWebViewPengguna, setmodalWebViewPengguna] = useState(false);
  const {Color} = useColor();
  const {theme} = useSelector(state => state.theme);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [list, setList] = useState({
    data: [],
    loading: false,
    message: 'error',
  });

    useEffect(() => {
      getSyaratKetentuan();
    }, [isFocused]);
  const getSyaratKetentuan = async () => {
    const res = await fetchGetTerm();
    if(res.success){
      let newData = [];
      if (Array.isArray(res.data)) {
        newData = res.data;
      }else{
        newData = [res.data];
      }
      setList({
        ...list,
        data: newData,
        loading: false,
        message: '',
      });
    }else{
      setList({
        ...list,
        loading: false,
        message: '',
      });
    }
  };

  const renderItem = ({item, index}) => (
    <View
      style={{
        marginBottom: 12,
      }}>
      <TouchableOpacity
        onPress={() => {
          setmodalWebView(true);
          setcontent(item.content);
        }}
        style={{
          paddingVertical: 16,
          borderRadius: 6,
          backgroundColor: Color.textInput,
          paddingLeft: 12,
          ...shadowStyle,
        }}>
        <Text size={12} align='left' type="bold">
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Scaffold
      headerTitle="Syarat & Ketentuan"
    >
      <View
        style={{
          flex: 1,
          marginTop: 20,
          marginHorizontal: 10,
        }}>
        <FlatList
          data={list.data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id + index.toString()}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingVertical: 8,
          }}
        />
      </View>

      <ModalSyaratKetentuan
        visible={modalWebView}
        content={content}
        onClose={() => setmodalWebView(false)}
      />
     
    </Scaffold>
  );
};

export default SyaratdanKetentuan;