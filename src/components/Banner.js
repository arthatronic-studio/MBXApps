import React from 'react';
import {useWindowDimensions, ActivityIndicator} from 'react-native';
import {View, Image, Text} from 'react-native';
import PropTypes from 'prop-types';

import CarouselView from 'src/components/CarouselView';
import {Container, Divider} from 'src/styled';
import {useColor} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import ImagesPath from 'src/components/ImagesPath';
import {useNavigation} from '@react-navigation/native';
import PostingHeader from './Posting/PostingHeader';

const propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  showHeader: PropTypes.bool,
};

const defaultProps = {
  data: [],
  loading: false,
  showHeader: true,
};

const Banner = props => {
  const {data, loading, showHeader} = props;

  const {width} = useWindowDimensions();
  const {Color} = useColor();
  const navigation = useNavigation();

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
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.textInput,
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
        <PostingHeader
            title='Tribes Special Deals'
            onSeeAllPress={() => {}}
            showSeeAllText={false}
        />
    )
  }

  // console.log('data', data);

  return (
    <View style={{marginBottom: 16}}>
      {showHeader && renderHeader()}

      {loading ? (
        renderskeleton()
      ) : (
        <>
          <Divider />
          {data.length > 0 ?
            <CarouselView
              delay={3000}
              showIndicator
              style={{width, aspectRatio: 16/9}}
            >
              {data.map((e, idx) => {
                return (
                  <Container
                    key={idx}
                    width='100%'
                    paddingHorizontal={16}
                  >
                    <Image
                      source={{uri: e.image}}
                      style={{
                        width: '100%',
                        height:'100%',
                        borderRadius: 16
                      }}
                    />
                  </Container>
                )
              })}
            </CarouselView>
          :
            <Container
              width={width}
              paddingHorizontal={16}
              style={{aspectRatio: 16/9}}
            >
              <Image
                source={ImagesPath.imageBanner2}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16
                }}
              />
            </Container>
          }
        </>
      )}
    </View>
  );
};

Banner.defaultProps = defaultProps;
Banner.propTypes = propTypes;
export default Banner;
