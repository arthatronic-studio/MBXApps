import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import {
  TouchableOpacity,
  HeaderBig,
  Loading,
  useLoading,
  useColor,
  Scaffold,
  Row,
  Col,
  Button,
} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SwiperComponent from './SwiperComponent';
import TempatTerdekat from './TempatTerdekat';
import LokerTersedia from './Loker';
import Promo from './Promo';
import Darurat from './Darurat';

const Home = () => {
  const {Color} = useColor();
  return (
    <Scaffold>
      <ScrollView>
        <View
          style={{
            backgroundColor: '#FDE4D2',
            width: '100%',
            height: '5.5%',
            position: 'absolute',
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: 50,
            paddingHorizontal: 20,
          }}>
          <View style={{width: '70%'}}>
            <Image
              source={ImagesPath.logoTribes}
              style={{
                resizeMode: 'contain',
                width: '70%',
                height: '100%',
                position: 'absolute',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '35%',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity style={{justifyContent: 'center'}}>
              <Ionicons
                name={'notifications-outline'}
                size={28}
                style={{color: Color.text, paddingHorizontal: 5}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center'}}>
              <Ionicons
                name={'chatbox-outline'}
                size={28}
                style={{color: Color.text, paddingHorizontal: 5}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center'}}>
              <Ionicons
                name={'person-outline'}
                size={28}
                style={{color: Color.text, paddingHorizontal: 5}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingVertical: 20}}>
          <Text
            style={{paddingHorizontal: 20, fontSize: 12, fontWeight: 'bold'}}>
            Halo,
          </Text>
          <Text
            style={{paddingHorizontal: 20, fontSize: 18, fontWeight: 'bold'}}>
            Adang Susanyo
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: 360,
              height: 80,
              borderRadius: 10,
              flexDirection: 'row',
              paddingHorizontal: 20,
              alignItems: 'center',
              elevation: 3,
            }}>
            <View style={{width: '50%'}}>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', color: Color.gray}}>
                Saldoku
              </Text>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                Rp. 200.000
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#F3771D',
                    borderRadius: 5,
                    marginHorizontal: 10,
                  }}>
                  <Ionicons
                    name={'add'}
                    size={28}
                    style={{
                      color: Color.textInput,
                      paddingHorizontal: 5,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#F3771D',
                    borderRadius: 5,
                    marginHorizontal: 10,
                  }}>
                  <AntDesign
                    name={'upload'}
                    size={22}
                    style={{
                      color: Color.textInput,
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color.gray,
                    width: 35,
                    borderRadius: 5,
                    marginHorizontal: 10,
                  }}>
                  <Entypo
                    name={'dots-three-vertical'}
                    size={20}
                    style={{
                      color: Color.textInput,
                      paddingHorizontal: 8,
                      paddingVertical: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  Top Up
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    paddingHorizontal: 11,
                    paddingVertical: 5,
                  }}>
                  Tarik
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  Lainnya
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: 360,
              height: 250,
              borderRadius: 10,
              elevation: 3,
              paddingHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3771D',
                  width: 40,
                  height: 40,
                  marginVertical: 20,
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Ionicons
                  name={'calendar-outline'}
                  size={26}
                  style={{color: Color.textInput}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3771D',
                  width: 40,
                  height: 40,
                  marginVertical: 20,
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <FontAwesome
                  name={'balance-scale'}
                  size={22}
                  style={{color: Color.textInput}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3771D',
                  width: 40,
                  height: 40,
                  marginVertical: 20,
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={'bell-check-outline'}
                  size={25}
                  style={{color: Color.textInput}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3771D',
                  width: 40,
                  height: 40,
                  marginVertical: 20,
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5
                  name={'hand-holding'}
                  size={26}
                  style={{color: Color.textInput}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: Color.gray,
                }}>
                Appointment
              </Text>
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: Color.gray,
                }}>
                Lelang
              </Text>
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: Color.gray,
                }}>
                Emergency
              </Text>
              <Text
                style={{
                  paddingHorizontal: 15,
                  fontSize: 14,
                  color: Color.gray,
                }}>
                NPL
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3771D',
                  width: 40,
                  height: 40,
                  marginVertical: 20,
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5
                  name={'file-invoice-dollar'}
                  size={24}
                  style={{color: Color.textInput}}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{
                  paddingHorizontal: 15,
                  fontSize: 14,
                  color: Color.gray,
                }}>
                Tagihan &
              </Text>
              <Text
                style={{
                  paddingHorizontal: 15,
                  fontSize: 14,
                  color: Color.gray,
                }}>
                isi ulang
              </Text>
            </View>
          </View>
        </View>

        <View style={{width: '100%', height: '8%'}}>
          <SwiperComponent />
        </View>
        <View style={{flexDirection: 'row', marginVertical: 40}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              width: '65%',
              paddingHorizontal: 15,
            }}>
            Tempat Terdekat
          </Text>
          <TouchableOpacity style={{flexDirection: 'row', paddingVertical: 3}}>
            <Text
              style={{
                color: Color.info,
                paddingHorizontal: 10,
              }}>
              Lihat Semua
            </Text>
            <Ionicons
              name={'arrow-forward'}
              size={20}
              style={{color: Color.info}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TempatTerdekat />
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}>
            Loker Tersedia
          </Text>
          <LokerTersedia />
        </View>
        <View>
          <Text
            style={{fontSize: 18, fontWeight: 'bold', paddingHorizontal: 15}}>
            Promo Terbaru
          </Text>
        </View>
        <View style={{width: '100%', height: '8%'}}>
          <Promo />
        </View>
        <View>
          <View>
            <TouchableOpacity style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '65%',
                  paddingHorizontal: 10,
                }}>
                Darurat Segera Dibantu
              </Text>
              <Text style={{color: Color.info, paddingHorizontal: 10}}>
                Lihat Semua
              </Text>
              <Ionicons
                name={'arrow-forward'}
                size={20}
                style={{color: Color.info}}
              />
            </TouchableOpacity>
          </View>
          <Darurat />
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default Home;
