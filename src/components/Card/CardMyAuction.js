import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import {Text, useColor} from '@src/components';
import {Divider} from 'src/styled';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {ExternalStorageDirectoryPath} from 'react-native-fs';

const CardMyAuction = ({item}) => {
  const {Color} = useColor();
  const [timeLeft, setTimeLeft] = useState(0);
  console.log(item, 'item');
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
    </View>
  );
};

export default CardMyAuction;
