import React from 'react';
import { TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import TabForumNewPost from './TabForumNewPost';
import TabForumMyPost from './TabForumMyPost';
import Config from 'react-native-config';
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { accessClient } from 'src/utils/access_client';
import { useSelector } from 'react-redux';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const ForumScreen = ({ navigation, route }) => {
  const { Color } = useColor();
  const user = useSelector(state => state['user.auth'].login.user);

  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
  if (accessClient.UserGeneratedContent === 'ONLY_ADMIN' && user && user.isDirector === 1) canGeneratedContent = true;
  else if (accessClient.UserGeneratedContent === 'ONLY_MEMBER' && user && user.organizationId) canGeneratedContent = true;

  return (
    <Scaffold
      header={
        <Header
          title='Forum'
          centerTitle={false}
          actions={
            canGeneratedContent && <TouchableOpacity
              onPress={() => {
                const params = {
                  title: 'Buat Posting',
                  productType: Config.PRODUCT_TYPE,
                  productCategory: '',
                  productSubCategory: 'FORUM'
                };

                navigation.navigate('CreateThreadScreen', { ...params });
              }}
            >
              <AntDesign
                name='plus'
                size={24}
                color={Color.text}
                // onPress={() => navigation.navigate('CardDetailForum')}
              />
            </TouchableOpacity>
          }
        />
      }
    >
      <Container paddingVertical={16}>
        <SearchBar
          type='select'
          label='Cari postingan'
          onPress={() => {
            navigation.navigate('ForumSearch');
          }}
        />
      </Container>

      <Navigator
        initialRouteName="TabNewPost"
        tabBarOptions={{
          activeTintColor: Color.text,
          inactiveColor: Color.border,
          labelStyle: { fontSize: 12, fontWeight: 'bold' },
          style: {
            backgroundColor: Color.textInput,
          },
          labelStyle: { textTransform: 'none' },
          indicatorStyle: { backgroundColor: Color.primary },
        }}
        screenOptions={{
          
        }}
      >
        <Screen
          name="TabNewPost"
          component={TabForumNewPost}
          options={{ tabBarLabel: 'Beranda' }}
        />
        <Screen
          name="TabMyPost"
          component={TabForumMyPost}
          options={{ tabBarLabel: 'Postingan Saya' }}
        />
      </Navigator>
    </Scaffold>
  );
}

export default ForumScreen;