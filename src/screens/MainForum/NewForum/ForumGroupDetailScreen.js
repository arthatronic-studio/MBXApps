import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, Image, FlatList, Animated } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalContentOptionsGroupForum from 'src/components/ModalContentOptionsGroupForum';
import {
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import TabForumNewPost from '../TabForumNewPost';
import TabForumMyPost from '../TabForumMyPost';
import Config from 'react-native-config';
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { ScrollView } from 'react-native-gesture-handler';
import Moment from 'moment';
import WidgetForumGroup from './WidgetForumGroup';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const ForumDetailScreen = ({ navigation, route }) => {


  const params = route.params.data;

  console.log('ini route ', params);

  const { Color } = useColor();
  const modalOptionsRef = useRef();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {


    }}>
      <View style={{ flexDirection: 'row', marginVertical: 8, padding: 10, borderRadius: 10, justifyContent: 'space-between' }}>

        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item.image }}
            style={{
              borderRadius: 25,
              width: 50,
              height: 50,
              backgroundColor: Color.border,
              borderColor: Color.primary,
              marginHorizontal: 5
            }}
          />
          <View style={{ marginTop: 10, justifyContent: 'flex-start' }}>
            <Text type="bold">{item.title}</Text>

          </View>
        </View>


        <Feather onPress={() => {
          modalOptionsRef.current.open();
        }} name='more-vertical' size={20} />

      </View>
    </TouchableOpacity>

  );

  return (
    <Scaffold
      header={
        <Header
          title={params.name}
          centerTitle={false}
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <WidgetForumGroup
          item={params}
          isHighlight={false}
        />

        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: Color.gray, fontSize: 12, fontWeight: 'bold' }}>Moderator</Text>

          <View style={{ flexDirection: 'row', marginVertical: 8 }}>
            <Image
              source={{ uri: params.moderatorInfo.photoProfile ? params.moderatorInfo.photoProfile : 'https://i.postimg.cc/y6RYmPvd/Sample-User-Icon.png' }}
              style={{
                borderRadius: 25,
                width: 35,
                height: 35,
                backgroundColor: Color.border,
                borderColor: Color.primary,
                marginRight: 5,

              }}
            />
            <Text style={{ color: Color.text, marginTop: 5 }} >{params.moderatorInfo.firstName} {params.moderatorInfo.lastName}</Text>
          </View>

          <Text style={{ color: Color.gray, fontWeight: "bold", marginVertical: 5 }}>Topic</Text>
          <Text size={15}>{params.topic.name}</Text>

          <Text style={{ color: Color.gray, fontWeight: "bold", marginVertical: 5 }}>History Forum</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text size={15}>Forum dibuat pada</Text>
            <Text style={{ fontWeight: "bold" }}> {Moment(parseInt(params.createdAt)).format('Do MMMM YYYY')}</Text>
          </View>

          {params.status == 'PUBLISH' ?
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


              <Text size={15}>{params.member.length} Anggota Forum</Text>
              <TouchableOpacity onPress={() => {
                navigation.navigate('ForumGroupPermintaanScreen')
              }}>
                <Text style={{ fontWeight: "bold", color: '#F3771D' }}>({params.memberDataReq.length} Permintaan) </Text>
              </TouchableOpacity>
            </View>
            :
            <Text></Text>}
          {params.status !== 'PUBLISH' ?
            <FlatList
              data={params.member}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />

            : <Text></Text>
          }

          {params.status !== 'PUBLISH' ?
            <View style={{
              width: 200, height: 50, marginLeft: 80, borderRadius: 50, alignItems: 'center', justifyContent: 'center',

            }}
            >
              <TouchableOpacity
                onPress={() => { navigation.navigate('ForumGroupAllMemberScreen') }}
                style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}

              >
                <Text style={{ color: '#F3771D', fontWeight: 'bold' }}> Lihat Semua Anggota</Text>
              </TouchableOpacity>
            </View>

            : <Text></Text>
          }
        </View>
      </ScrollView>

      <ModalContentOptionsGroupForum
        ref={modalOptionsRef}


      />
    </Scaffold>
  );
}

export default ForumDetailScreen;