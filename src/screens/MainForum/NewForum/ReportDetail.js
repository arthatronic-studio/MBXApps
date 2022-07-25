import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, FlatList, Row, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

import { useLoading, usePopup, useColor, Header, Submit } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider } from '@src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iconWarning, iconHeart, iconShare, iconBookmarks } from '@assets/images/home';
import { useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { queryAddLike, queryProductReport } from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';

const ReportDetail = ({ navigation, route }) => {
  const { item, title, sub } = route.params;

  const [textIsi, setTextisi] = useState('');

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const { Color } = useColor();

  const onSubmit = () => {
    fetchProductReportCheck();
  }

  const fetchProductReportCheck = () => {
    const variables = {
      referenceId: item.id,
      referenceType: 'PRODUCT',
      referenceName: item.productName,
      refStatus: item.status,
      reportMessage: textIsi,
    };

    console.log('variables', variables);

    Client.mutate({
      mutation: queryProductReport,
      variables,
    })
      .then(res => {
        console.log("res report", res);
        
        showLoading('success', 'Laporan berhasil dibuat, Terima kasih telah membantu untuk melaporkan');

        setTimeout(() => {
          navigation.pop();
          navigation.pop();
        }, 2500);
      })
      .catch(err => {
        console.log('error', err);

        showLoading('error', 'Terjadi kesalahan, silakan coba beberapa saat');
      });
  };

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          title='Report'
          centerTitle={false}
          actions={
            <Submit
              buttonLabel='Posting'
              buttonColor={Color.primary}
              disabled={false}
              style={{ width: 120, marginTop: 10 }}
              type='bottomSingleButton'
              buttonBorderTopWidth={0.5}
              onPress={() => {
                // showLoading('success', 'Thread berhasil dibuat!');
                onSubmit();
              }}
            />
          }
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
          <Text type="bold" align='left'>Pilih alasan report</Text>
        </View>

        <View style={{paddingHorizontal: 16}}>
          <Text align='left' type="bold">{title}</Text>
          {sub !== '' && <>
            <Divider height={4} />
            <Text align='left' size={10}>{sub}</Text>
          </>}
        </View>

        <View style={{ marginVertical: 17, borderRadius: 4, borderColor: Color.border, borderWidth: 1, marginHorizontal: 17 }}>
          <TextInput
            placeholder='Opsional : Jelaskan laporan ini'
            placeholderTextColor={Color.border}
            autoFocus={true}
            style={{
              fontSize: 12,
              fontFamily: 'Inter-Regular',
              color: Color.text,
              marginTop: 8,
              marginBottom: 50,
              paddingLeft: 16,
              paddingRight: 40,
            }}
            value={textIsi}
            multiline
            onChangeText={(e) => { setTextisi(e) }}
          />
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default ReportDetail;