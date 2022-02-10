import React from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {Header, useColor} from '@src/components';
import CardCommunityAdmin from './CardCommunityAdmin';
import {MainView} from '@src/styled';

const AnggotaBaruRoute = () => (
  <CardCommunityAdmin
    type="newAnggota"
  />
);

const AnggotaRoute = () => (
  <CardCommunityAdmin
    type="Anggota"
  />
);

const AnggotaDitolakRoute = () => (
  <CardCommunityAdmin
    type="notAnggota"
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
      activeColor={Color.primary}
      inactiveColor={Color.text}
      scrollEnabled
      labelStyle={{
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        textTransform: 'none',
      }}
      indicatorStyle={{
        backgroundColor: Color.primary,
      }}
      style={{
        backgroundColor: Color.theme,
      }}
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
