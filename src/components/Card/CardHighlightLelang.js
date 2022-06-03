import React,{useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Text,
  useColor,
} from '@src/components';
import { Divider } from 'src/styled';
import { useNavigation } from '@react-navigation/native';
import { queryGetAuction } from 'src/lib/query/auction';
import { FormatMoney } from 'src/utils';
import Client from '@src/lib/apollo';
import { shadowStyle } from 'src/styles';
import ScreenEmptyData from '../Modal/ScreenEmptyData';
import PostingHeader from '../Posting/PostingHeader';
import { initialItemState } from 'src/utils/constants';
import ScreenIndicator from '../Modal/ScreenIndicator';
import moment from 'moment';


const CardHighlightLelang = ({item, index, color, type}) => {
  const navigation = useNavigation();
  const {Color} = useColor();

  const [isWillCome, setIsWillCome] = useState(false);
  const [isOnGoing, setIsOnGoing] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [hoursLeft, setHourssLeft] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [weeksLeft, setWeeksLeft] = useState(0);
  const [monthsLeft, setMonthsLeft] = useState(0);
  const [yearsLeft, setYearsLeft] = useState(0);

  useEffect(() => {
    const interval = item ?
      setInterval(() => {
        const now = moment();
        const _isWillCome = moment(item.dateStart).isAfter(now);
        const _isOnGoing = moment(item.dateEnd).isAfter(now);
        const _isPassed = moment(item.dateEnd).isBefore(now);
        console.log('////////////////////////');
        console.log('akan datang', _isWillCome);
        console.log('sedang berlangsung', _isOnGoing);
        console.log('telah lewat', _isPassed);
        console.log('////////////////////////');
        setIsWillCome(_isWillCome);
        setIsOnGoing(!_isWillCome && _isOnGoing);
        setIsPassed(_isPassed);
        const issueDate = _isWillCome ? moment(item.dateStart) : moment(item.dateEnd);
        const tl = issueDate.diff(now, 'seconds');
        const minl = issueDate.diff(now, 'minutes');
        const hl = issueDate.diff(now, 'hours');
        const dl = issueDate.diff(now, 'days');
        const wl = issueDate.diff(now, 'weeks');
        const ml = issueDate.diff(now, 'months');
        const yl = issueDate.diff(now, 'years');
        // TODO: bukain buat semua status
        // if (tl > 0 && product.auctionStatus == 'BELUM SELESAI') {
        setTimeLeft(tl > 0 ? tl : 0);
        setMinutesLeft(minl > 0 ? minl : 0);
        setHourssLeft(hl > 0 ? hl : 0);
        setDaysLeft(dl > 0 ? dl : 0);
        setWeeksLeft(wl > 0 ? wl : 0);
        setMonthsLeft(ml > 0 ? ml : 0);
        setYearsLeft(yl > 0 ? yl : 0);
      }, 1000) : null;

    return () => clearInterval(interval);
  }, [item]);

  if(timeLeft<=0){
    return(
      <>
      </>
    )
  }

  return(
    <View
      key={index}
      style={{
        width: '45%',
        height: 260,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Color.textInput,
          borderRadius: 10,
          paddingVertical: 10,
          marginHorizontal: 5,
          paddingHorizontal: 10,
          ...shadowStyle,
        }}
        onPress={() => {
          navigation.navigate('DetailLelang', { item })
        }}
      > 
        <Image
          source={{ uri: item.product.imageUrl }}
          style={{
            width: 160,
            height: 150,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />

        <View
          style={{
            width: '17%',
            position: 'absolute',
            marginVertical: 14,
            marginHorizontal: 14,
          }}>
            {/* <TouchableOpacity
              style={{
                width: 53,
                height: 23,
              }}> */}
              <View>
                <View
                  style={{
                    backgroundColor: color,
                    width: 60,
                    height: 23,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {type === 'WILLCOME' ? 
                    <Text color={Color.textInput} size={10}>
                      {
                        moment(item.dateStart).format('DD MMM') 
                      }
                    </Text>
                  :
                    <Text color={Color.textInput} size={10}>
                    {                      
                      yearsLeft > 0 ? `${yearsLeft} Tahun lagi` :
                      monthsLeft > 0 ? monthsLeft + ' Bulan lagi' :
                      weeksLeft > 0 ? weeksLeft + ' Minggu lagi' :
                      daysLeft > 0 ? daysLeft + ' Hari lagi' :
                      hoursLeft > 0 ? moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false }) :
                      minutesLeft > 0 ? moment.duration(timeLeft, 'seconds').format('mm:ss', { trim: false }) :
                      timeLeft > 0 ? moment.duration(timeLeft, 'seconds').format('ss', { trim: false }) :
                      isPassed ? 'Waktu habis' : '-'
                    }
                    </Text>
                  }
                </View>
              </View>
            {/* </TouchableOpacity> */}
        </View>

        <View
          style={{
            width: '100%',
            height: '45%',
          }}>
          <View style={{paddingVertical: 8}}>
            <Text numberOfLines={1}  align='left' type='bold'>{item.product.name}</Text>
          </View>
          <View style={{marginVertical: 5}}>
            <Text align='left' size={8} color={Color.disabled}>Harga Awal</Text>
            <Divider height={4} />
            <Text align='left' type='bold'>{FormatMoney.getFormattedMoney(item.startPrice)} <Text size={8}>Poin</Text></Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardHighlightLelang;