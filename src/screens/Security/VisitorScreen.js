import React, { useEffect, useState } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Scaffold, Text, useColor } from '@src/components';
import SearchBar from 'src/components/SearchBar';
import { Container, Divider, Row } from 'src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import imageAssets from 'assets/images';
import { getAPI } from 'src/api-rest/httpService';
import ImagesPath from 'src/components/ImagesPath';

const Tab = createMaterialTopTabNavigator();

const Active = ({ navigation, route }) => {
  const { Color } = useColor();

  const [visitorCount, setVisitorCount] = useState(0);
  const [listActive, setListActive] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    const result = await getAPI('user-activity');
    console.log(result);
    if (result.status) {
      setListActive(result.data.listData);
      setVisitorCount(result.data.totalPengunjung);
    }
  }

  return (
    <Scaffold
      showHeader={false}
    >
      <Container padding={16}>
        <Row>
          <Container paddingVertical={8} paddingHorizontal={16} radius={8} marginRight={8} color={Color.primaryMoreDark} style={{ borderWidth: 0.5, borderColor: Color.primaryMoreDark }}>
            <Text color={Color.textInput}>Semua</Text>
          </Container>
          
          <Container paddingVertical={8} paddingHorizontal={16} radius={8} marginRight={8} color={Color.theme} style={{ borderWidth: 0.5, borderColor: Color.primaryMoreDark }}>
            <Row>
              <Image
                source={imageAssets.male}
                style={{
                  height: 18,
                  width: 18,
                  marginRight: 8,
                }}
              />
              <Text>Laki-laki</Text>
            </Row>
          </Container>
          <Container paddingVertical={8} paddingHorizontal={16} radius={8} marginRight={8} color={Color.theme} style={{ borderWidth: 0.5, borderColor: Color.primaryMoreDark }}>
            <Row>
              <Image
                source={imageAssets.female}
                style={{
                  height: 18,
                  width: 18,
                  marginRight: 8,
                }}
              />
              <Text>Perempuan</Text>
            </Row>
          </Container>
        </Row>

        <Divider />

        {listActive.map((item, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                navigation.navigate('VisitorDetailScreen');
              }}
            >
              <Container paddingVertical={12}>
                <Row>
                  <Container height={32} width={32} radius={16} color={Color.border} marginRight={12}>
                    <Image
                      source={ImagesPath.avatar1}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Container>
                  
                  <Container>
                    <Text align='left' type='medium'>{item.user.name}</Text>
                    <Text align='left' size={12} color={Color.placeholder}>{item.user.activityInfo.checkinDate}</Text>
                    <Text align='left' size={12} color={Color.placeholder}>{item.user.activityInfo.checkinTime}</Text>
                  </Container>
                </Row>
              </Container>
            </TouchableOpacity>
          )
        })}
      </Container>
    </Scaffold>
  )
}

const CustomTabBar = (props) => {
  const { navigation, navigationState } = props;

  const { Color } = useColor();
  const { width } = useWindowDimensions();

  console.log(props);

  return (
    <Container paddingHorizontal={16}>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {navigationState.routes.map((item, idx) => {
          const isActive = navigationState.index === idx;
          const isFirst = idx === 0;
          const isLast = idx === (navigationState.routes.length - 1);
          const label = item.name === 'Active' ? 'Aktif' : 'Tidak Aktif';

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.65}
              onPress={() => {
                navigation.navigate(item.name);
              }}
            >
              <Container
                width={(width / navigationState.routes.length) - 16.5}
                color={isActive ? Color.primarySoft : 'transparent'}
                paddingVertical={12}
                style={
                  isFirst ? {
                    borderTopLeftRadius: 120,
                    borderBottomLeftRadius: 120,
                    borderWidth: 0.5,
                    borderRightWidth: 0.25,
                  } :
                    isLast ? {
                      borderTopRightRadius: 120,
                      borderBottomRightRadius: 120,
                      borderWidth: 0.5,
                      borderLeftWidth: 0.25,
                    } : {}
                }
              >
                <Text size={12} type='medium' letterSpacing={0.5}>{label}</Text>
              </Container>
            </TouchableOpacity>
          )
        })}
      </View>
    </Container>
  )
}

const VisitorScreen = ({ navigation, route }) => {
  const { Color } = useColor();

  const [visitorCount, setVisitorCount] = useState(0);
  const [listActive, setListActive] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    const result = await getAPI('user-activity');
    console.log(result);
    if (result.status) {
      setListActive(result.data.listData);
      setVisitorCount(result.data.totalPengunjung);
    }
  }

  return (
    <Scaffold>
      <Container paddingHorizontal={16} marginBottom={16}>
        <Text align='left' size={24}>{visitorCount}</Text>
        <Text align='left' size={12} letterSpacing={0.4}>Total Pengunjung</Text>
      </Container>

      <SearchBar
        label='Cari Pengunjung'
      />
      <Divider />
      <Tab.Navigator
        initialRouteName={'Active'}
        tabBarOptions={{
          indicatorStyle: { backgroundColor: Color.theme, height: '100%' },
          activeTintColor: Color.primary,
          activeBackgroundColor: Color.primary,
          inactiveTintColor: Color.secondary,
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: Color.secondary,
          },
          indicatorStyle: {
            borderBottomColor: Color.primary,
            borderBottomWidth: 2,
          },
          labelStyle: {
            fontSize: 12,
          },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen
          name="Active"
          component={Active}
        />
        <Tab.Screen
          name="Nonactive"
          component={Active}
        />
      </Tab.Navigator>
    </Scaffold>
  );
}

export default VisitorScreen;
