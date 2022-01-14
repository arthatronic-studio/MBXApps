import React from 'react';
import { useWindowDimensions, ActivityIndicator } from "react-native";
import { View, Image, Text } from "react-native";
import CarouselView from 'src/components/CarouselView';
import { Divider } from 'src/styled';
import {
  useColor
} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';

const defaultProps = {
  data: [],
  loading: false,
}

const BannerHome = (props) => {
  const { data, loading } = props;

  const {width} = useWindowDimensions();
  const { Color } = useColor();

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
        }}>
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
          style={{aspectRatio: 12 / 7}}>
          {data.length? 
            data.map((banner) => (
              <Image
                  key={banner.id}
                  resizeMode='cover'
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  source={{uri: banner.image}}
              />
            ))
          :
            <Image
            resizeMode='cover'
            style={{
              width: '100%',
              height: '100%',
            }}
            source={ImagesPath.popUpSabyan}
            />
          }
        </CarouselView>
      }
    </View>
  );
}

BannerHome.defaultProps = defaultProps;
 
export default BannerHome;