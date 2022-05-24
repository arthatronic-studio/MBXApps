import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';

import {Text, useColor} from '@src/components';
import {Divider} from 'src/styled';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagesPath from 'src/components/ImagesPath';
import {mutationDeleteAuction} from 'src/lib/query/auction';
import Client from '@src/lib/apollo';

const CardMyAuction = ({item, onDelete}) => {
  const {Color} = useColor();
  const [timeLeft, setTimeLeft] = useState(0);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSuccess, setModalSuccess] = useState(false);
  let remainingTime = 0;
  if (item.auctionStatus === 'BELUM SELESAI') {
    // remainingTime = moment(new Date("2022-05-04 02:00:00") - new Date()).format("hh:mm");
    remainingTime = moment(new Date(item.dateEnd)).fromNow('HH:mm');
  }

  useEffect(() => {
    if (item.auctionStatus == 'BELUM SELESAI') {
      const interval = setInterval(() => {
        const endDate = moment(item.dateEnd);
        const tl = moment(endDate).diff(moment(), 'seconds');
        if (tl > 0) {
          setTimeLeft(tl);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  const onPressDelete = () => {
    const variables = {
      auctionId: item.id,
    };
    Client.mutate({
      mutation: mutationDeleteAuction,
      variables,
    })
      .then(res => {
        console.log('res', res);
        if (res.data.auctionDeleteProduct.success) {
          setModalSuccess(true);
          setTimeout(() => {
            setModalSuccess(false);
            onDelete(item.id);
          }, 3000);
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: Color.theme,
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 16,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: item.product.imageUrl}}
            style={{height: 48, aspectRatio: 1, borderRadius: 5}}
          />
          <View
            style={{
              marginLeft: 16,
              flexDirection: 'column',
              maxWidth: '70%',
            }}>
            <Text
              style={{fontWeight: 'bold', textAlign: 'left'}}
              numberOfLines={2}>
              {item.product.name}
            </Text>
            <Divider height={10} />
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 8,
                    color: Color.secondary,
                  }}>
                  Tanggal Lelang
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 10,
                    textAlign: 'left',
                  }}>
                  {moment(item.dateStart).format('DD MMM YYYY')}
                </Text>
              </View>
              <Divider width={16} />
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 8,
                    color: Color.secondary,
                  }}>
                  Durasi Lelang
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 10,
                    textAlign: 'left',
                  }}>
                  {item.duration} Menit
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              item.auctionStatus === 'BELUM SELESAI' ? '#3C58C1' : '#07181F',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            alignSelf: 'flex-start',
          }}>
          <Text style={{fontSize: 8, color: Color.textInput}}>
            {item.auctionStatus === 'BELUM SELESAI'
              ? moment
                  .duration(timeLeft, 'seconds')
                  .format('HH:mm:ss', {trim: false})
              : item.auctionStatus}
          </Text>
        </View>
      </View>
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{fontSize: 8, color: Color.secondary, textAlign: 'left'}}>
            Harga Awal
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 10, textAlign: 'left'}}>
            {item.startPrice.toLocaleString().replace(/,/g, '.')} Poin
          </Text>
        </View>
        {item.auctionStatus === 'BELUM MULAI' ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              style={{
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Color.theme,
              }}>
              <Text size={12} color={Color.danger}>
                Hapus
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddProductAuctionSecond', {
                  item: item.product,
                  edit: item,
                })
              }
              style={{
                paddingVertical: 8,
                paddingHorizontal: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Color.primary,
                borderWidth: 1,
                borderColor: Color.primary,
                borderRadius: 20,
              }}>
              <Text size={12} color={Color.textInput}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DetailLelang', { item });
            }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.theme,
              borderWidth: 1,
              borderColor: Color.primary,
              borderRadius: 20,
            }}>
            <Text size={12} color={Color.primary}>
              Lihat
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: Color.textInput,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            color={Color.danger}
            size={54}
          />
          <Divider height={12} />
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            Yakin ingin menghapus lelang?
          </Text>
          <Divider height={8} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '80%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible);
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: Color.disabled,
                borderRadius: 120,
              }}>
              <Text>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible);
                onPressDelete();
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: Color.primary,
                borderRadius: 120,
              }}>
              <Text>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isModalSuccess}>
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
            Lelang berhasil dihapus
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default CardMyAuction;
