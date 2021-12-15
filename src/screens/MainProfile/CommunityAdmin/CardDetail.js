import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import CarouselView from 'src/components/CarouselView';
import {
  Header,
  Text,
  TouchableOpacity,
  useColor,
  Scaffold,
  Alert,
} from '@src/components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Popup, {usePopup} from '@src/components/Modal/Popup';
import Loading, {useLoading} from '@src/components/Modal/Loading';
import {shadowStyle} from '@src/styles';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
// import {redirectTo} from '@src/utils';

import Client from '@src/lib/apollo';
import {joinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';
import {Divider, MainView} from 'src/styled';
import {navigationRef} from 'App';
import {CommonActions, useIsFocused} from '@react-navigation/native';

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(View)`
  width:100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
  alignItems:flex-start;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const CardDetail = ({navigation, route}) => {
  const [popupProps, showPopup] = usePopup();
  const userDetail = route.params.item.userDetail;
  const user = route.params.item;
  const type = route.params.type;
  const props = route.params.props;
  const [loading, setLoading] = useState(true);

  // console.log(user.id, 'userrrr');
  // console.log(userDetail.image);

  const listCarousel = [
    user.car_photo_main,
    user.car_photo_front,
    user.car_photo_side,
    user.car_photo_back,
  ];

  const {width, height} = useWindowDimensions();

  console.log(listCarousel, 'aaaaaaa');

  const fetchData = () => {
    let status = 2;
    if (props.type === 'newAnggota') {
      status = 0;
    } else if (props.type === 'Anggota') {
      status = 1;
    }

    Client.query({
      query: joinCommunityMember,
      variables: {
        status: status,
      },
    })
      .then(res => {
        setData(res.data.joinCommunityMember);
        setLoading(false);
      })
      .catch(err => {
        console.log('catch', 'warning');
        setLoading(false);
      });
  };

  const handleSuccess = id => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: id,
      },
    })
      .then(res => {
        showPopup('Akun selesai di Approve', 'success');
        fetchData();
        navigation.navigate('CommunityAdminPage');
        setLoading(false);
        // redirectTo('CommunityAdminPage');
      })
      .catch(err => {
        showPopup(err.message, 'warning');
        setLoading(false);
      });
  };

  const handleRemove = id => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 2,
        id: id,
      },
    })
      .then(res => {
        showPopup('Akun berhasil ditolak', 'success');
        fetchData();
        navigation.navigate('CommunityAdminPage');
        setLoading(false);
      })
      .catch(err => {
        showPopup('catch', 'warning');
        setLoading(false);
      });
  };

  const fetchUpdateMember = item => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: item.id,
        customIdNumber: item.userDetail.idNumber,
      },
    })
      .then(res => {
        showPopup('Akun berhasil diubah', 'success');
        fetchData();
        navigation.navigate('CommunityAdminPage');
        setLoading(false);
      })
      .catch(err => {
        showPopup('catch', 'error');
        setLoading(false);
      });
  };

  console.log(user.car_photo_main, 'testt');

  const {Color} = useColor();

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <ScrollView>
        <Header title="User Detail" />
        <View style={{height: 300, backgroundColor: Color.disabled}}>
          {userDetail.image === null ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>DATA BELUM TERSEDIA</Text>
            </View>
          ) : (
            <Image source={{uri: userDetail.image}} style={{}}></Image>
          )}
        </View>
        <View style={{width: width - 32}}>
          <CarouselView
            delay={4000}
            showIndicator
            style={{width: '100%', aspectRatio: 16 / 7}}>
            {/* {listCarousel.map((e, idx) => {
            return (<Image source={{uri: e}} style={{width: '100%', height:'100%'}} />)
          })} */}
            <View
              style={{
                backgroundColor: 'blue',
                height: '100%',
                width: '100%',
              }}></View>
            <View
              style={{
                backgroundColor: 'red',
                height: '100%',
                width: '100%',
              }}></View>
          </CarouselView>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 20,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: Color.border,
          }}>
          <View style={{width: '100%'}}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: 10,
              }}>
              <Text style={{fontWeight: 'bold', paddingBottom: 10}}>
                PROFILE
              </Text>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      NAMA
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{userDetail.firstName + userDetail.lastName}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      EMAIL
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{userDetail.email}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      NOMOR TELEPON
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{userDetail.phoneNumber}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      ALAMAT
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{userDetail.address}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: 10,
              }}>
              <Text style={{fontWeight: 'bold', paddingBottom: 10}}>CAR</Text>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      TIPE MOBIL
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{user.car_type}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      WARNA MOBIL
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{user.car_color}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      TAHUN MOBIL
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{user.car_year}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: Color.border,
                    width: '100%',
                  }}>
                  <LabelInput>
                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
                      ID MOBIL
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <CustomTextInput>
                      <Text>{user.car_identity}</Text>
                    </CustomTextInput>
                  </EmailRoundedView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        {type === 'Anggota' ? (
          <View style={{flexDirection: 'row', width: '100%', height: 33}}>
            <TextInput
              placeholder={userDetail.idNumber || 'Input Nomor ID'}
              placeholderTextColor={Color.gray}
              value={userDetail.idNumber}
              onChangeText={val => {
                let newData = [...data];
                newData[index].userDetail.idNumber = val;
                setData(newData);
              }}
              style={{
                color: Color.gray,
                fontSize: 14,
                fontFamily: 'Inter-Regular',
                width: '80%',
                backgroundColor: '#fff',
                padding: 12,
                borderRadius: 4,
              }}
            />

            <View
              style={{
                width: '20%',
                height: '100%',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  height: '100%',
                  aspectRatio: 1,
                  borderRadius: 50,
                  backgroundColor: Color.info,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  Alert(
                    'Konfirmasi',
                    'Apakah Anda yakin akan mengubah data anggota ini?',
                    () => fetchUpdateMember(user),
                  );
                }}>
                <Ionicons name="save" color={Color.theme} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              height: 33,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                Alert(
                  'Terima',
                  'Apakah Anda yakin akan menerima anggota ini?',
                  () => handleSuccess(user.id),
                );
              }}
              style={{
                backgroundColor: Color.info,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
              }}>
              <Text color={Color.textInput}>{props.handleSuccess}</Text>
            </TouchableOpacity>
            {type !== 'notAnggota' && <Divider />}
            {type !== 'notAnggota' && (
              <TouchableOpacity
                onPress={() => {
                  Alert(
                    'Tolak',
                    'Apakah Anda yakin akan menolak anggota ini?',
                    () => handleRemove(user.id),
                  );
                }}
                style={{
                  backgroundColor: Color.error,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>{props.handleRemove}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <Popup {...popupProps} />
    </MainView>
  );
};

export default CardDetail;
