import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {useColor, Header, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import Text from '@src/components/Text';
import {Divider, Row, Container} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import {useIsFocused} from '@react-navigation/native';
import ImagesPath from 'src/components/ImagesPath';
import Banner from 'src/components/Banner';
import Client from 'src/lib/apollo';
import {queryBannerList} from '@src/lib/query/banner';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
import {useCurrentUser} from 'src/hooks/useCanGenerateContent';
import {statusBarHeight} from 'src/utils/constants';

//Fonts
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import SearchBar from 'src/components/SearchBar';
import ListContenEvent from 'src/components/Event/ListContenEvent';
import imageAssets from 'assets/images';
import ListFeaturedEvent from 'src/components/Event/ListFeaturedEvent';
import ListContenCollaboratorEvent from 'src/components/Event/ListContenCollaboratorEvent';

const SeeAllCollaboratorEvent = ({navigation, route}) => {
  const {params} = route;
  const auth = useSelector(state => state['auth']);

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const {width, height} = useWindowDimensions();

  console.log('params', params);

  return (
    <Scaffold
      header={
        <Header
          title={params && params.title ? params.title : 'EVENT'}
          centerTitle={false}
          // actions={
          //   <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
          //     <TouchableOpacity
          //       onPress={() => navigation.navigate('EventHistory')}
          //     >
          //       <View style={{borderBottomWidth: 1, borderColor: Color.primary}}>
          //         <Text size={17} type='medium'>My Order</Text>
          //       </View>
          //     </TouchableOpacity>
          //   </View>
          // }
        />
      }>
      <ListContenCollaboratorEvent
        productCategory="EVENT"
        name="Event"
        icon={auth?.user?.activityInfo['x-colaborator']?.icon}
        pagination={false}
        showSeeAllText={true}
        style={{
          paddingBottom: statusBarHeight,
        }}
      />
    </Scaffold>
  );
};

export default SeeAllCollaboratorEvent;
