import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import {useColor} from '@src/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DATA = [
  {
    id: 1,
    nama: 'Janji Jiwa Allogio',
    image: ImagesPath.tempat1,
    lokasi: 'Medang, Kab. Tangerang',
    review: '4.5',
    comment: 32,
    view: 132,
  },
  {
    id: 2,
    nama: 'Es Teh Jiwa',
    image: ImagesPath.tempat2,
    lokasi: 'Medang, Kab. Tangerang',
    review: '4.5',
    comment: 32,
    view: 132,
  },
  {
    id: 3,
    nama: 'Janji Jiwa Allogio',
    image: ImagesPath.tempat1,
    lokasi: 'Medang, Kab. Tangerang',
    review: '4.5',
    comment: 32,
    view: 132,
  },
];

const TempatTerdekat = () => {
  const {Color} = useColor();
  const renderItem = ({item}) => (
    <View style={{marginVertical: 10}}>
      <TouchableOpacity
        style={{
          width: 250,
          height: 300,
          backgroundColor: 'white',
          elevation: 3,
          borderRadius: 9,
          marginHorizontal: 10,
        }}>
        <View>
          <Image
            source={item.image}
            style={{width: '100%', height: '70%', borderRadius: 10}}
          />
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
            {item.nama}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'normal',
              fontSize: 14,
              color: Color.gray,
              paddingVertical: 8,
            }}>
            {item.lokasi}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Entypo name={'star'} size={16} />
          <Text style={{paddingHorizontal: 10, color: Color.gray}}>
            {item.review}
          </Text>
          <MaterialCommunityIcons
            name={'comment-processing-outline'}
            size={16}
          />
          <Text style={{paddingHorizontal: 10, color: Color.gray}}>
            {item.comment}
          </Text>
          <FontAwesome name={'eye'} size={16} />
          <Text style={{paddingHorizontal: 10, color: Color.gray}}>
            {item.view}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
        horizontal
      />
    </View>
  );
};

export default TempatTerdekat;

const styles = StyleSheet.create({
  btnCategory: {
    width: '60%',
    height: '40%',
  },
});
