import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import {useColor, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {Row, Divider, Container} from 'src/styled';
import HighlightArticle from './HighlightArticle';
import imageAssets from 'assets/images';
import { useIsFocused } from '@react-navigation/native';

const DetailArticleScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const {height, width} = useWindowDimensions();
  const scrollRef = useRef();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    onRefresh();
    scrollRef.current?.scrollTo({
      y: 0,
      // animated: true,
    });
  }, [item]);

  const cardImage = (image, caption) => {
    return (
      <Container align="center">
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: width / 3,
            resizeMode: 'cover',
          }}
        />
        <Divider height={8} />
        {caption && (
          <>
            <Container width="80%">
              <Text size={9} lineHeight={15} color={'#AEAEAE'} type="medium">
                {caption}
              </Text>
            </Container>
            <Divider height={8} />
          </>
        )}
        <Container align="center" flex={1} flexDirection="row">
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
          <Divider width={8} />
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
          <Divider width={8} />
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
        </Container>
      </Container>
    );
  };

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}>
      <ScrollView ref={scrollRef}>
        <View
          style={{
            width: '100%',
            height: width * 1.21,
            paddingHorizontal: 16,
          }}>
          <Image
            source={{uri: item.images[0]}}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>
        <Divider height={18} />
        <Container flex={1} flexDirection="row" paddingHorizontal={16}>
          <Container
            flex={1}
            marginRight={4}
            flexDirection="row"
            align="flex-start">
            <Text size={12} type="medium" lineHeight={14.4}>
              ●
            </Text>
            <Divider width={4} />
            <Container flex={1}>
              <Text
                align="left"
                size={10}
                lineHeight={14.4}
                type="semibold"
                color={Color.black}>
                ARTICLE
              </Text>
              <Text align="left" size={10} lineHeight={12} type="medium">
                {item.publisher} {item.created_at}
              </Text>
            </Container>
          </Container>
          <Container flex={4} marginLeft={4}>
            {/* title */}
            <Text size={24} lineHeight={28.8} type="semibold" align="left">
              {item.title}
            </Text>

            <Divider height={16} />

            {/* subtitle */}
            <Text size={12} lineHeight={16} type="semibold" align="left">
              {item.subtitle}
            </Text>

            <Divider height={16} />

            {/* desc */}
            {item.detail.map((detail, index) => {
              return (
                <View key={index}>
                  <Text
                    align="left"
                    size={12}
                    lineHeight={18}
                    color={Color.black}
                    type="medium">
                    {detail.description}
                  </Text>

                  <Divider height={16} />

                  {detail?.images.length > 0 && (
                    <>
                      {cardImage(detail.images[0], detail.caption)}
                      <Divider height={16} />
                    </>
                  )}
                </View>
              );
            })}

            {/* <Divider height={16} /> */}

            {/* <Container flex={1} flexDirection="row" justify="center">
              <Image
                source={imageAssets.iconApp}
                style={{
                  height: 8,
                  width: 8,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Image
                source={imageAssets.iconApp}
                style={{
                  height: 8,
                  width: 8,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Image
                source={imageAssets.iconApp}
                style={{
                  height: 8,
                  width: 8,
                  resizeMode: 'contain',
                }}
              />
            </Container> */}
          </Container>
        </Container>
        <Divider height={24} />
        <HighlightArticle
          title="● OTHER ARTICLES"
          numColumns={1}
          type="OTHER"
          id={item.id}
          categoryId={item.category_id}
          showSeeAllText={false}
          refresh={refreshing}
        />
      </ScrollView>
    </Scaffold>
  );
};

export default DetailArticleScreen;
