import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import RNSimpleCrypto from "react-native-simple-crypto";
import axios from 'axios';

import CarouselView from 'src/components/CarouselView';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Alert,
  Button,
  useLoading,
} from '@src/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Popup, { usePopup } from '@src/components/Modal/Popup';

import Client from '@src/lib/apollo';
import { queryJoinCommunityManage } from '@src/lib/query/joinCommunityManage';
import { Container, Divider, Row } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { joinCommunityMember } from 'src/lib/query/joinCommunityMember';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from 'src/components/CircularProgress';
import moment from 'moment';

const EmailRoundedView = Styled(View)`
  width: 100%;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
  padding: 6px 0px;
`;

const FieldView = Styled(View)`
  width: 100%;
  alignItems: flex-start;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
  paddingTop: 4px;
`;

const SurveyReviewScreen = ({ navigation, route }) => {
  const { listHeader, valueContent } = route.params;

 

  const user = useSelector((state) => state['user.auth'].login.user);
  const { width, height } = useWindowDimensions();
  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [useSurveyFile, setUseSurveyFile] = useState(false);

  useEffect(() => {
    for (let i = 0; i < valueContent.length; i++) {
      const valBlock = valueContent[i];
      for (let index = 0; index < valBlock.length; index++) {
        const value = valBlock[index];
        if (value.type === 'UPLOAD') {
          setUseSurveyFile(true);
          break;
        }
      }
    }
  }, []);

  const onStoreReset = () => {
    dispatch({ type: 'SURVEY_PASAR.RESET' });
  }

  const onSubmit = () => {
    fetchSurveyFormFile();
    // if (useSurveyFile) {
    //   fetchSurveyFormFile()
    // } else {
    //   fetchSurveySubmit();
    // }
  }

  const fetchSurveySubmit = async () => {
    let data = [];

   let latitude = 0;
   let longitude = 0;
   let provinsi_id = 0;
   let city_id = 0;
   let suburb_id = 0;
   let area_id = 0;
   let nama_pasar = '';

    for (let i = 0; i < valueContent.length; i++) {
      const valBlock = valueContent[i];
      for (let index = 0; index < valBlock.length; index++) {
        const item = valBlock[index];
        // komen label tidak dikirim
        // if (item.type === 'LABEL') {

        // }
        // else {
          let value = item.value.toString();

          if (item.type === 'RADIO' || item.type === 'SELECT_BOX') {
            value = item.value ? item.value.name.toString() : '';
          }
          if (item.type === 'MAP_VIEW') {
            value = item.value.fullAddress;
            latitude = item.value.latitude;
            longitude = item.value.longitude;
          }
          if (item.type === 'TIME_PICKER' && moment(item.value).isValid()) {
            value = moment(item.value).format('HH:mm');
          }
          if (item.type === 'UPLOAD') {
            value = '';
          }
          if (item.type === 'SELECT_MULTIPLE') {
            value = '';
            for (let i = 0; i < item.value.length; i++) {
              const val = item.value[i];
              value = value + val.name + (i === (item.value.length - 1) ? '' : ',');
            }
            // for (const val of item.value) {
            //   value.push(val.name);
            // }
        }
         if (item.name === 'province_id') {
           provinsi_id = item.value.id;
         }
         if (item.name === 'city_id') {
           city_id = item.value.id;
         }
         if (item.name === 'suburb_id') {
           suburb_id = item.value.id;
         }
         if (item.name === 'area_id') {
           area_id = item.value.id;
         }
         if (item.label === 'Nama Pasar') {
           nama_pasar = item.value;
         } 

          const prefixText = item.validation && item.validation.prefixText ? `${item.validation.prefixText} ` : '';
          const suffixText = item.validation && item.validation.suffixText ? ` ${item.validation.suffixText}` : '';
          if (typeof value === 'string') {
            value = `${prefixText}${value.trim()}${suffixText}`;
          }

          data.push({
            block: (i + 1).toString(),
            index,
            name: item.name || item.label.replace(/ /g, ''),
            value,
          });
        // }
      }
    }

    const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
    const dataq = {
      "auth": sha1Hash,
      "survey_code": "SURVEY-20220229",
      "timestamps": moment().format('YYYY-MM-DD HH:mm:ss'),
      "caption_code": "pasar",
      "data": data,
      "latitude":latitude,
      "longitude" : longitude,
      "user_id": user.userId,
      "province_id" :provinsi_id,
      "city_id": city_id,
      "suburb_id": suburb_id,
      "area_id" : area_id
      
    };

    console.log(dataq, 'dataq');
    return;

     let config = {
       method: 'post',
       url: 'http://panel.survey.tribesocial.id/submit-survey',
       headers: {
          Accept: 'application/json'
         },
       data: dataq,
     };

     showLoading();

     axios(config)
       .then(function (response) {
         console.log('response', response);
         hideLoading();

         if (response.data.status ) {
           alert(
             'Survei terkirim, Terima kasih telah mengisi survei melalui aplikasi Tribes Survey',
           );
           setTimeout(() => {
             navigation.popToTop();
             onStoreReset();
           }, 2500);
         } else {
           alert('Not OK');
         }
       })
       .catch(function (error) {
         console.log('ini error', JSON.stringify(error));
         hideLoading();
         alert('Terjadi kesalahan');
       });



    // try {
    //   showLoading()
    //   const response = await axios({
    //     baseURL: 'http://panel.survey.tribesocial.id',
    //     method: 'post',
    //     url: '/submit-survey',
    //     data: dataq,
    //     headers: {
    //       Accept: 'application/json'
    //     },
    //     timeout: 5000,
    //   });

    //   hideLoading();

    //   alert('Survei terkirim, Terima kasih telah mengisi survei melalui aplikasi Tribes Survey')
    //   setTimeout(() => {
    //     navigation.popToTop();
    //   }, 2500);
    //   console.log(response, "respon apicall")
    // } catch (error) {
    //   hideLoading()
    //   alert('Gagal mengirim survey, silakan coba kembali');
    //   console.log(error, 'error apicall')
    // }
  }

  const fetchSurveyFormFile = async() => {
    const sha1Hash = await RNSimpleCrypto.SHA.sha1("SURVEY-20220229" + moment().format('YYYY-MM-DD HH:mm:ss') + '123!!qweQWE');
    let data = new FormData();
    let indexData = -1;

    let latitude = 0;
    let longitude = 0;
    let provinsi_id = 0;
    let city_id = 0;
    let suburb_id = 0;
    let area_id = 0;
    let nama_pasar = '';
     
      
    
    for (let i = 0; i < valueContent.length; i++) {
      const valBlock = valueContent[i];
      for (let index = 0; index < valBlock.length; index++) {
        const item = valBlock[index];
        //  console.log('longitude', item.value);
       
        if (item.type === 'MAP_VIEW') {
           latitude = item.value.latitude;
           longitude = item.value.longitude;
        }
        if (item.name === 'province_id') {
           provinsi_id = item.value.id;
        }
        if (item.name === 'city_id') {
           city_id = item.value.id;
        }
        if (item.name === 'suburb_id') {
           suburb_id = item.value.id;
        }
        if (item.name === 'area_id') {
          area_id = item.value.id;
        } 
        if (item.label === 'Nama Pasar') {
          nama_pasar = item.value;
        } 
      } 
    }
    console.log('latitude', provinsi_id);

    data.append('auth', 'd57abbc8289c72b56161f3f90ef1fa5ad5dca48a');
    data.append('caption_code', 'pasar');
    // data.append('survey_code', 'SURVEY-' + moment().format('DDMMYYYY'));
    // data.append('timestamps', moment().format('YYYY-MM-DD HH:mm:ss')); // moment().format('YYYY-MM-DD HH:mm:ss'),
    data.append('survey_code', 'SURVEY-20220229');
    data.append('timestamps', '2022-05-30 11:42:59');
    data.append('user_id', user.userId);
    data.append('area_id', area_id);
    data.append('province_id', provinsi_id);
    data.append('city_id', city_id);
    data.append('suburb_id', suburb_id);
    data.append('nama_pasar', nama_pasar);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
  
   
    for (let i = 0; i < valueContent.length; i++) {
      const valBlock = valueContent[i];
      for (let index = 0; index < valBlock.length; index++) {
        const item = valBlock[index];
        // komen label tidak dikirim
        // if (item.type === 'LABEL') {

        // } else {
          indexData++;
          let value = item.value.toString();

          if (item.type === 'RADIO' || item.type === 'SELECT_BOX') {
            value = item.value ? item.value.name.toString() : '';
          }
          if (item.type === 'MAP_VIEW') {
            value = item.value.fullAddress;
          }
          if (item.type === 'TIME_PICKER' && moment(item.value).isValid()) {
            value = moment(item.value).format('HH:mm');
          }
          if (item.type === 'UPLOAD') {
            value = [];
            for (const val of item.value) {
              value.push({
                uri: val.uri,
                type: val.type,
                name: val.fileName
              });
            }
            // TODO: ambil index pertama dari api belom support array of img
            // value = value[0];
          }
          if (item.type === 'SELECT_MULTIPLE') {
            value = '';
            for (let i = 0; i < item.value.length; i++) {
              const val = item.value[i];
              value = value + val.name + (i === (item.value.length - 1) ? '' : ',');
            }
            // for (const val of item.value) {
            //   value.push(val.name);
            // }
          }

          const prefixText = item.validation && item.validation.prefixText ? `${item.validation.prefixText} ` : '';
          const suffixText = item.validation && item.validation.suffixText ? ` ${item.validation.suffixText}` : '';
          if (typeof value === 'string') {
            value = `${prefixText}${value.trim()}${suffixText}`;
          }
          
          data.append(`data[${indexData}][block]`, (i + 1).toString());
          data.append(`data[${indexData}][index]`, index);
          data.append(`data[${indexData}][name]`, item.label || item.name);
          // data.append(`data[${indexData}][value]`, value);
          if (Array.isArray(value)) {
            if (value.length > 0) {
              for (let valIdx = 0; valIdx < value.length; valIdx++) {
                const valObj = value[valIdx];
                data.append(`data[${indexData}][value][${valIdx}]`, valObj);
              }
            } else {
              data.append(`data[${indexData}][value]`, '');
            }
          } else {
            data.append(`data[${indexData}][value]`, value);
          }
          data.append(`data[${indexData}][type]`, item.type === 'UPLOAD' ? item.type + '_' + item.validation.uploadType.toUpperCase() : item.type);
        // }
      }
    }

    // console.log(data);

    // return;

    let config = {
      method: 'post',
      url: 'http://panel.survey.tribesocial.id/survey-form-file',
      headers: {
        "Content-Type": `multipart/form-data`,
      },
      data: data
    };

    showLoading();

    axios(config)
      .then(function (response) {
        console.log('response', response);
        hideLoading();

        if (response.data.status) {
          alert('Survei terkirim, Terima kasih telah mengisi survei melalui aplikasi Tribes Survey');
          setTimeout(() => {
            navigation.popToTop();
            onStoreReset();
          }, 2500);
        } else {
          alert('Not OK');
        }
      })
      .catch(function (error) {
        console.log('ini error',JSON.stringify(error));
        hideLoading();
        alert('Terjadi kesalahan');
      });
  }

  const mappingValue = (item) => {
    if (item.type === 'RADIO' || item.type === 'SELECT_BOX') {
      return item.value.name;
    }
    if (item.type === 'MAP_VIEW') {
      return item.value.fullAddress;
    }
    if (item.type === 'TIME_PICKER' && moment(item.value).isValid()) {
      return moment(item.value).format('HH:mm');
    }
    return item.value.toString();
  }

  const renderFotoInfo = (label, image) => {
    return (
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingBottom: 16,
        }}
      >
        <Text style={{ fontWeight: 'bold', paddingBottom: 4 }}>
          {label}
        </Text>
        <Divider height={8} />
        <Container width={width - 32} height={getSizeByRatio({ width: width - 32, ratio: 3 / 4 }).height}>
          <Image
            source={{ uri: image }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 4,
              backgroundColor: Color.border,
            }}
          />
        </Container>
      </View>
    )
  }

  const renderLabel = (item, index) => {
    return (
      <Container key={index} paddingHorizontal={16} paddingVertical={12}>
        <Text type='bold' align='left'>{item.label}</Text>
      </Container>
    )
  }

  const renderSelectMultipleTag = (item, index) => {
    const arrOptions = item.value;

    return (
      <View key={index}>
        <View style={{ marginHorizontal: 12, marginBottom: 16 }}>
          <View style={{ alignItems: 'flex-start', paddingHorizontal: 4, paddingVertical: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.label}</Text>
          </View>
          <View>
            <Row style={{ flexWrap: 'wrap' }}>
              {arrOptions.map((val, id) => {
                return (
                  <View
                    key={id}
                    style={{ paddingHorizontal: 4, marginBottom: 8 }}
                  >
                    <TouchableOpacity
                      style={{
                        borderColor: Color.textInput,
                        backgroundColor: Color.primary,
                        borderWidth: 2,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ marginHorizontal: 16, marginVertical: 8 }} color={Color.textInput}>{val.name}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </Row>
          </View>
        </View>
      </View>
    )
  }

  const renderRadio = (item, index) => {
    return (
      <View key={index} style={{ alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 16 }}>
        <Text align='left' size={12} color={Color.secondary} style={{ marginBottom: 4 }}>{item.label}</Text>
        <Row>
          <View key={id} style={{ paddingRight: 16, marginTop: 4 }}>
            <TouchableOpacity
              style={{ height: 20, width: 20, borderRadius: 15, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center' }}
            >
              <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: '#fff' }} />
            </TouchableOpacity>
            <Divider height={4} />
            <Text size={12}>{item.value.name}</Text>
          </View>
        </Row>
      </View>
    )
  }

  const renderUpload = (item, index) => {
    let arr = item.value;

    return (
      <View key={index}>
        <Container paddingHorizontal={16}>
          <Text size={10} align='left' style={{ marginBottom: 8 }}>{item.label}</Text>
        </Container>

        {arr.length != 0 && <Row style={{ flexWrap: 'wrap', flex: 1 }}>
          {arr.map((val, id) => (
            <View
              key={id}
              style={{
                borderWidth: 1,
                borderColor: Color.border,
                width: (width / 2) - 40,
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 20,
                marginVertical: 12,
              }}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                source={{ uri: val.uri }}
              />
            </View>
          ))}
        </Row>}
      </View>
    )
  }

  return (
    <Scaffold
      headerTitle='Survey Review'
      fallback={loading}
      popupProps={popupProps}
      loadingProps={loadingProps}
    >
      <ScrollView>

        {listHeader.map((itemHeader, indexHeader) => {
          return (
            <Container key={indexHeader} marginTop={16}>
              <View key={indexHeader} style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16 }}>
                <CircularProgress
                  progress={Math.ceil(((indexHeader + 1) / listHeader.length) * 100)}
                  color={Color.error}
                  textComponent={<Text size={28} color={Color.error} type='bold'>{itemHeader.order}</Text>}
                />
                <View style={{ alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{itemHeader.header_label}</Text>
                  <Text style={{ fontSize: 10, color: Color.secondary }}>{itemHeader.sub_header_label}</Text>
                </View>
              </View>

              {valueContent[indexHeader].map((item, index) => {
                const prefixText = item.validation && item.validation.prefixText ? `${item.validation.prefixText} ` : '';
                const suffixText = item.validation && item.validation.suffixText ? ` ${item.validation.suffixText}` : '';
                const reviewRemoveLabel = item.validation && item.validation.reviewRemoveLabel; 

                if (item.type === 'LABEL') {
                  return renderLabel(item, index);
                }
                if (item.type === 'SELECT_MULTIPLE') {
                  // if (item.validation && item.validation.selectType === 'tag') {
                  return renderSelectMultipleTag(item, index);
                  // }
                }
                if (item.type === 'RADIO') {
                  // return renderRadio(item, index);
                }
                if (item.type === 'MAP_VIEW') {
                  // return renderMapView(item, index);
                }
                if (item.type === 'UPLOAD') {
                  return renderUpload(item, index);
                }

                return (
                  <Container key={index} paddingHorizontal={16}>
                    <View
                      style={{
                        marginBottom: 8,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: Color.border,
                        width: '100%',
                      }}>
                      <LabelInput>
                        {!reviewRemoveLabel && item.label !== '' && <Text align='left' size={12} letterSpacing={0.08} style={{ opacity: 0.6 }}>
                          {item.label}
                        </Text>}
                      </LabelInput>
                      <EmailRoundedView>
                        <FieldView>
                          <Text align='left'>{prefixText}{mappingValue(item)}{suffixText}</Text>
                        </FieldView>
                      </EmailRoundedView>
                    </View>
                  </Container>
                )
              })}
            </Container>
          )
        })}
      </ScrollView>

      <Container padding={16}>
        <Button
          onPress={() => {
            onSubmit();
          }}
        >
          Kirim
        </Button>
      </Container>
    </Scaffold>
  );
};

export default SurveyReviewScreen;
