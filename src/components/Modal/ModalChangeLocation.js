import React, {useRef, forwardRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Text, useColor} from '@src/components';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';
import {Container, Divider, Line} from 'src/styled';
import imageAssets from 'assets/images';
import SearchBar from '../SearchBar';

const defaultProps = {
  data: [
    {
      name: '10 Menit',
      value: 10,
    },
    {
      name: '15 Menit',
      value: 15,
    },
    {
      name: '30 Menit',
      value: 30,
    },
    {
      name: '60 Menit',
      value: 60,
    },
    {
      name: '90 Menit',
      value: 90,
    },
    {
      name: '120 Menit',
      value: 120,
    },
  ],
  selectedValue: null,
  onPress: () => {},
  onClose: () => {},
  style: {},
  label: 'Durasi',
};

const ModalChangeLocation = forwardRef((props, ref) => {
  const {data, selectedValue, onPress, onClose, children, style, label, name} =
    props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const auth = useSelector(state => state['auth']);

  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState({
    id: 1,
    name: 'All Group',
  });

  return (
    <Modalize
      ref={combinedRef}
      withHandle={false}
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        paddingVertical: 16,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}>
      <View style={{flex: 1, width: width}}>
        <Container
          flex={1}
          flexDirection="row"
          justify="space-between"
          paddingHorizontal={16}
          align="center">
          <Text size={17} lineHeight={20.4} type="medium" color={Color.black}>
            Current Selection
          </Text>
          <TouchableOpacity onPress={() => combinedRef.current.close()}>
            <Image
              source={imageAssets.iconApp}
              style={{width: 24, height: 24}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Container>

        <Divider height={16} />
        <Line height={1} color={Color.black} width={width} />
        <Divider height={16} />

        <FlatList
          keyExtractor={(item, index) => item.toString() + index}
          data={[{id: 1}, {id: 1}, {id: 1}]}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          onEndReachedThreshold={0.3}
          ItemSeparatorComponent={() => (
            <Line width={'100%'} height={1} color={Color.black} />
          )}
          // onEndReached={() => setItemData({...itemData, loadNext: true})}
          renderItem={({item, index}) => {
            const isSelected = index == 0;
            return (
              <TouchableOpacity
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: isSelected ? Color.black : 'transparent'
                }}>
                <Container
                  flex={1}
                  flexDirection="column"
                  align="flex-start">
                  <Text
                    size={18}
                    lineHeight={21.6}
                    color={isSelected ? Color.white : Color.black}
                    type="medium">
                    M Bloc Space
                  </Text>
                  <Divider height={4} />
                  <Text
                    size={11}
                    lineHeight={13.2}
                    color={isSelected ? Color.white : Color.black}>
                    Bloc Group • Jakarta Selatan
                  </Text>
                </Container>
                {isSelected && (
                  <Image
                    source={imageAssets.checklist}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={() => (
            <Line width={'100%'} height={1} color={Color.black} />
          )}
          ListHeaderComponent={
            <Container>
              <Container flex={1} flexDirection="row" align="center">
                <SimpleLineIcons
                  name="location-pin"
                  color={'#797979'}
                  size={16}
                />
                <Divider width={4} />
                <Text size={11} lineHeight={13.2} color="#797979" type="medium">
                  Location
                </Text>
              </Container>
              <Divider height={6} />
              <Text size={18} lineHeight={21.6} type="medium" align="left">
                {auth.user &&
                auth.user.activityInfo &&
                auth.user.activityInfo.location
                  ? auth.user.activityInfo.location.name
                  : ''}
              </Text>
              <Divider height={16} />
              <View
                style={{
                  flex: 1,
                }}>
                <SearchBar
                  type="input"
                  value={search}
                  onChangeText={value => setSearch(value)}
                  textInputProps={{
                    onSubmitEditing: () => {},
                  }}
                  style={{paddingHorizontal: 0}}
                />
              </View>
              <Divider height={16} />
              <FlatList
                keyExtractor={(item, index) => item.toString() + index}
                horizontal
                data={[
                  {id: 1, name: 'All Group'},
                  {id: 2, name: 'Bloc Group'},
                  {id: 3, name: 'M Bloc Market'},
                ]}
                ItemSeparatorComponent={() => <Divider width={8} />}
                renderItem={({item, index}) => {
                  const isSelected =
                    JSON.stringify(item) === JSON.stringify(selectedGroup);
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedGroup(item)}
                      style={{
                        padding: 10,
                        padding: 10,
                        backgroundColor: isSelected
                          ? Color.black
                          : 'transparent',
                        borderColor: Color.black,
                        borderWidth: isSelected ? 0 : 1,
                      }}>
                      <Text
                        size={14}
                        lineHeight={16.8}
                        type="medium"
                        color={
                          isSelected ? Color.textButtonInline : Color.text
                        }>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <Divider height={16} />
              <Line width={'100%'} height={1} color={Color.black} />
            </Container>
          }
        />
      </View>
    </Modalize>
  );
});

ModalChangeLocation.defaultProps = defaultProps;
export default ModalChangeLocation;
