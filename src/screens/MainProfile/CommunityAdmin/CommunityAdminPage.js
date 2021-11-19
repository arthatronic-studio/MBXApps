import * as React from 'react';
import {View, useWindowDimensions, SafeAreaView, Text} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Styled from 'styled-components';
import {Header, useColor} from '@src/components';

import CardComponent from './CardComponent';

const {Color} = useColor('root');
const MainView = Styled(SafeAreaView)`
    flex: 1;
`;



const AnggotaBaruRoute = () => (
  
    <CardComponent name="excel" handleSuccess="Add" handleRemove="Remove" type="newAnggota"/>

);

const AnggotaRoute = () => (
  <View>
    <CardComponent name="excel" type="Anggota" />
  </View>
);

const AnggotaDitolakRoute = () => (
  <View>
    <CardComponent name="excel" handleSuccess="Approve" handleRemove="Reject" type="notAnggota"/>
  </View>
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
      indicatorStyle={{backgroundColor: 'red'}}
      style={{backgroundColor: 'white'}}
      activeColor={Color.secondary}
      inactiveColor="black"
      labelStyle={{fontWeight: 'bold', textAlign: 'center'}}
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
