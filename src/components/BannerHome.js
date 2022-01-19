import React from 'react';
import { useWindowDimensions, ActivityIndicator } from "react-native";
import { View, Image, Text } from "react-native";
import PropTypes from 'prop-types';

import CarouselView from 'src/components/CarouselView';
import { Divider } from 'src/styled';
import {
  useColor
} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import ImagesPath from 'src/components/ImagesPath';
import { useNavigation } from '@react-navigation/native';

const propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
}

const defaultProps = {
  data: [],
  loading: false,
}

const BannerHome = (props) => {
  const { data, loading } = props;

  const {width} = useWindowDimensions();
  const { Color } = useColor();
  const navigation = useNavigation();

  const renderskeleton = () => {
    return (
      <View
        style={{
          width: width - 32,
          aspectRatio: 12/7,
          marginBottom: 16,
          backgroundColor: Color.textInput,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator size='large' color={Color.primary} />
        <Divider />
        <Text>Memuat</Text>
      </View>
    )
  }

  return (
    <View
      style={{width: width - 32, marginHorizontal: 16, marginBottom: 16}}>
      {loading ?
        renderskeleton()
      :
        <CarouselView
          delay={4000}
          showIndicator
          style={{aspectRatio: 12 / 7}}
        >
          {data.length > 0 ? 
            data.map((banner, idx) => (
              <TouchableOpacity
                key={idx}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                }}
                onPress={() => {
                  const dataSabyan = {
                    productName: 'New Sabyan Album',
                    productCategory: 'Promo',
                    image: ImagesPath.popUpSabyan,
                    productDescription: 'Cupcake ipsum dolor sit amet tart. Cookie carrot cake bear claw jujubes muffin. Cotton candy sweet candy chocolate muffin bonbon. Tart donut apple pie cupcake tart tart. Jelly-o chocolate cake ice cream shortbread biscuit chupa chups dessert. Macaroon cotton candy lollipop marshmallow dragée toffee shortbread macaroon dessert. Bear claw gummi bears pie apple pie tiramisu soufflé bonbon. Tiramisu tart candy croissant jujubes marshmallow lemon drops. Ice cream muffin pastry halvah chocolate bar bear claw. Tart icing pudding jelly-o fruitcake fruitcake. Tiramisu sweet pastry caramels sugar plum sweet gingerbread. Macaroon powder gummies tootsie roll muffin. Cookie danish candy jelly beans biscuit. Soufflé cake pudding fruitcake macaroon jelly beans.'
                  }

                  navigation.navigate('DetailPromo', { item: dataSabyan });
                }}
              >
                <Image
                  key={banner.id}
                  resizeMode='cover'
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 16,
                  }}
                  source={{uri: banner.image}}
                />
              </TouchableOpacity>
            ))
          :
            <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                }}
                onPress={() => {
                  const dataSabyan = {
                    productName: 'New Sabyan Album',
                    productCategory: 'Promo',
                    image: ImagesPath.popUpSabyan,
                    productDescription: 'Cupcake ipsum dolor sit amet tart. Cookie carrot cake bear claw jujubes muffin. Cotton candy sweet candy chocolate muffin bonbon. Tart donut apple pie cupcake tart tart. Jelly-o chocolate cake ice cream shortbread biscuit chupa chups dessert. Macaroon cotton candy lollipop marshmallow dragée toffee shortbread macaroon dessert. Bear claw gummi bears pie apple pie tiramisu soufflé bonbon. Tiramisu tart candy croissant jujubes marshmallow lemon drops. Ice cream muffin pastry halvah chocolate bar bear claw. Tart icing pudding jelly-o fruitcake fruitcake. Tiramisu sweet pastry caramels sugar plum sweet gingerbread. Macaroon powder gummies tootsie roll muffin. Cookie danish candy jelly beans biscuit. Soufflé cake pudding fruitcake macaroon jelly beans.'
                  }

                  navigation.navigate('DetailPromo', { item: dataSabyan });
                }}
            >
              <Image
                resizeMode='cover'
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                }}
                source={ImagesPath.popUpSabyan}
              />
            </TouchableOpacity>
          }
        </CarouselView>
      }
    </View>
  );
}

BannerHome.defaultProps = defaultProps;
BannerHome.propTypes = propTypes;
export default BannerHome;