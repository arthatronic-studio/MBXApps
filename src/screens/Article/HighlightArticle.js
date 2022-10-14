import React, {useState, useEffect, useRef} from 'react';
import {Image, View, ScrollView} from 'react-native';

import {
  useColor,
} from '@src/components';
import PostingHeader from '../../components/Posting/PostingHeader';
import {getAPI} from 'src/api-rest/httpService';
import {useSelector} from 'react-redux';
import {Container, Divider} from 'src/styled';
import {useNavigation} from '@react-navigation/native';
import CardArticle from './CardArticle';
import imageAssets from 'assets/images';

const defaultProps = {
  title: '',
  tenantType: null,
  numColumns: 2,
  showSeeAllText: true,
  style: {},
};

const HighlightArticle = ({title, tenantType, numColumns, showSeeAllText, style}) => {
  const auth = useSelector(state => state['auth']);
  const {Color} = useColor();
  const navigation = useNavigation();

  const [itemData, setItemData] = useState([]);

  const ref = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // let baseEndpoint = 'location?';
    // if (tenantType) {
    //   baseEndpoint = baseEndpoint + `type=${tenantType}&`;
    // }
    // baseEndpoint = baseEndpoint + `isRecommended=1`;
    // // if (auth.user.activityInfo.location) {
    // //     baseEndpoint = baseEndpoint + `?bloc_location_id=${auth.user.activityInfo.location.id}&isRecommended=1`;
    // // }
    // const result = await getAPI(baseEndpoint);

    // console.log('result baseEndpoint', result);

    // let newArr = [];
    // if (result.status) {
    //   newArr = result.data;
    // }

    const newArr = [
      {
        id: 1,
        image: imageAssets.article1,
      }
    ]

    setItemData(newArr);
  };

  if (itemData.length === 0) return <View />;

  console.log(itemData, "itemData");

  return (
    <View
      style={{
        paddingVertical: 8,
      }}>
      <PostingHeader
        title={title}
        onSeeAllPress={() => {
          navigation.navigate('ArticleScreen');
        }}
        showSeeAllText={showSeeAllText}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 8,
            ...style,
          }}>
          {itemData.map((item, idx) => {
            return (
              <CardArticle
                key={idx}
                index={idx}
                item={item}
                numColumns={numColumns}
                horizontal={true}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

HighlightArticle.defaultProps = defaultProps;
export default HighlightArticle;
