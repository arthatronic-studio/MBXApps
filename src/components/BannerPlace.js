import React from 'react';
import {
  View,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';

import CarouselView from 'src/components/CarouselView';
import {Container, Divider} from 'src/styled';
import {Text, useColor} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import PostingHeader from 'src/components/Posting/PostingHeader';
import {getSizeByRatio} from 'src/utils/get_ratio';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {iconStar} from 'assets/images/place';
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

const Banner = ({data, loading, showHeader}) => {
  const {width} = useWindowDimensions();
  const {Color} = useColor();
  const navigation = useNavigation();

  const onPress = e => {
    if (e.link) {
      navigation.navigate(e.link);
    }
  };

  const renderskeleton = () => {
    return (
      <View
        style={{
          width: width,
          aspectRatio: 16 / 9,
          paddingHorizontal: 16,
        }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
          title="Tribes Special Deals"
          onSeeAllPress={() => {}}
          showSeeAllText={false}
        />
      </>
    );
  };

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
            style={{
              width: width,
              height: getSizeByRatio({width: width - 32, ratio: 9 / 16}).height,
            }}>
            {data.map((e, idx) => {
              return (
                <Container
                  key={idx}
                  width="100%"
                  height="100%"
                  paddingHorizontal={16}>
                  <TouchableOpacity onPress={() => onPress(e)}>
                    <ImageBackground
                      source={{uri: e.image}}
                      style={{
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                      imageStyle={{
                        borderRadius: 8,
                      }}
                      resizeMode="cover">
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                          paddingTop: 10,
                        }}>
                        {/* lokasi */}
                        <View
                          style={{
                            backgroundColor: Color.textInput,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 120,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                            }}>
                            <MaterialIcons
                              name={'place'}
                              size={18}
                              color={'#E40C33'}
                            />
                            <Text>Jakarta Selatan</Text>
                          </View>
                        </View>

                        {/* rating */}
                        <View
                          style={{
                            backgroundColor: Color.textInput,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 120,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                            }}>
                            <Image
                              source={iconStar}
                              style={{height: 20, width: 20}}
                              resizeMode="contain"
                            />
                            <Divider width={3} />
                            <Text type="bold">4.3</Text>
                          </View>
                        </View>
                      </View>

                      {/* Name and category */}
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          paddingHorizontal: 16,
                          paddingBottom: 26,
                        }}>
                        <Text type="bold" color={Color.textInput} size={17}>
                          Ivo Coffee
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                          }}>
                          <Ionicons
                            name={'cafe-outline'}
                            size={16}
                            color={Color.textInput}
                          />
                          <Divider width={4}/>
                          <Text align="left" color={Color.textInput} type="medium" size={10}>
                            Kafe
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </Container>
              );
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
