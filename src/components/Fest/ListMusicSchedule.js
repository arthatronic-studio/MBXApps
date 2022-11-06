import React, {useState, useEffect} from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import PropTypes from 'prop-types';

import {ScreenEmptyData} from '@src/components';
import {Container, Divider, Row} from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import {initialItemState} from 'src/utils/constants';
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/content';
import CardContentProduct from '@src/components/Content/CardContentProduct';
import {getAPI} from 'src/api-rest/httpService';
import PostingHeader from '../Posting/PostingHeader';
import CardContentFest from './CardContentFest';
import { fetchFestEventSchedule } from 'src/api-rest/fest/fetchFestEventSchedule';
import CardFestLineup from './CardFestLineup';

const propTypes = {
  eventId: PropTypes.number,
  numColumns: PropTypes.number,
  date: PropTypes.string,
};

const defaultProps = {
  eventId: 0,
  numColumns: 2,
  date: '',
  onPress: () => {},
};

const ListMusicSchedule = ({
  eventId,
  numColumns,
  date,
  onPress,
}) => {
  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    fetchData(true);
  }, [date]);

  useEffect(() => {
    if (itemData.loadNext && itemData.page !== -1) {
      fetchData(false);
    }
  }, [itemData.loadNext]);

  const fetchData = async (first) => {
    let newData = [];
    const body ={
      event_id: eventId, 
    }
    if(date != ''){
      body.date = date;
    }
    const result = await fetchFestEventSchedule(body);
    newData = result.data;

    setItemData({
      ...itemData,
      data: first ? newData : itemData.data.concat(newData),
      // data: [],
      // page: result.status === false ? itemData.page : result.data.length > 0 ? itemData.page + 1 : -1,
      page: -1,
      loading: false,
      loadNext: false,
      message: 'OK',
      // message: result.message,
      refresh: false,
    });
  };

  const renderSkeleton = () => {
    return (
      <Container paddingLeft={16} paddingTop={16} paddingRight={32}>
        <Row>
          <PostingSkeleton />
          <PostingSkeleton />
        </Row>
      </Container>
    );
  };


  return (
    <View style={{}}>
      {itemData.loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          keyExtractor={(item, index) => item.toString() + index}
          data={itemData.data}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 8,
          }}
          // onEndReachedThreshold={0.3}
          // onEndReached={() => setItemData({...itemData, loadNext: true})}
          renderItem={({item, index}) => {
            return (
              <View key={index}>
                <CardFestLineup
                  item={item}
                  numColumns={numColumns}
                  onPress={(value) => onPress(value)}
                  horizontal={true}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

ListMusicSchedule.propTypes = propTypes;
ListMusicSchedule.defaultProps = defaultProps;
export default ListMusicSchedule;
