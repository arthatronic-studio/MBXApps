import React,{useState, useEffect} from 'react';
import {View, Image, FlatList, StatusBar} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import {Scaffold, useColor, Header, Text, useLoading} from '@src/components';
import { Divider } from 'src/styled';
import {useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo'
import { queryGetDetailAuction } from 'src/lib/query/auction';
import Client from 'src/lib/apollo';
import {useIsFocused, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {FormatMoney} from 'src/utils';
import ImageSlider from '../../components/ImageSlider';

const DetailLelang = ({ navigation, route }) => {
  const [product, setProduct] = useState();
  const [detail, setDetail] = useState();
  const [image, setImage] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [hoursLeft, setHourssLeft] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [weeksLeft, setWeeksLeft] = useState(0);
  const [monthsLeft, setMonthsLeft] = useState(0);
  const [yearsLeft, setYearsLeft] = useState(0);
  // 
  const [isWillCome, setIsWillCome] = useState(false);
  const [isOnGoing, setIsOnGoing] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [isLoading, setIsLoading] = useState(true);
  const loading = useSelector(state => state['user.auth'].loading);
  const isFocused = useIsFocused();
  const {Color} = useColor();

  const { item, myAuction } = route.params;
  const { id } = item;
  
  useEffect(() => {
    const interval = product ?
      setInterval(() => {
        const now = moment();
        const _isWillCome = moment(product.dateStart).isAfter(now);
        const _isOnGoing = moment(product.dateEnd).isAfter(now);
        const _isPassed = moment(product.dateEnd).isBefore(now);
        console.log('////////////////////////');
        console.log('akan datang', _isWillCome);
        console.log('sedang berlangsung', _isOnGoing);
        console.log('telah lewat', _isPassed);
        console.log('////////////////////////');
        setIsWillCome(_isWillCome);
        setIsOnGoing(!_isWillCome && _isOnGoing);
        setIsPassed(_isPassed);
        const issueDate = _isWillCome ? moment(product.dateStart) : moment(product.dateEnd);
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
  }, [product]);

  useEffect(() => {
    getDetailLelang();
  }, [isFocused]);

  const getDetailLelang = () => {
    const variables = {
      auctionProductId: id
    };

    Client.query({
      query: queryGetDetailAuction,
      variables: {
        auctionProductId: id
      },
    }).then(res => {
      console.log('Try Data', res.data.auctionProductDetail);

      let listImage = [];
      if (res.data.auctionProductDetail){
        setDetail(res.data.auctionProductDetail.product)
        setProduct(res.data.auctionProductDetail)
        setImage(res.data.auctionProductDetail.product.imageProducts)
      }

      console.log("Ini Image", listImage)
    }).catch((err) => {
      console.log('err', err);
      setIsLoading(false);
    })
  }
  const renderItem = ({item}) => (
    
    <View>
      <Image source={item.imageProducts}/>
    </View>
  );

  return (
    <Scaffold
      header={
        <Header
          type="regular"
          color={Color.text}
          centerTitle={false}
          customIcon
          // actions={
          //   <>
          //     <Entypo name={'dots-three-vertical'} size={20}/>
          //   </>
          // }
        />
      }>
      <ScrollView>
        <View
          style={{
            width: '100%',
            height: 80,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '60%',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <Text numberOfLines={3} size={18} type='bold' align='left'>
              {detail ? detail.name : "Loading"}
            </Text>
          </View>
          <View
            style={{
              width: '40%',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                backgroundColor: '#3C58C1',
                width: 90,
                height: 40,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text size={8} color={Color.textInput}>{isWillCome ? 'Dimulai Dalam' : 'Sisa Waktu'}</Text>
                <Text color={Color.textInput} size={12}>
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
              </View>
            </View>
          </View>
        </View>
        {/* Detail Harga */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: '40%',
              justifyContent: 'center',
            }}>
            <Text align='left' style={{fontSize: 10, color: Color.secondary}}>
            Harga Tertinggi
            </Text>
            <Divider height={1} />
            <Text size={18} type='bold' align='left'>
              {product ? FormatMoney.getFormattedMoney(product.buyNowPrice) : "Loading"}
            </Text>
          </View>
          <View style={{width: '60%', justifyContent: 'center'}}>
            <Text align='left' style={{fontSize: 10, color: Color.secondary}}>
              Harga Buka
            </Text>
            <Divider height={1} />
            <Text size={14} align='left'>
              {product ? FormatMoney.getFormattedMoney(product.startPrice) : "Loading"}
            </Text>
          </View>
        </View>
        {/* Jenis Barang */}
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <View
            style={{
              width: '94%',
              height: 60,
              backgroundColor: Color.semiwhite,
              flexDirection: 'row',
              borderRadius: 5
            }}>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray} align='left'>Jenis Barang</Text>
              <Divider height={1}/>
              <Text size={11} type='bold' align='left'>{detail ? detail.categoryFreeText : null}</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jumlah</Text>
              <Divider height={1}/>
              <Text size={11} type='bold'>{detail ? detail.stock : "Loading"} Unit</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Text size={10} color={Color.gray}>Jam Mulai</Text>
              <Divider height={1}/>
              <Text size={11} type='bold'>{product ? moment(product.dateStart).format("HH:mm") : ""} WIB</Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
               <Text size={10} color={Color.gray}>Durasi</Text>
              
              <Divider height={1}/>
              <Text>
                {product ? moment.duration(product.duration, 'seconds').humanize() : '-'}
              </Text>
            </View>
          </View>
        </View>
        {/* Foto Produk */}
        
        <View
            style={{
              marginVertical: 10,
              width: '95%',
              alignSelf: 'center',
              aspectRatio: 6/6,
            }}>
            <ImageSlider
              data={image ? image: [detail.imageUrl, detail.imageUrl, detail.imageUrl]}
            />
          </View>
        {/* Deskripsi */}
        <View
          style={{
            width: '100%',
            height: 20,
            paddingHorizontal: 15,
          }}
        >
          <Text
            color={Color.gray}
            align='left'
            size={10}
          >
            Deskripsi
          </Text>
        </View>
        <View style={{width: '100%', marginTop: 3, paddingHorizontal: 16}}>
          <Text
            align='left'
            lineHeight={20}
          >
           {product ? product.description : ""}
          </Text>
        </View>
      </ScrollView>

      {/* hide beli langsung */}
      {/* { &&
        <View>
          <Text style={{fontSize: 10, fontWeight: 'bold', marginVertical: 5}}>Males Ikutan Lelang?</Text>
          <TouchableOpacity
            // onPress={alert("id : "+ item.product.id)}
            style={{
              width: '92%',
              height: 45,
              backgroundColor: Color.theme,
              borderWidth: 1,
              borderColor: Color.primary,
              borderRadius: 30,
              marginHorizontal: 15,
              paddingVertical: 10,
              marginVertical: 5
            }}>
            <Text color={Color.primary} style={{fontSize: 14}}>
              Beli Langsung Aja
            </Text>
          </TouchableOpacity>
        </View>} */}
        
        {!myAuction && isOnGoing &&
          <View>
            <TouchableOpacity
              disabled={!product || timeLeft === 0}
              onPress={() => navigation.navigate('JoinLelang', { item: product })}
              style={{
                width: '92%',
                height: 45,
                backgroundColor: Color.primary,
                borderRadius: 30,
                marginHorizontal: 15,
                paddingVertical: 10,
                marginVertical: 10
              }}>
              <Text color={Color.textInput} >
                Ikuti Lelang
              </Text>
            </TouchableOpacity>
          </View>
        }
    </Scaffold>
  );
};

export default DetailLelang;
