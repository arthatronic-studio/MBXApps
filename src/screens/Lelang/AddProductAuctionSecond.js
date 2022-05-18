import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import {TextInputMask} from 'react-native-masked-text';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import {FormatMoney} from '@src/utils';
import {Divider, Circle, Container, Row} from '@src/styled';
import Client from '@src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';
import ModalDropDown from 'src/components/Modal/ModalDropDown';
import ModalNominalPicker from 'src/components/Modal/ModalNominalPicker';
import Modal from 'react-native-modal';
import {mutationCrateAuction} from 'src/lib/query/auction';
import Moment from 'moment';

const AddProductAuctionSecond = ({navigation, route}) => {
  const {Color} = useColor();
  const {width, height} = useWindowDimensions();
  const {item} = route.params;
  console.log(item);
  const modalDropDownRef = useRef();
  const modalNominalPickerRef = useRef();
  const amountPrice = useRef();
  const dateRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quickAccess, setQuickAccess] = useState([50, 100, 250]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setTimeout(() => {
      setModalVisible(!isModalVisible);
      navigation.popToTop();
      navigation.navigate('MyAuction');
    }, 3000);
  };

  const onDurationChange = value => {
    setDuration(value);
    modalDropDownRef.current.close();
  };

  const onSubmitQuickAccess = value => {
    setQuickAccess(
      value.sort(function (a, b) {
        return a - b;
      }),
    );
    modalNominalPickerRef.current.close();
  };

  const onSubmit = () => {
    if (
      date.length != 0 &&
      time.length != 0 &&
      duration != 0 &&
      description.length != 0 &&
      price != 0 &&
      quickAccess.length != 0
    ) {
      const variables = {
        productId: item.id,
        dateStart: Moment(dateRef.current.getRawValue()).format('YYYY-MM-DD'),
        timeStart: time,
        timeDuration: duration,
        description: description,
        startPrice: amountPrice.current.getRawValue(),
        buyNowPrice: amountPrice.current.getRawValue(),
        quantity: 1,
        bidNominal: quickAccess,
        status: 'OPENFORBID',
      };
      console.log(variables, 'variable');

      Client.mutate({
        mutation: mutationCrateAuction,
        variables,
      })
        .then(res => {
          console.log('res', res);
          toggleModal();
        })
        .catch(err => {
          console.log('error', err);
        });
    } else {
      alert('Semua field harus diisi');
    }
  };

  return (
    <Scaffold
      header={
        <Header
          title={'Tambah Barang Lelang'}
          customIcon
          type="bold"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <ScrollView style={{paddingHorizontal: 16}}>
        <View
          style={{
            backgroundColor: Color.theme,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          <Image source={ImagesPath.two} style={{width: 40, height: 40}} />
          <View
            style={{flexDirection: 'column', marginLeft: 8, width: width - 80}}>
            <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'left'}}>
              Hampir Selesai
            </Text>
            <Divider height={2} />
            <Text
              style={{
                lineHeight: 15,
                fontSize: 10,
                color: Color.secondary,
                textAlign: 'left',
              }}>
              Masukkan jadwal lelang, harga, dan informasi lainnya tentang
              lelang ini.
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: Color.border,
            width: '100%',
            borderRadius: 10,
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
          <Image
            source={{uri: item.imageUrl}}
            style={{height: 60, aspectRatio: 1, borderRadius: 10}}
          />
          <Divider width={16} />
          <View style={{flexDirection: 'column', width: width - 128}}>
            <Text
              style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}
              numberOfLines={2}>
              {item.name}
            </Text>
            <Divider height={16} />
            <Text
              style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>
              Harga saat ini
            </Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left'}}>
              {FormatMoney.getFormattedMoney(item.price)}
            </Text>
          </View>
        </View>

        <View style={{width: '100%'}}>
          <Text
            style={{
              marginVertical: 14,
              position: 'absolute',
              fontSize: 6,
              marginHorizontal: 10,
              color: Color.secondary,
            }}>
            Tanggal Mulai Lelang
          </Text>
          <TextInputMask
            ref={dateRef}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={date}
            onChangeText={text => setDate(text)}
            placeholder={'dd/mm/yyyy'}
            style={{
              ontSize: 12,
              paddingHorizontal: 10,
              paddingTop: 16,
              borderWidth: 1,
              borderColor: Color.border,
              width: '100%',
              alignSelf: 'center',
              height: 45,
              borderRadius: 5,
              marginVertical: 10,
            }}
          />
          <Fontisto
            name={'date'}
            style={{
              position: 'absolute',
              marginVertical: 30,
              right: 10,
              marginHorizontal: 10,
            }}
            color={Color.secondary}
          />
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: Color.border,
              borderRadius: 5,
              flexDirection: 'column',
              width: '48%',
            }}>
            <Text align="left" size={8} color={Color.secondary}>
              Jam Mulai
            </Text>
            <TextInputMask
              type={'datetime'}
              options={{
                format: 'HH:mm',
              }}
              value={time}
              onChangeText={text => setTime(text)}
              placeholder={'00:00'}
              style={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                fontSize: 14,
              }}
            />
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: Color.border,
              borderRadius: 5,
              flexDirection: 'column',
              width: '48%',
            }}>
            <Text align="left" size={8} color={Color.secondary}>
              Durasi
            </Text>
            <Divider height={4} />
            <TouchableOpacity
              onPress={() => modalDropDownRef.current.open()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text size={14}>
                {duration ? duration + ' Menit' : 'Pilih Durasi'}
              </Text>
              <IonIcons
                name="chevron-down-outline"
                color={Color.text}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{width: '100%', marginVertical: 10}}>
          <Text
            style={{
              marginVertical: 5,
              position: 'absolute',
              fontSize: 6,
              marginHorizontal: 10,
              color: Color.secondary,
            }}>
            Deskripsi
          </Text>
          <TextInput
            placeholder={'Tuliskan sesuatu tentang ini . . .'}
            style={{
              fontSize: 12,
              paddingHorizontal: 10,
              paddingTop: 16,
              borderWidth: 1,
              borderColor: Color.border,
              width: '100%',
              alignSelf: 'center',
              minHeight: 95,
            }}
            multiline
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </View>

        <View
          style={{
            width: '100%',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: Color.border,
            borderRadius: 5,
            flexDirection: 'column',
          }}>
          <Text size={8} align="left">
            Harga awal
          </Text>
          <Divider height={4} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInputMask
              ref={amountPrice}
              type={'money'}
              options={{
                precision: 0,
                separator: ',',
                delimiter: '.',
                unit: '',
                suffixUnit: '',
              }}
              value={price}
              onChangeText={value => setPrice(value)}
              placeholder={'0'}
              style={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                fontSize: 14,
                maxWidth: '90%',
              }}
            />
            <Text size={14} color={Color.text}>
              Poin
            </Text>
          </View>
        </View>

        <Divider height={5} />

        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <IonIcons name={'information-circle-outline'} color={'#2C70F7'} />
          <Divider width={5} />
          <Text size={8} color={Color.secondary}>
            Harga akhir lelang nantinya akan dikonversikan kedalam rupiah
          </Text>
        </View>

        <Divider height={17} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text align="left" size={10} color={Color.secondary}>
            Nominal Kelipatan Biding
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => modalNominalPickerRef.current.open()}>
            <Text size={10} color={Color.primary}>
              Tambah Nominal Kelipatan
            </Text>
          </TouchableOpacity>
        </View>

        <Divider height={6} />

        {quickAccess ? (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              width: '100%',
              flexWrap: 'wrap',
            }}>
            {quickAccess.map((item, idx) => (
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 120,
                  backgroundColor: Color.grayLight,
                  marginBottom: 10,
                  marginRight: 10,
                }}>
                <Text size={14} color={Color.text}>
                  {item.toLocaleString().replace(/,/g, '.')} Poin
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              width: '100%',
              backgroundColor: Color.border,
              height: 60,
            }}>
            <Text size={10} color={Color.secondary}>
              Nominal bidding belum diatur bro
            </Text>
          </View>
        )}
      </ScrollView>

      <Row
        style={{
          backgroundColor: Color.theme,
          height: 60,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => onSubmit()}
          style={{
            backgroundColor: Color.primary,
            width: '100%',
            height: '65%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text
            style={{marginHorizontal: 5, fontSize: 12, color: Color.textInput}}>
            Lanjutkan
          </Text>
        </TouchableOpacity>
      </Row>

      {/* Modal */}
      <ModalDropDown
        ref={modalDropDownRef}
        selectedValue={duration}
        onPress={value => onDurationChange(value)}
      />
      <ModalNominalPicker
        ref={modalNominalPickerRef}
        data={quickAccess}
        onSubmit={value => onSubmitQuickAccess(value)}
      />
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: Color.textInput,
            borderRadius: 20,
            paddingTop: 33,
            paddingHorizontal: 24,
            paddingBottom: 24,
            alignItems: 'center',
          }}>
          <Image source={ImagesPath.checkCircle} size={54} />
          <Divider height={25} />
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            Barang Berhasil Ditambahkan
          </Text>
        </View>
      </Modal>
    </Scaffold>
  );
};

export default AddProductAuctionSecond;
