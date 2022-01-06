import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Styled from 'styled-components';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';

import Client from '@src/lib/apollo';
import {queryLike} from '@src/lib/query';
import {queryGetUserOrganizationRef} from '@src/lib/query';
import { Scaffold } from 'src/components';

const BottomSection = Styled(View)`
  width: 100%;
  paddingHorizontal: 16px;
  paddingTop: 8px;
  paddingBottom: 4px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 100%;
  backgroundColor: #FFFFFF;
  padding: 8px 16px 8px 16px;
  borderRadius: 32px;
  borderWidth: 0.5px;
  flexDirection: row;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
`;

const ChatUserListScreen = ({navigation, route}) => {
  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });
  const [selected, setSelected] = useState([]);

  const [search, setSearch] = useState("")
  const [filterData, setFilterData] = useState(null)

  const { Color } = useColor();

  useEffect(() => {
    if (itemData.page !== -1) {
      fetchGetUserOrganizationRef();
    }
  }, [itemData.loadNext]);

  const compareData = arr => {
    let obj = {};
    let newData = [];

    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]['userId']] = arr[i];
    }

    for (let key in obj) {
      newData.push(obj[key]);
    }

    return newData;
  };

  const fetchGetUserOrganizationRef = () => {
    Client.query({
      query: queryGetUserOrganizationRef,
      variables: {
        page: 1,
        firstName: 'excel',
      },
    })
      .then(res => {
        console.log(res, 'ressss');

        const data = res.data.getUserOrganizationRef;

        let newArr = [];

        if (data) {
          newArr = compareData(itemData.data.concat(data));
        }

        setStateItemData({
          data: newArr,
          loading: false,
          page: data.length === 10 ? itemData.page + 1 : -1,
          loadNext: false,
        });

        setFilterData(newArr)
      })
      .catch(err => {
        console.log(err, 'errrrr');

        setStateItemData({
          loading: false,
          page: -1,
          loadNext: false,
        });
      });
  };

  const setStateItemData = obj => {
    setItemData({
      ...itemData,
      ...obj,
    });
  };

  const onSelected = item => {
    setItemData({...itemData, loading: true});

    const idxOf = selected.length > 0 ? selected.indexOf(item) : -1;

    const newSelected = selected;
    if (idxOf === -1) {
      newSelected.push(item);
    } else {
      newSelected.splice(idxOf, 1);
    }

    setSelected(newSelected);
    setItemData({...itemData, loading: false});
  };

  const onPress = item => {
    if (selected.length > 0) {
      onSelected(item);
    } else {
      navigation.navigate('ChatDetailScreen', {
        roomId: null,
        selected: [item],
      });
    }
  };

  const searchFilter = (text) => {
        if (text) {
            const newData = itemData.data.filter((item) => {
                const itemData = item.firstName ? item.firstName.toUpperCase() 
                            : ''.toUpperCase()
                const textData = text.toUpperCase
                return itemData.indexOf(textData) > -1
            })
            setFilterData(newData)
            setSearch(text)
        } else {
            setFilterData(itemData.data)
            setSearch(text)
        }
  }

  return (
    <Scaffold
      fallback={itemData.loading}
      header={
        <Header
          title="Buat Room Chat"
          actions={
            selected.length > 0 ? (
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center', paddingHorizontal: 16}}
                onPress={() => {
                  navigation.navigate('ChatDetailScreen', {
                    roomId: null,
                    selected,
                  });
                }}>
                <MaterialIcons name="send" color={Color.secondary} size={22} />
              </TouchableOpacity>
            ) : null
          }
        />
      }
    >
      
      <BottomSection style={{borderColor: Color.border, marginTop: 12}}>
        <BoxInput style={true ? {borderColor: Color.border} : {borderColor: Color.error}}>
          <TextInputNumber
            name="text"
            placeholder='Search Here...'
            returnKeyType="done"
            returnKeyLabel="Done"
            blurOnSubmit={false}
            onBlur={() => {}}
            error={null}
            onChangeText={(text) => {
              setSearch(text)
            }}
          />
          <CircleSend style={{backgroundColor: Color.primary}} onPress={() => searchFilter(search)}>
            <Ionicons name='search' size={16} color={Color.text} />
          </CircleSend>
        </BoxInput>
      </BottomSection>

      <Text>{console.log(filterData)}</Text>
      
      <FlatList
        keyExtractor={(item, index) => item.toString() + index}
        data={filterData}
        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 8}}
        renderItem={({item}) => {
          const isSelected = selected.filter(
            e => e.userId === item.userId,
          )[0];

          if (isSelected) {
            return (
              <TouchableOpacity
                onPress={() => onPress(item)}
                onLongPress={() => onSelected(item)}
                style={{
                  height: 70,
                  width: '100%',
                  borderRadius: 4,
                  backgroundColor: Color.theme,
                  marginBottom: 8,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <ImageBackground
                  source={{uri: item.image}}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 8,
                    backgroundColor: Color.border,
                  }}
                  imageStyle={{borderRadius: 30}}>
                  <MaterialIcons
                    name="check-circle"
                    color={Color.success}
                    size={22}
                  />
                </ImageBackground>
                <View
                  style={{
                    height: 60,
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                  }}>
                  <Text size={12} type="semibold" numberOfLines={1}>
                    {item.fullname}
                  </Text>
                  {/* <Text size={10}>Available</Text> */}
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => onPress(item)}
              onLongPress={() => onSelected(item)}
              style={{
                height: 70,
                width: '100%',
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 8,
                    backgroundColor: Color.border,
                  }}
                />
                <View
                  style={{
                    height: 60,
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                  }}>
                  <Text size={12} type="semibold" numberOfLines={1}>
                    {item.fullname}
                  </Text>
                  {/* <Text size={10}>Available</Text> */}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        onEndReached={() =>
          itemData.page !== -1 && setStateItemData({loadNext: true})
        }
        onEndReachedThreshold={0.3}
      />
    </Scaffold>
  );
};

export default ChatUserListScreen;
