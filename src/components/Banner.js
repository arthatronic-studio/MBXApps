import React from 'react';
import {View, Image, useWindowDimensions, ActivityIndicator, Linking, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';

import CarouselView from 'src/components/CarouselView';
import {Container, Divider} from 'src/styled';
import {Text, useColor} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import PostingHeader from 'src/components/Posting/PostingHeader';
import { getSizeByRatio } from 'src/utils/get_ratio';

const propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  showHeader: PropTypes.bool,
  forArticle: PropTypes.bool,
  leftIndicator: PropTypes.bool,
};

const defaultProps = {
  data: [],
  loading: false,
  showHeader: true,
  categoryId: null,
  forArticle: false,
  leftIndicator: false,
};

const Banner = ({ data, loading, showHeader, forArticle, leftIndicator }) => {
  const {width} = useWindowDimensions();
  const {Color} = useColor();
  const navigation = useNavigation();

  const onPress = (e) => {
    if (e.link) {
      if(forArticle){
        const myArray = e.link.split("/");
        const params = myArray[1].split(":");
        const objectParams = {[params[0]]: params[1]};
        navigation.navigate(myArray[0], {...objectParams})
      }else{
        navigation.navigate(e.link);
      }
    }
  }

  const renderskeleton = () => {
    return (
      <View
        style={{
          width: width,
          aspectRatio: 16/9,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color={Color.primary} />
          <Divider />
          <Text>Memuat</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <PostingHeader
          title='Tribes Special Deals'
          onSeeAllPress={() => {}}
          showSeeAllText={false}
        />
      </>
    )
  }

  return (
    <View style={{marginBottom: 16}}>
      {showHeader && renderHeader()}

      {loading ? (
        renderskeleton()
      ) : (
        <>
          <CarouselView
            delay={3000}
            showIndicator
            leftIndicator={leftIndicator}
            style={{
              width,
              height: getSizeByRatio({ width: width - 32, ratio: 9/16 }).height,
            }}
          >
            {data.map((e, idx) => {
              return (
                <Container
                  key={idx}
                  width='100%'
                  height='100%'
                  paddingHorizontal={16}
                >
                  <TouchableOpacity
                    onPress={() => onPress(e)}
                  >
                    <Image
                      source={{uri: e.image}}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                        backgroundColor: Color.border,
                      }}
                      resizeMode='cover'
                    />
                  </TouchableOpacity>
                </Container>
              )
            })}
          </CarouselView>
        </>
      )}
    </View>
  );
};

Banner.defaultProps = defaultProps;
Banner.propTypes = propTypes;
export default Banner;
