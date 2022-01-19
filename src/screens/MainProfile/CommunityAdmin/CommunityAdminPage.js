import React from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {Header, useColor} from '@src/components';
import CardComponent from './CardComponent';
import {MainView} from '@src/styled';

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
  const { width } = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'AnggotaBaru', title: 'Baru'},
    {key: 'Anggota', title: 'Anggota'},
    {key: 'AnggotaDitolak', title: 'Ditolak'},
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{width: width / 3}}
      indicatorStyle={{backgroundColor: Color.primary}}
      style={{backgroundColor: Color.theme}}
      activeColor={Color.primary}
      inactiveColor={Color.text}
      labelStyle={{fontWeight: 'bold', textAlign: 'center', fontSize: 16, textTransform: 'none'}}
    />
  );
  
  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header title="Community Admin" />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width}}
        renderTabBar={renderTabBar}
      />
    </MainView>
  );
};

export default CommunityAdminPage;
