import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Scaffold, ScreenEmptyData, ScreenIndicator, useColor } from '@src/components';
import Text from '@src/components/Text';
import CardForumVertical from '@src/screens/MainForum/CardForumVertical';
import { Container } from 'src/styled';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { useSelector } from 'react-redux';

const defaultProps = {
    componentType: 'GENERAL', // GENERAL | LIST | GRID
    showAll: false,
    onPress: () => {},
    onPressShowAll: () => {},
    showHeader: true,
    data: [],
    loading: false,
    onEndReached: () => {},
    loadNext: false,
};

const ListForumVertical = ({ componentType, data, loading, title, showAll, onPressShowAll, onPress, showHeader, loadNext, onEndReached }) => {
    const [selectedItem, setSelectedItem] = useState();

    const { Color } = useColor();
    const { height } = useWindowDimensions();
    const modalOptionsRef = useRef();

    const user = useSelector(
        state => state['user.auth'].login.user
    );

    useEffect(() => {
        if (selectedItem) {
            modalOptionsRef.current.open();
        }
    }, [selectedItem]);

    return (
      <Scaffold showHeader={false} style={{paddingBottom: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text type="bold" style={{marginLeft: 16}}>
            List Thread
          </Text>
          <View style={{flexDirection: 'row',marginRight:16}}>
            <Text style={{color: '#F3771D',}}>Terbaru</Text>
            <TouchableOpacity
              onPress={() => {
                ''
              }}>
              <FontAwesome name="angle-down" color="#F3771D" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        {showHeader && (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 12,
              paddingTop: 24,
              paddingHorizontal: 16,
            }}>
            <Text type="semibold" size={12}>
              {title}
            </Text>
            {showAll && (
              <Text
                onPress={() => onPressShowAll()}
                size={12}
                color={Color.primary}>
                Lihat Semua{' '}
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={Color.primary}
                />
              </Text>
            )}
          </View>
        )}

        {loading ? (
          <Container paddingTop={height / 3}>
            <ScreenIndicator />
          </Container>
        ) : (
          <FlatList
            key={componentType}
            keyExtractor={(item, index) => item.toString() + index}
            data={data}
            contentContainerStyle={{paddingHorizontal: 16}}
            renderItem={({item, index}) => {
              return (
                <CardForumVertical
                  componentType={componentType}
                  item={item}
                  numColumns={2}
                  onPress={() => onPress(item)}
                  onPressDot={() => setSelectedItem(item)}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <ScreenEmptyData
                  style={{marginTop: height / 6}}
                  message="Belum ada postingan, Tekan tombol + untuk menambahkan"
                />
              );
            }}
            ListFooterComponent={() => {
              if (loadNext) {
                return <ActivityIndicator color={Color.primary} size="large" />;
              }

              return <View />;
            }}
            onEndReachedThreshold={0.3}
            onEndReached={() => onEndReached()}
          />
        )}

        <ModalContentOptions
          ref={modalOptionsRef}
          isOwner={user && selectedItem && user.userId === selectedItem.ownerId}
          item={selectedItem}
          moduleType="FORUM"
          onClose={() => setSelectedItem()}
        />
      </Scaffold>
    );
}

ListForumVertical.defaultProps = defaultProps;
export default ListForumVertical;