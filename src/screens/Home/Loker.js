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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
  HeaderBig,
  Loading,
  useLoading,
  useColor,
  Scaffold,
  Row,
  Col,
  Button,
} from '@src/components';

const DATA = [
  {
    id: 1,
    position: 'UI UX Designer',
    company: 'PT. Informasi Cahata Utara',
    level: 'Fresh Graduate',
    location: 'Ciledug, Tangerang',
    image: ImagesPath.loker1,
  },
  {
    id: 2,
    position: 'UI UX Designer',
    company: 'PT. Informasi Cahata Utara',
    level: 'Fresh Graduate',
    location: 'Ciledug, Tangerang',
    image: ImagesPath.loker2,
  },
  {
    id: 3,
    position: 'UI UX Designer',
    company: 'PT. Informasi Cahata Utara',
    level: 'Fresh Graduate',
    location: 'Ciledug, Tangerang',
    image: ImagesPath.loker3,
  },
];

const LokerTersedia = () => {
  const {Color} = useColor();
  const renderItem = ({item}) => (
    <View
      style={{
        marginVertical: 15,
        marginHorizontal: 15,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: '99%',
          height: 120,
          elevation: 3,
          flexDirection: 'row',
          paddingVertical: 5,
        }}>
        <View>
          <Image
            source={item.image}
            style={{marginHorizontal: 15, marginVertical: 5}}
          />
        </View>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 3}}>
            {item.position}
          </Text>
          <Text style={{paddingVertical: 3}}>{item.company}</Text>
          <View style={{flexDirection: 'row'}}>
            <SimpleLineIcons
              name={'bag'}
              size={16}
              style={{paddingVertical: 3}}
            />
            <Text style={{paddingVertical: 2, paddingHorizontal: 8}}>
              {item.level}
            </Text>
          </View>
          <Text style={{paddingVertical: 3, color: Color.gray}}>
            {item.location}
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
      />
    </View>
  );
};

export default LokerTersedia;
