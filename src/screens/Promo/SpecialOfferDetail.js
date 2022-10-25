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
import {ScrollView} from 'react-native-gesture-handler';

const SpecialOfferDetail = ({navigation, route}) => {
  const { params } = route;

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const [itemData, setItemData] = useState(initialItemState);
  const {width} = useWindowDimensions();

  return (
    <Scaffold>
      <ScrollView>
        <Line width={width} height={1} color={Color.black} />
        <Divider height={12} />
        <Container paddingHorizontal={16}>
          <Text
            size={17}
            type="medium"
            color={Color.black}
            lineHeight={20.4}
            align="left">
            {params.item.title}
          </Text>
        </Container>
        <Divider height={12} />
        <View
          style={{
            width: width,
            height: width * 0.56,
          }}>
          <Image
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            source={{ uri: params.item.image }}
          />
        </View>
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text align="left" size={10} lineHeight={12} color={Color.textSoft}>
            Description
          </Text>
          <Text align="left" size={12} lineHeight={19.2} color={Color.black}>
            {params.item.description}
          </Text>
          <Divider height={16} />
          <Text align="left" size={10} lineHeight={12} color={Color.textSoft}>
            Term & Conditions
          </Text>
          <Text align="left" size={12} lineHeight={19.2} color={Color.black}>
            {params.item.term_and_condition}
          </Text>
        </Container>

        <Divider height={16}/>

        <Container
          marginHorizontal={16}
          padding={10}
          backgroundColor="#E3E3E3"
          flex={1}
          flexDirection="row"
          align="center">
          <View style={{width: width * 0.1, height: width * 0.1}}>
            <Image
              source={imageAssets.aboutFest1}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
            />
          </View>
          <Divider width={10} />
          <View style={{flex: 1}}>
            <Text size={14} align="left" lineHeight={16.8} color={Color.black} type="medium">
              {params.item.title}
            </Text>
          </View>
        </Container>
        <Divider height={12} />
        <Line width={width} height={1} color={Color.black} />
        <Divider height={16} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TenantDetailScreen', { item: { location_id: params.item.location_id } });
          }}
          style={{ 
            borderWidth: 1,
            padding: 12,
            marginHorizontal: 16,
          }}
        >
          <Text size={14} lineHeight={16.8} type="medium" color={Color.primary}>
            Visit Tenant
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Scaffold>
  );
};

export default SpecialOfferDetail;
