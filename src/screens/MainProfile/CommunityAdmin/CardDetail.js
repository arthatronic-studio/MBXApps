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
} from '@src/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Popup, {usePopup} from '@src/components/Modal/Popup';

import Client from '@src/lib/apollo';
import {joinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {Divider} from 'src/styled';
import Config from 'react-native-config';
import { queryOrganizationMemberManage } from 'src/lib/query/organization';

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

const CardDetail = ({ navigation, route }) => {
  const { item, props } = route.params;
  const userDetail = item.userDetail;

  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const listCarousel = [
    item.car_photo_main,
    item.car_photo_front,
    item.car_photo_side,
    item.car_photo_back,
  ];

  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();

  useEffect(() => {
    setIdNumber(userDetail.idNumber);
  }, []);

  const fetchUpdateMember = () => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: item.id,
        customIdNumber: idNumber,
      },
    })
    .then((res) => {
      showPopup('Akun berhasil diubah', 'success');
      setLoading(false);
    })
    .catch((err) => {
      showPopup('catch', 'error');
      setLoading(false);
    });
  };

  const fetchJoinCommunityManage = (id, userId, status) => {
    setLoading(true);

    let resMessage =
      status === 1 ? 'Diterima' :
      status === 2 ? 'Ditolak' : 'Dihapus';

    Client.query({
      query: joinCommunityManage,
      variables: {
        status,
        id,
      },
    })
      .then((res) => {
        console.log('res join', res);

        const data = res.data.joinCommunityManage;
        const success = data && data.id;

        if (success) {
          showPopup(`Akun berhasil ${resMessage}`, 'success');
          setLoading(false);
          setTimeout(() => {
            navigation.pop();
          }, 3000);
        } else {
          showPopup(`Akun gagal ${resMessage}`, 'error');
          setLoading(false);
        }
      })
      .catch((err) => {
        showPopup(err.message, 'error');
        setLoading(false);
      });
  };

  const fetchOrganizationMemberManage = (id, userId, status) => {
    let resMessage =
      status === 1 ? 'Diterima' :
      status === 2 ? 'Ditolak' : 'Dihapus';
    let method =
      status === 1 ? 'INSERT' :
      status === 2 ? 'REJECT' : 'DELETE';

    const variables = {
      "userId": userId,
      "organizationInitialCode": Config.INITIAL_CODE,
      "type": method,
    };

    console.log(variables);

    Client.mutate({
      mutation: queryOrganizationMemberManage,
      variables,
    }).then((res) => {
      console.log('res organization manage', res);

      const data = res.data.organizationMemberManage;
      const success = data;

      if (success) {
        fetchJoinCommunityManage(id, userId, status);
      } else {
        showPopup(`Sync gagal ${resMessage}`, 'error');
        setLoading(false);
      }
    }).catch((err) => {
      console.log('err organization manage', err);
      showPopup(err.message, 'error');
      setLoading(false);
    });
  }

  return (
    <Scaffold
      headerTitle='Member Detail'
      fallback={loading}
      popupProps={popupProps}
    >
      <ScrollView>
        <CarouselView
          delay={4000}
          showIndicator
          style={{width, aspectRatio: 3/2}}
        >
          {listCarousel.map((e, idx) => {
            return (
              <Image
                key={idx}
                source={{uri: e}}
                style={{width: '100%', height:'100%'}}
              />
            )
          })}
        </CarouselView>

        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 24,
            borderTopWidth: 1,
            borderTopColor: Color.border,
            paddingHorizontal: 16,
          }}
        >
          <View style={{width: '100%'}}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingVertical: 16,
              }}>
              <Text style={{fontWeight: 'bold', paddingBottom: 10}}>
                PROFILE
              </Text>

              <View style={{height: 120, aspectRatio: 1/1, borderRadius: 8, backgroundColor: Color.disabled}}>
                {userDetail.photoProfile === null ? (
                  <View
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                  >
                    <FontAwesome name='user-circle' size={80} />
                  </View>
                ) : (
                  <Image
                    source={{uri: userDetail.photoProfile}}
                    style={{height: 120, width: 120, borderRadius: 8}}
                  />
                )}
              </View>
              
              <View style={{width: '100%', marginTop: 8}}>
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
                    <FieldView>
                      <Text>{userDetail.firstName + userDetail.lastName}</Text>
                    </FieldView>
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
                    <FieldView>
                      <Text>{userDetail.email}</Text>
                    </FieldView>
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
                    <FieldView>
                      <Text>{userDetail.phoneNumber}</Text>
                    </FieldView>
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
                    <FieldView>
                      <Text>{userDetail.address}</Text>
                    </FieldView>
                  </EmailRoundedView>
                </View>
              </View>
            </View>

            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <Text style={{fontWeight: 'bold', paddingBottom: 4}}>
                CAR
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
                      TIPE MOBIL
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <FieldView>
                      <Text>{item.car_type}</Text>
                    </FieldView>
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
                    <FieldView>
                      <Text>{item.car_color}</Text>
                    </FieldView>
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
                    <FieldView>
                      <Text>{item.car_year}</Text>
                    </FieldView>
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
                    <FieldView>
                      <Text>{item.car_identity}</Text>
                    </FieldView>
                  </EmailRoundedView>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Divider />
      </ScrollView>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          borderTopWidth: 0.5,
          borderColor: Color.border,
        }}
      >
        {props.type === 'Anggota' ? (
          <View style={{flexDirection: 'row', width: '100%', height: 45}}>
            <TextInput
              placeholder='Input Nomor ID'
              placeholderTextColor={Color.gray}
              value={idNumber}
              onChangeText={val => setIdNumber(val)}
              style={{
                color: Color.text,
                fontSize: 14,
                fontFamily: 'Inter-Regular',
                width: '85%',
                backgroundColor: Color.semiwhite,
                borderRadius: 4,
                includeFontPadding: false,
                paddingLeft: 8,
              }}
            />

            <View
              style={{
                width: '15%',
                height: '100%',
                alignItems: 'flex-end',
              }}
            >
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
                    () => fetchUpdateMember(),
                  );
                }}
              >
                <Ionicons
                  name="save"
                  color={Color.theme}
                  size={16}
                />
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
                  () => fetchOrganizationMemberManage(item.id, item.user_id, 1),
                );
              }}
              style={{
                backgroundColor: Color.info,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
              }}>
              <Text color={Color.textInput}>Approve</Text>
            </TouchableOpacity>
            {props.type !== 'notAnggota' && <Divider />}
            {props.type !== 'notAnggota' && (
              <TouchableOpacity
                onPress={() => {
                  Alert(
                    'Tolak',
                    'Apakah Anda yakin akan menolak anggota ini?',
                    () => fetchOrganizationMemberManage(item.id, item.user_id, 2),
                  );
                }}
                style={{
                  backgroundColor: Color.error,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>Reject</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Scaffold>
  );
};

export default CardDetail;
