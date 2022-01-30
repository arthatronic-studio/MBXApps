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
          width: width - 32,
          aspectRatio: 12 / 7,
          marginBottom: 16,
          backgroundColor: Color.textInput,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={Color.primary} />
        <Divider />
        <Text>Memuat</Text>
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

  return (
    <View style={{marginBottom: 16}}>
      {showHeader && renderHeader()}

      {loading ? (
        renderskeleton()
      ) : (
        <>
          <Divider />
          <CarouselView
            delay={3000}
            showIndicator
            style={{width, aspectRatio: 16/9}}
          >
            {data.map((e, idx) => {
              return (
                <Container
                  width='100%'
                  paddingHorizontal={16}
                >
                  <Image
                    key={idx}
                    source={ImagesPath.imageBanner2 || {uri: e.image}}
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
        </>
      )}
    </View>
  );
};

Banner.defaultProps = defaultProps;
Banner.propTypes = propTypes;
export default Banner;
