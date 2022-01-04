import * as React from 'react';
import {View, useWindowDimensions, SafeAreaView, Text, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Styled from 'styled-components';
import {Header, useColor} from '@src/components';
import CardComponent from './CardComponent';

const { width } = Dimensions.get('window');

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const AnggotaBaruRoute = () => (
  <CardComponent
    type="newAnggota"
    handleSuccess="Approve"
    handleRemove="Reject"
  />
);

const AnggotaRoute = () => (
  <CardComponent
    type="Anggota"
  />
);

const AnggotaDitolakRoute = () => (
  <CardComponent
    type="notAnggota"
    handleSuccess="Approve"
    handleRemove="Reject"
  />
);

const renderScene = SceneMap({
  AnggotaBaru: AnggotaBaruRoute,
  Anggota: AnggotaRoute,
  AnggotaDitolak: AnggotaDitolakRoute,
});

const CommunityAdminPage = ({navigation}) => {
  const {Color} = useColor();

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'AnggotaBaru', title: 'Anggota Baru'},
    {key: 'Anggota', title: 'Anggota'},
    {key: 'AnggotaDitolak', title: 'Anggota Ditolak'},
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{width: width/3}}
      indicatorStyle={{backgroundColor: Color.primary}}
      style={{backgroundColor: 'white'}}
      activeColor={Color.secondary}
      inactiveColor="black"
      labelStyle={{fontWeight: 'bold', textAlign: 'center',fontSize:13, textTransform:'capitalize'}}
    />
  );
  
  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header title="Community Admin" />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
      />
    </MainView>
  );
};

export default CommunityAdminPage;
