import {View} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
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
import FormSelect from 'src/components/FormSelect';
import ModalDropDown from 'src/components/Modal/ModalDropDown';
import { fetchReportAlasan } from 'src/api/reportAlasan';

const ReportArticle = ({navigation, route}) => {
  const {Color} = useColor();
  const [value, setValue] = useState('');
  const [alasan, setAlasan] = useState('');
  const [alasanList, setAlasanList] = useState([]);
  const modalDropDownRef = useRef();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchReportAlasan();
      setAlasanList(res.data);
    }
    fetch();
  }, []);

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
      reportType: alasan.value,
      reportMessage: value,
    }

    const result = await fetchReportAbuse(variables);
    if(result.status){
      showLoading('success', 'Laporan Berhasil');
      setTimeout(() => {
        navigation.navigate('NewsScreenV2', {title: 'Artikel'});
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
        keyboardShouldPersistTaps="handled">
        <Divider height={16} />
        <View style={{ paddingHorizontal: 16 }}>
          <Text type="bold" align="left">
            Kenapa kamu melaporkan artikel ini?
          </Text>
        </View>

        <FormSelect
          type="select"
          hideErrorHint
          value={alasan.name}
          placeholder="Pilih Alasan"
          onPress={() => {
            modalDropDownRef.current.open();
          }}
          labelContainerStyle={{
            paddingTop: 0,
          }}
        />

        <Divider height={16} />
        <View style={{paddingHorizontal: 16}}>
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
        </View>

        <Divider height={16}/>

        <View style={{paddingHorizontal: 16}}>
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

      <ModalDropDown
        ref={modalDropDownRef}
        data={alasanList}
        selectedValue={alasan}
        onPress={value => {
          setAlasan(value);
          modalDropDownRef.current.close();
        }}
        name="name"
        label={'Alasan'}
      />
    </Scaffold>
  );
};

export default ReportArticle;
