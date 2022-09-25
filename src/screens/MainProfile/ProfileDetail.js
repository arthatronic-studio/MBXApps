import React, {useEffect, useState} from 'react';
import {useColor, Text, Header, Row, useLoading, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {ScrollView} from 'react-native-gesture-handler';
import {Divider, Container} from 'src/styled';
import {
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
  useWindowDimensions,
} from 'react-native';
import FormInput from 'src/components/FormInput';
import {useIsFocused} from '@react-navigation/native';
import imageAssets from 'assets/images';
import ImagesPath from 'src/components/ImagesPath';
import {useSelector} from 'react-redux';

const ProfileDetail = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading] = useLoading();
  const [loading, setLoading] = useState(false);
  const auth = useSelector(state => state['auth']);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const {width} = useWindowDimensions();

  const fetchData = async () => {
    const res = await fetchGetJobSetting();
    if (res.status) {
      setEmail(res.data.email);
      setPhone(res.data.phoneNumber);
    }
    setLoading(false);
  };

  useEffect(() => {
    // fetchData();
  }, [isFocused]);

  return (
    <Scaffold
      style={{backgroundColor: '#F4F4F4'}}
      loadingProps={loadingProps}
      header={<Header centerTitle={false} />}>
      <ScrollView>
        {loading ? (
          <Container
            style={{
              width: '100%',
              aspectRatio: 21 / 9,
              marginBottom: 16,
              marginRight: 16,
              backgroundColor: Color.textInput,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={Color.primary} />
            <Divider />
            <Text>Memuat</Text>
          </Container>
        ) : (
          <>
            <View
              style={{
                width: width,
                height: width / 2,
              }}>
              <Image
                source={auth && auth.user && auth.user.foto_sampul ? {uri: auth.user.foto_sampul } : imageAssets.defaultSampul}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            </View>
            <Divider height={16} backgroundColor={Color.theme} width={width}/>
            <Container paddingHorizontal={16} backgroundColor={Color.theme}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {auth && auth.user && (
                  <Image
                    source={
                      auth.user.foto
                        ? {uri: auth.user.foto}
                        : ImagesPath.userChat
                    }
                    style={{
                      width: width * 0.16,
                      height: width * 0.16,
                      backgroundColor: Color.border,
                      borderRadius: 50,
                    }}
                  />
                )}

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ChangeProfile');
                  }}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderColor: Color.text,
                    borderWidth: 0.5,
                    borderRadius: 120,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                    }}>
                    <Image
                      source={imageAssets.edit}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <Divider width={8} />
                  <Text size={12} type="medium" color={Color.primaryDark}>
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </Container>
            <Divider height={10} backgroundColor={Color.theme} width={width}/>
            {auth && auth.user && (
              <View
                style={{
                  backgroundColor: Color.theme,
                  flex: 1,
                  paddingHorizontal: 16,
                  alignItems: 'flex-start',
                }}>
                <Text
                  size={22}
                  align="left"
                  lineHeight={28}
                  numberOfLines={2}
                  color={Color.black}>
                  {auth.user.name}
                </Text>
              </View>
            )}
            <Divider height={10} backgroundColor={Color.theme} width={width}/>
            <Container paddingHorizontal={16} flex={1} flexDirection="column" backgroundColor={Color.theme}>
              <Container flex={1} flexDirection="row">
                <Container flex={1} flexDirection="column">
                  <Text align="left" size={10} color={'#ACAAA5'}>
                    No. Telpon
                  </Text>
                  <Text align="left" size={14} color={Color.black}>
                    {auth && auth.user && auth.user.phone ? auth.user.phone : '-'}
                  </Text>
                </Container>
                <Container flex={1} flexDirection="column">
                  <Text align="left" size={10} color={'#ACAAA5'}>
                    Email
                  </Text>
                  <Text align="left" size={14} color={Color.black}>
                    {auth && auth.user && auth.user.email ? auth.user.email : '-'}
                  </Text>
                </Container>
              </Container>
              <Divider height={10}/>
              <Container flex={1} flexDirection="row">
                <Container flex={1} flexDirection="column">
                  <Text align="left" size={10} color={'#ACAAA5'}>
                    Jenis Kelamin
                  </Text>
                  <Text align="left" size={14} color={Color.black}>
                    {auth && auth.user && auth.user.dob ? auth.user.dob : '-'}
                  </Text>
                </Container>
              </Container>
            </Container>
          </>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default ProfileDetail;
