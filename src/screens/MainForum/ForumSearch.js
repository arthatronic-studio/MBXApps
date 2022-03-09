import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagesPath from 'src/components/ImagesPath';
import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  HeaderBig,
  Scaffold,
  Row,
  Col,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';
import Header from '@src/components/Header';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import {useColor} from '@src/components/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CardPlace from 'src/components/Posting/CardPlace';
import {Container, Divider} from 'src/styled';

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 100%;
  backgroundColor: #FFFFFF;
  padding: 4px 16px 4px 16px;
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

const DATA = [
  {
    id: 1,
    title: 'Gaming',
  },
  {
    id: 2,
    title: 'Coding',
  },
  {
    id: 3,
    title: 'Programmer',
  },
  {
    id: 4,
    title: 'Caferacer',
  },
];

const DATA_POPULER = [
  {
    id: 1,
    title: 'Sabyan',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 2,
    title: 'Tribesocial',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 3,
    title: 'Karang Taruna',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 4,
    title: 'Dunia Paralel',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
];

const ForumSearch = ({navigation, route}) => {
  const {Color} = useColor();
  // const renderItem = ({item}) => <Text>{item.title}</Text>;
  const ListSearch = item => {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 0.5,
          borderColor: Color.border,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text size="11">{item.title} </Text>
        <Ionicons name="arrow-forward" size={14} color={Color.primary} />
      </TouchableOpacity>
    );
  };

  const ListPopular = () => {
    return (
      <FlatList
        data={DATA_POPULER}
        keyExtractor={() => {
          DATA_POPULER.id;
        }}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 32,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 36,
                  width: 36,
                  backgroundColor: Color.grayLight,
                  borderRadius: 4,
                  marginRight: 10,
                }}
              />
              <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}>
                  <Image
                    source={ImagesPath.trendUp}
                    style={{marginRight: 10}}
                  />
                  <Text size="11">{item.title}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{height: 16, width: 16, marginRight: 4}}
                    source={ImagesPath.iconTypeG}
                  />
                  <Text size="8"> {item.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text size="11" style={{color: Color.primary}}>
                Lihat
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  return (
    <Scaffold
      header={
        <BottomSection style={{borderColor: Color.border}}>
          <BoxInput
            style={{
              backgroundColor: Color.textInput,
              borderColor: Color.border,
            }}>
            <TextInputNumber
              name="text"
              placeholder="Cari Topik apa kali ini  . . ."
              placeholderTextColor={Color.placeholder}
              returnKeyType="done"
              returnKeyLabel="Done"
              blurOnSubmit={false}
              onBlur={() => {}}
              error={null}
              onChangeText={text => {}}
              style={{
                backgroundColor: Color.textInput,
                color: Color.text,
              }}
            />
            <CircleSend
              style={{backgroundColor: Color.primary}}
              onPress={() => {}}>
              <Ionicons name="search" size={16} color={Color.text} />
            </CircleSend>
          </BoxInput>
        </BottomSection>
      }>
      <ScrollView>
        {/* LIST SEARCH */}
        {DATA.map(item => {
          return <ListSearch title={item.title} />;
        })}
        

        {/* EMPTY SEARCH */}
        
        {/* <Col style={{alignItems:'center',justifyContent:'space-around',height:90}}>
          <Row>
            <Image source={ImagesPath.searchEmpty} />
          </Row>
          <Row>
            <Text size="10" style={{color: Color.gray}}>
              Belum ada hasil pencarian terbaru
            </Text>
          </Row>
      
        </Col> */}

        <View paddingHorizontal={16}>
          <Divider height={16} />
          <View>
            <Text style={{marginBottom: 24}} align="left" size="11" type="bold">
              Topik Terpopuler
            </Text>
            {/* LIST POPULAR */}
            <ListPopular />
          </View>
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default ForumSearch;
