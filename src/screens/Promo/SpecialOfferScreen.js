import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useColor, Header, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {Row, Divider, Container, Line} from 'src/styled';
import {initialItemState, statusBarHeight} from 'src/utils/constants';
import imageAssets from 'assets/images';

const SpecialOfferScreen = ({navigation, route}) => {
  const { params } = route;

  console.log('params', params);

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const [itemData, setItemData] = useState({ ...initialItemState, data: params.listPromo });
  const {width} = useWindowDimensions();

  const cardPromo = item => (
    <Container paddingVertical={12}>
      <Container
        paddingHorizontal={16}
        flex={1}
        flexDirection="row"
        justify="space-between"
        align="center">
        <Container flexDirection="row" align="center">
          <View style={{width: width * 0.08, height: width * 0.08}}>
            <Image
              source={imageAssets.aboutFest1}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 4,
              }}
            />
          </View>
          <Divider width={10} />
          <View>
            <Text size={12} align='left' numberOfLines={1} lineHeight={14.4} type="medium">
              {item.title}
            </Text>
            <Text size={10} align='left' numberOfLines={1} lineHeight={12} type="medium">
              {item.period_of_use}
            </Text>
          </View>
        </Container>
      </Container>

      <Divider height={10} />

      <Line width={width} height={1} color={Color.black} />

      <View
        style={{
          width: width,
          height: width * 0.56,
        }}>
        <Image
          style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          source={{ uri: item.image }}
        />
      </View>

      <Line width={width} height={1} color={Color.black} />

      <Divider height={10} />
      
      <Container paddingHorizontal={16} flex={1}>
        <Text
          size={17}
          type="medium"
          color={Color.black}
          lineHeight={20.4}
          align="left">
          {item.description}
        </Text>

        <Divider height={10} />

        <TouchableOpacity
          onPress={() => navigation.navigate('SpecialOfferDetail', { item })}
          style={{
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: Color.primary,
          }}>
          <Text size={14} lineHeight={16.8} color={Color.primary} type="medium">
            Detail
          </Text>
        </TouchableOpacity>
      </Container>
    </Container>
  );

  return (
    <Scaffold
      header={<Header centerTitle={false} title="Special Offer" />}>
      <FlatList
        keyExtractor={(item, index) => item.toString() + index}
        data={itemData.data}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: statusBarHeight,
        }}
        renderItem={({item, index}) => cardPromo(item)}
        ListHeaderComponent={() => (
          <Line width={width} height={1} color={Color.black} />
        )}
        ListFooterComponent={() => (
          <Line width={width} height={1} color={Color.black} />
        )}
        ItemSeparatorComponent={() => (
          <Line width={width} height={1} color={Color.black} />
        )}
      />
    </Scaffold>
  );
};

export default SpecialOfferScreen;
