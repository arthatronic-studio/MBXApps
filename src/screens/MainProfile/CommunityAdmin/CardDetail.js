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
import Popup, {usePopup} from '@src/components/Modal/Popup';

import Client from '@src/lib/apollo';
import {queryJoinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {Container, Divider} from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { getSizeByRatio } from 'src/utils/get_ratio';
import { joinCommunityMember } from 'src/lib/query/joinCommunityMember';
import ModalInputText from 'src/components/ModalInputText';
import { fetchJoinCommunityMember } from 'src/api/community';
import { useSelector } from 'react-redux';

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
  const { params } = route;
  const isAdminPage = params && params.isAdminPage;

  const [item, setItem] = useState(params ? params.item : null);
  const [props, setProps] = useState(params ? params.props : '');
  const [userDetail, setUserDetail] = useState(params ? params.item.userDetail : null);
  const [idNumber, setIdNumber] = useState(params ? params.item.userDetail.idNumber : '');
  const [loading, setLoading] = useState(true);
  const [modalInputText, setModalInputText] = useState(false);

  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();
  const user = useSelector((state) => state['user.auth'].login.user);

  useEffect(() => {
    if (params) {
      setItem(params.item);
      setProps(params.props);
      setUserDetail(params.item.userDetail);
      setIdNumber(params.item.userDetail.idNumber);
      setLoading(false);
    } else {
      fetchAsync();
    }
  }, []);

  useEffect(() => {
    if (params && params.refresh) {
      navigation.setParams({
        refresh: false
      });
      fetchAsync();
    }
  }, [params]);
  
  const fetchAsync = async() => {
    const result = await fetchJoinCommunityMember({ userId: user.userId });
    if (result.status && result.data.length > 0) {
      setItem(result.data[0]);
      setUserDetail(result.data[0].userDetail);
      setIdNumber(result.data[0].userDetail.idNumber);
    }

    console.log('result', result);

    setLoading(false);
  }

  const fetchUpdateMember = item => {
    setLoading(true);

    Client.query({
      query: queryJoinCommunityManage,
      variables: {
        status: 1,
        id: item.id,
        customIdNumber: idNumber,
        organizationInitialCode: accessClient.InitialCode,
      },
    })
      .then((res) => {
        showPopup('Akun berhasil diubah', 'success');
        // fetchData();
        setLoading(false);
      })
      .catch((err) => {
        showPopup('catch', 'error');
        setLoading(false);
      });
  };

  const fetchJoinCommunityManage = (id, userId, status, reason_reject) => {
    setLoading(true);

    let resMessage =
      status === 1 ? 'Diterima' :
      status === 2 ? 'Ditolak' : 'Dihapus';

    const variables = {
      status,
      id,
      organizationInitialCode: accessClient.InitialCode,
      reason_reject,
    };

    console.log('variables', variables);

    Client.query({
      query: queryJoinCommunityManage,
      variables,
    })
      .then((res) => {
        console.log('res join', res);

        const data = res.data.joinCommunityManage;
        const success = data && data.id;

        if (success) {
          // fetchData();
          showPopup(`Akun berhasil ${resMessage}`, 'success');
        } else {
          showPopup(`Akun gagal ${resMessage}`, 'error');
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        showPopup(err.message, 'error');
        setLoading(false);
      });
  };

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

  return (
    <Scaffold
      headerTitle='Member Detail'
      fallback={loading}
      popupProps={popupProps}
    >
      {item && userDetail && <ScrollView>
        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 16,
            borderTopColor: Color.border,
            paddingHorizontal: 16,
          }}
        >
          <View style={{width: '100%'}}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingBottom: 16,
              }}>
              <Text style={{fontWeight: 'bold', paddingBottom: 10}}>
                MESSAGE
              </Text>
              <Text style={{fontWeight: 'bold', paddingBottom: 10}}>
                {item.reasonReject || '-'}
              </Text>

              <Divider />

              <Text style={{fontWeight: 'bold', paddingBottom: 10}}>
                PROFILE
              </Text>
              <View style={{height: width / 2, aspectRatio: 1, borderRadius: 8, backgroundColor: Color.disabled}}>
                {userDetail.photoProfile === null ? (
                  <View
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                  >
                    <FontAwesome name='user-circle' size={80} />
                  </View>
                ) : (
                  <Image
                    source={{uri: userDetail.photoProfile}}
                    style={{height: '100%', width: '100%', borderRadius: 8}}
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
                      Domisili
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <FieldView>
                      <Text>{item.userAddress ? item.userAddress.labelAddress + ' - ' + item.userAddress.provinceName : ''}</Text>
                    </FieldView>
                  </EmailRoundedView>
                </View>
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
                      <Text>{userDetail.firstName + ' ' + userDetail.lastName}</Text>
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
                      Ukuran Kemeja
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <FieldView>
                      <Text>{item.sizeShirt}</Text>
                    </FieldView>
                  </EmailRoundedView>
                </View>
              </View>
            </View>

            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingBottom: 16,
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

            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingBottom: 16,
              }}
            >
              <Text style={{fontWeight: 'bold', paddingTop: 8}}>
                NOTES
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
                      Alasan Gabung
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <FieldView>
                      <Text>{item.reason}</Text>
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
                      Deskripsi
                    </Text>
                  </LabelInput>
                  <EmailRoundedView>
                    <FieldView>
                      <Text>{item.note}</Text>
                    </FieldView>
                  </EmailRoundedView>
                </View>
              </View>
            </View>

            {renderFotoInfo('Tampilan Utama Mobil', item.car_photo_main)}
            {renderFotoInfo('Tampak Depan Mobil', item.car_photo_front)}
            {renderFotoInfo('Tampak Samping Mobil', item.car_photo_side)}
            {renderFotoInfo('Tampak Belakang Mobil', item.car_photo_back)}
            {renderFotoInfo('Foto Selfi', item.selfie_photo)}
            {renderFotoInfo('Foto STNK', item.stnk_photo)}
            {renderFotoInfo('Foto SIM', item.sim_photo)}
            {renderFotoInfo('Bukti Transaksi', item.transaction_proof)}
            
          </View>
        </View>

        <Divider />
      </ScrollView>}

      {isAdminPage ?
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
                    () => fetchJoinCommunityManage(item.id, item.user_id, 1),
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
                    setModalInputText(true);
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
        :
        <Container padding={16}>
          <Button
            onPress={() => navigation.navigate('JoinCommunity', { item, prevScreen: 'CardDetail' })}
          >
            Edit
          </Button>
        </Container>  
      }

      <ModalInputText
        visible={modalInputText}
        headerLabel='Reject'
        placeholder='Masukan penjelasan Anda'
        isTextArea
        onClose={() => setModalInputText(false)}
        onSubmit={(text) => {
          Alert(
            'Tolak',
            'Apakah Anda yakin akan menolak anggota ini?',
            () => fetchJoinCommunityManage(item.id, item.user_id, 2, text),
          );
          setModalInputText(false);
        }}
      />
    </Scaffold>
  );
};

export default CardDetail;
