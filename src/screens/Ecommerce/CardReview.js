import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput as TextInputs,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagesPath from 'src/components/ImagesPath';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

let rate = 4;

const CardReview = ({data}) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();
  const onSelect = item => {
    setSelectedItem(item);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {}, []);

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          width: '92%',
          padding: 10,
          borderRadius: 8,
          backgroundColor: Color.textInput,
          ...shadowStyle,
          marginBottom: 13,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{ uri: data.image }}
              style={{
                borderRadius: 20,
                marginRight: 8,
                height: 32,
                width: 32,
                backgroundColor: Color.grayLight,
              }}
            />
            <Text size="11" type="bold">
              {data.firstName  + ' ' + data.lastName}
            </Text>
          </View>
          <Image source={ImagesPath.DotsThree} />
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: Color.border,
            alignSelf: 'center',
            marginVertical: 16,
          }}></View>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: data.imageProduct}}
            style={{
              marginRight: 16,
              height: 48,
              width: 48,
              borderRadius: 4,
              backgroundColor: Color.grayLight,
            }}
          />
          <View>
            <Text type="bold">{data.nameProduct}</Text>
            <View
              style={{flexDirection: 'row', marginTop: 4, marginBottom: 10}}>
              {data.rating > 4 && <Image source={ImagesPath.starRate} />}
              {data.rating > 3 && <Image source={ImagesPath.starRate} />}
              {data.rating > 2 && <Image source={ImagesPath.starRate} />}
              {data.rating > 1 && <Image source={ImagesPath.starRate} />}
              {data.rating > 0 && <Image source={ImagesPath.starRate} />}
              {/* {data.rating < 5 &&<Image source={ImagesPath.starUnrate} />}
              {data.rating < 4 &&<Image source={ImagesPath.starUnrate} />}
              {data.rating < 5 &&<Image source={ImagesPath.starUnrate} />}
              {data.rating < 5 &&<Image source={ImagesPath.starUnrate} />} */}
            </View>
            <Text align="left">{data.ulasan}</Text>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'flex-end',
            marginTop: 16,
          }}>
          <TouchableOpacity
            style={{
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 2,
              borderColor: Color.primary,
              marginLeft: 20,
            }}>
            <TouchableOpacity>
              <Text size="12" type="bold" style={{color: Color.primary}}>
                Balas Ulasan
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardReview;
