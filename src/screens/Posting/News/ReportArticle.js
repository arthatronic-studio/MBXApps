import {View} from 'react-native';
import React, {useRef, useState} from 'react';
import Scaffold from '@src/components/Scaffold';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Divider} from '@src/styled';
import {
  useColor,
  Text,
  Submit,
  usePopup,
  useLoading
} from '@src/components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FormInput from 'src/components/FormInput';
import { fetchReportAbuse } from 'src/api/reportAbuse';

const ReportArticle = ({navigation, route}) => {
  const {Color} = useColor();
  const [value, setValue] = useState('');
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const onSubmit = async () => {
    if(value === ''){
      showPopup("Mohon isi deskripsi terlebih dahulu", 'warning');
      return
    }
    const variables = {
      referenceId: route.params.id,
      referenceType: 'PRODUCT',
      referenceName: route.params.productName,
      refStatus: 'PUBLISH',
      reportMessage: value,
    }

    const result = await fetchReportAbuse(variables);
    if(result.status){
      showLoading('success', 'Laporan Berhasil');
      setTimeout(() => {
        navigation.navigate('NewsScreen', {title: 'Artikel'});
      }, 2500);
    }else{
      showLoading('error', 'Gagal melaporkan');
      setTimeout(() => {
        navigation.pop();
      }, 2500);
    }
  }

  return (            
    <Scaffold headerTitle="Laporkan" popupProps={popupProps} loadingProps={loadingProps}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{paddingHorizontal: 16}}>
        <Divider height={16} />
        <Text type="bold" align="left">
          Kenapa kamu melaporkan artikel ini?
        </Text>
        <Divider height={16} />
        <FormInput
          label="Deskripsi"
          placeholder="Tuliskan deskripsi laporan disini..."
          hideErrorHint
          keyboardType="default"
          multiline
          value={value}
          onChangeText={value => {
            setValue(value);
          }}
        />

        <Divider height={16}/>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 8,
            backgroundColor: '#e2ebfe',
            padding: 10
          }}>
          <IonIcons
            name={'information-circle-outline'}
            color={Color.text}
            size={12}
          />
          <Divider width={12}/>
          <Text
            align="left"
            color={Color.text}
            size={10}
            lineHeight={15}>
            Laporan yang kamu dikirimkan akan ditindaklanjuti lebih jauh oleh
            admin
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <Submit
        buttonLabel="Laporkan"
        buttonColor={value === '' ? Color.disabled : Color.danger}
        type="bottomSingleButton"
        buttonBorderTopWidth={0.5}
        onPress={() => {
          onSubmit();
        }}
      />
    </Scaffold>
  );
};

export default ReportArticle;
