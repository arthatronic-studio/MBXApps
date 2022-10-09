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
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const [itemData, setItemData] = useState(initialItemState);
  const {width} = useWindowDimensions();

  useEffect(() => {
    setItemData({...itemData, data: [{id: 1}, {id: 1}, {id: 1}, {id: 1}]});
  }, []);

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
          <Text size={12} lineHeight={14.4} color={Color.black} type="medium">
            Titik Temu Coffee
          </Text>
        </Container>
        <Text size={10} type="medium" lineHeight={12} color="#ACAAA5">
          2d lalu
        </Text>
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
          source={imageAssets.arsitektur1}
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
          Weekend Time! Discount All Coffee Variant up to 40%
        </Text>
        <Divider height={8} />
        <Text
          size={12}
          lineHeight={19.2}
          color={Color.black}
          align="left"
          numberOfLines={3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Curabitur tempus urna at turpis condimentum
          lobortis. Ut commodo efficitur neque.
        </Text>
        <Divider height={10} />
        <TouchableOpacity
          onPress={() => navigation.navigate('SpecialOfferDetail')}
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
        // onEndReachedThreshold={0.3}
        // onEndReached={() => setItemData({...itemData, loadNext: true})}
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
