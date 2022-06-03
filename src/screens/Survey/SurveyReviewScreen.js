import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import CarouselView from 'src/components/CarouselView';
import {
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Alert,
  Button,
} from '@src/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Popup, {usePopup} from '@src/components/Modal/Popup';

import Client from '@src/lib/apollo';
import {queryJoinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {Container, Divider, Row} from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { joinCommunityMember } from 'src/lib/query/joinCommunityMember';
import { useSelector } from 'react-redux';
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

  console.log(listHeader, valueContent);
  
  const user = useSelector((state) => state['user.auth'].login.user);

  const [loading, setLoading] = useState(false);
  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();

  useEffect(() => {
    
  }, []);

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
        <Text style={{fontWeight: 'bold', paddingBottom: 4}}>
          {label}
        </Text>
        <Divider height={8} />
        <Container width={width - 32} height={getSizeByRatio({ width: width - 32, ratio: 3/4 }).height}>
          <Image 
            source={{uri: image}}
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
              <View key={id} style={{paddingRight: 16, marginTop: 4}}>
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
                            source={{ uri: val }}
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
                      {item.label !== '' && <Text align='left' size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                        {item.label}
                      </Text>}
                    </LabelInput>
                    <EmailRoundedView>
                      <FieldView>
                        <Text align='left'>{mappingValue(item)}</Text>
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
            alert('Survei terkirim, Terima kasih telah mengisi survei melalui aplikasi Tribes Survey')
            setTimeout(() => {
              navigation.popToTop();
            }, 2500);
          }}
        >
          Kirim
        </Button>
      </Container>
    </Scaffold>
  );
};

export default SurveyReviewScreen;
